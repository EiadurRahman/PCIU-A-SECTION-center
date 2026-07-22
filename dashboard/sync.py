"""
Mirror a local directory to a Backblaze B2 (S3-compatible) bucket, one-way,
local -> remote, using boto3 directly.

Uploads new/changed files and deletes remote objects that no longer exist
locally, so the bucket ends up an exact copy of BASE_DIR.

Set BASE_DIR and BUCKET_NAME below.

Usage:
    python sync.py
    python sync.py --prefix backups/laptop
    python sync.py --dry-run
    python sync.py --no-delete
"""

import argparse
import fnmatch
import json
import os
import sys
import threading

import boto3
from dotenv import load_dotenv

BASE_DIR = "/home/eiadurrahman/Desktop/bba-study-content"  # local directory to mirror
BUCKET_NAME = "pciu-bba-37"  # target bucket
ENDPOINT_URL = "https://s3.us-east-005.backblazeb2.com"

STATE_FILENAME = ".b2sync_state.json"  # kept in BASE_DIR, never uploaded


# ---------------------------------------------------------------------
# progress bar
# ---------------------------------------------------------------------

class _ProgressPercentage:
    """boto3 upload_file Callback that prints a single-line progress bar."""

    def __init__(self, filename, size):
        self._filename = os.path.basename(filename)
        self._size = size or 1  # avoid div-by-zero for empty files
        self._seen_so_far = 0
        self._lock = threading.Lock()

    def __call__(self, bytes_amount):
        with self._lock:
            self._seen_so_far += bytes_amount
            pct = (self._seen_so_far / self._size) * 100
            bar_len = 30
            filled = int(bar_len * self._seen_so_far // self._size)
            bar = "#" * filled + "-" * (bar_len - filled)
            sys.stdout.write(
                f"\r{self._filename[:40]:40} [{bar}] "
                f"{self._seen_so_far / 1_048_576:8.2f}/{self._size / 1_048_576:.2f} MB "
                f"({pct:5.1f}%)"
            )
            sys.stdout.flush()
            if self._seen_so_far >= self._size:
                sys.stdout.write("\n")


# ---------------------------------------------------------------------
# .gitignore support
# ---------------------------------------------------------------------
#
# Every dotfile/dotdir (.git, .gitignore, .env, .DS_Store, ...) is always
# skipped outright, regardless of any .gitignore content. On top of that,
# every .gitignore found anywhere in the tree is parsed and its rules are
# applied to that .gitignore's own subtree, the same way git scopes them.
#
# This covers the common cases (comments, blank lines, "!" negation,
# trailing "/" for directory-only, leading "/" for anchoring, "*"/"?"/"[]"
# wildcards) but is not a full implementation of git's matching spec.

def _parse_gitignore_file(path):
    lines = []
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            for raw in f:
                line = raw.rstrip("\n")
                stripped = line.strip()
                if not stripped or stripped.startswith("#"):
                    continue
                lines.append(line)
    except OSError:
        pass
    return lines


class GitignoreMatcher:
    def __init__(self, base_dir):
        # each rule: (anchor_dir, pattern, negate, dir_only, anchored)
        self.rules = []
        for root, dirs, files in os.walk(base_dir):
            dirs[:] = [d for d in dirs if not d.startswith(".")]
            if ".gitignore" not in files:
                continue
            anchor = os.path.relpath(root, base_dir).replace(os.sep, "/")
            anchor = "" if anchor == "." else anchor
            for raw in _parse_gitignore_file(os.path.join(root, ".gitignore")):
                negate = raw.startswith("!")
                patt = raw[1:] if negate else raw
                dir_only = patt.endswith("/")
                if dir_only:
                    patt = patt.rstrip("/")
                anchored = patt.startswith("/")
                patt = patt.lstrip("/")
                if patt:
                    self.rules.append((anchor, patt, negate, dir_only, anchored))

    def _matches_rule(self, anchor, patt, anchored, rel_path):
        if anchor and not (rel_path == anchor or rel_path.startswith(anchor + "/")):
            return False
        sub_path = rel_path[len(anchor):].lstrip("/") if anchor else rel_path
        if not sub_path:
            return False
        if anchored or "/" in patt:
            return fnmatch.fnmatch(sub_path, patt)
        # bare pattern: matches any path component (basename anywhere below the anchor)
        return any(fnmatch.fnmatch(part, patt) for part in sub_path.split("/"))

    def is_ignored(self, rel_path, is_dir=False):
        rel_path = rel_path.replace(os.sep, "/")
        parts = rel_path.split("/")
        ignored = False
        for anchor, patt, negate, dir_only, anchored in self.rules:
            if dir_only and not is_dir:
                # a directory-only pattern still hides every file under a matching ancestor dir
                hit = any(
                    self._matches_rule(anchor, patt, anchored, "/".join(parts[:i]))
                    for i in range(1, len(parts))
                )
            else:
                hit = self._matches_rule(anchor, patt, anchored, rel_path)
            if hit:
                ignored = not negate
        return ignored


# ---------------------------------------------------------------------
# state file (tracks what we've already uploaded, to skip unchanged files)
# ---------------------------------------------------------------------

def _load_state(state_path):
    if os.path.exists(state_path):
        with open(state_path) as f:
            return json.load(f)
    return {}


def _save_state(state_path, state):
    with open(state_path, "w") as f:
        json.dump(state, f, indent=2)


def _scan_local(base_dir, matcher):
    """Return {relative_path: (mtime, size, full_path)} for every file under base_dir,
    skipping dotfiles/dotdirs and anything matched by .gitignore."""
    entries = {}
    for root, dirs, files in os.walk(base_dir):
        rel_root = os.path.relpath(root, base_dir).replace(os.sep, "/")
        rel_root = "" if rel_root == "." else rel_root

        kept_dirs = []
        for d in dirs:
            if d.startswith("."):
                continue
            rel_dir = f"{rel_root}/{d}" if rel_root else d
            if matcher.is_ignored(rel_dir, is_dir=True):
                continue
            kept_dirs.append(d)
        dirs[:] = kept_dirs

        for name in files:
            if name.startswith("."):
                continue
            rel_path = f"{rel_root}/{name}" if rel_root else name
            if rel_path == STATE_FILENAME:
                continue
            if matcher.is_ignored(rel_path, is_dir=False):
                continue
            full_path = os.path.join(root, name)
            stat = os.stat(full_path)
            entries[rel_path] = (stat.st_mtime, stat.st_size, full_path)
    return entries


def _list_remote_keys(client, bucket_name, prefix):
    keys = []
    paginator = client.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=bucket_name, Prefix=prefix):
        keys.extend(obj["Key"] for obj in page.get("Contents", []))
    return keys


# ---------------------------------------------------------------------
# sync
# ---------------------------------------------------------------------

def sync_directory(client, base_dir, bucket_name, prefix="", dry_run=False, delete_remote=True):
    base_dir = os.path.abspath(base_dir)
    if not os.path.isdir(base_dir):
        raise NotADirectoryError(base_dir)

    state_path = os.path.join(base_dir, STATE_FILENAME)
    prev_state = _load_state(state_path)

    matcher = GitignoreMatcher(base_dir)
    local_files = _scan_local(base_dir, matcher)
    local_keys = set(local_files.keys())

    remote_prefix = prefix.rstrip("/") + "/" if prefix else ""
    remote_keys = set(_list_remote_keys(client, bucket_name, remote_prefix))
    remote_rel_keys = {k[len(remote_prefix):] for k in remote_keys} if remote_prefix else remote_keys

    # decide what needs uploading: new, changed (mtime/size vs last sync), or
    # missing from the bucket even though our state thinks it was uploaded
    to_upload = []
    for rel_path, (mtime, size, full_path) in local_files.items():
        prev = prev_state.get(rel_path)
        changed = prev is None or prev.get("mtime") != mtime or prev.get("size") != size
        missing_remote = rel_path not in remote_rel_keys
        if changed or missing_remote:
            object_name = f"{remote_prefix}{rel_path}" if remote_prefix else rel_path
            to_upload.append((full_path, object_name, rel_path, mtime, size))

    # anything remote that has no local counterpart gets removed to keep the mirror exact
    to_delete_rel = remote_rel_keys - local_keys
    to_delete_keys = [f"{remote_prefix}{r}" if remote_prefix else r for r in to_delete_rel]

    print(f"Local files: {len(local_files)} | Remote objects: {len(remote_rel_keys)}")
    print(f"To upload: {len(to_upload)} | To delete remotely: {len(to_delete_keys)}")

    if dry_run:
        for _, object_name, *_ in to_upload:
            print(f"  [upload] {object_name}")
        if delete_remote:
            for key in to_delete_keys:
                print(f"  [delete] {key}")
        return

    new_state = dict(prev_state)

    for i, (full_path, object_name, rel_path, mtime, size) in enumerate(to_upload, start=1):
        print(f"[{i}/{len(to_upload)}] ", end="")
        try:
            client.upload_file(
                full_path, bucket_name, object_name,
                Callback=_ProgressPercentage(full_path, size),
            )
            new_state[rel_path] = {"mtime": mtime, "size": size}
        except Exception as e:
            print(f"\nError uploading {full_path}: {e}")

    if delete_remote and to_delete_keys:
        # delete_objects accepts at most 1000 keys per call
        for start in range(0, len(to_delete_keys), 1000):
            batch = to_delete_keys[start:start + 1000]
            try:
                client.delete_objects(
                    Bucket=bucket_name,
                    Delete={"Objects": [{"Key": k} for k in batch]},
                )
            except Exception as e:
                print(f"Error deleting batch: {e}")
        for rel_path in to_delete_rel:
            new_state.pop(rel_path, None)
    elif to_delete_keys:
        print(f"Skipped deleting {len(to_delete_keys)} remote-only objects (--no-delete).")

    _save_state(state_path, new_state)
    print("Sync complete.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--prefix", default="", help="key prefix in the bucket, e.g. backups/laptop")
    parser.add_argument("--dry-run", action="store_true", help="print what would change, do nothing")
    parser.add_argument("--no-delete", action="store_true", help="never delete remote-only objects")
    args = parser.parse_args()

    load_dotenv()
    s3_client = boto3.client("s3", endpoint_url=ENDPOINT_URL)

    sync_directory(
        s3_client,
        BASE_DIR,
        BUCKET_NAME,
        prefix=args.prefix,
        dry_run=args.dry_run,
        delete_remote=not args.no_delete,
    )