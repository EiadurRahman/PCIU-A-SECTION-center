import os
import sys
import threading

import boto3
from dotenv import load_dotenv


class _ProgressPercentage:
    """boto3 upload_file Callback that prints a single-line progress bar.

    boto3 calls this from an internal thread, possibly more than one
    at a time when using TransferConfig with multipart uploads, so a
    lock is used to keep the byte counter and the printed line correct.
    """

    def __init__(self, filename, size, label=None):
        self._filename = label or os.path.basename(filename)
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


class Blackblaze:
    def __init__(self, bucket_name=None):
        load_dotenv()

        # initializing backblaze client
        self.ENDPOINT = "https://s3.us-east-005.backblazeb2.com"
        self.client = boto3.client("s3", endpoint_url=self.ENDPOINT)
        self.BUCKET_NAME = bucket_name

    def _bucket_name(self, bucket_name=None):
        bucket_name = bucket_name or self.BUCKET_NAME
        if not bucket_name:
            raise ValueError("bucket_name must be provided")
        return bucket_name

    def list_buckets(self):
        response = self.client.list_buckets()
        return response

    def list_files(self, prefix="", bucket_name=None):
        try:
            bucket_name = self._bucket_name(bucket_name)
            files = []
            paginator = self.client.get_paginator("list_objects_v2")
            for page in paginator.paginate(Bucket=bucket_name, Prefix=prefix):
                files.extend(obj["Key"] for obj in page.get("Contents", []))
            return files
        except Exception as e:
            print(f"Error listing files: {e}")
            return []

    def _object_exists(self, object_name, bucket_name):
        try:
            self.client.head_object(Bucket=bucket_name, Key=object_name)
            return True
        except Exception:
            return False

    # ---------------------------------------------------------------
    # Upload
    # ---------------------------------------------------------------

    def upload_file(self, file_path, object_name=None, bucket_name=None, show_progress=True):
        """Upload a single local file."""
        try:
            bucket_name = self._bucket_name(bucket_name)
            object_name = object_name or os.path.basename(file_path)
            size = os.path.getsize(file_path)

            callback = _ProgressPercentage(file_path, size, label=object_name) if show_progress else None
            self.client.upload_file(file_path, bucket_name, object_name, Callback=callback)

            if not show_progress:
                print(f"File {file_path} uploaded to bucket {bucket_name} as {object_name}.")
        except Exception as e:
            print(f"Error uploading file {file_path}: {e}")

    def upload_directory(self, dir_path, prefix="", bucket_name=None, show_progress=True):
        """Recursively upload a directory, preserving its structure under `prefix`.

        Produces an exact mirror: dir_path/sub/file.txt -> prefix/sub/file.txt
        """
        bucket_name = self._bucket_name(bucket_name)
        dir_path = os.path.abspath(dir_path)
        if not os.path.isdir(dir_path):
            raise NotADirectoryError(f"{dir_path} is not a directory")

        # gather all files first so we can report overall progress
        file_list = []
        for root, _dirs, files in os.walk(dir_path):
            for name in files:
                full_path = os.path.join(root, name)
                rel_path = os.path.relpath(full_path, dir_path).replace(os.sep, "/")
                object_name = f"{prefix.rstrip('/')}/{rel_path}" if prefix else rel_path
                file_list.append((full_path, object_name))

        total = len(file_list)
        if total == 0:
            print(f"No files found under {dir_path}.")
            return

        for i, (full_path, object_name) in enumerate(file_list, start=1):
            if show_progress:
                print(f"[{i}/{total}] ", end="")
            self.upload_file(full_path, object_name, bucket_name, show_progress=show_progress)

        print(f"Uploaded {total} files from {dir_path} to bucket {bucket_name}.")

    def upload(self, path, object_name=None, bucket_name=None, show_progress=True):
        """Upload a file or a whole directory tree, detected automatically."""
        if os.path.isdir(path):
            self.upload_directory(path, prefix=object_name or "", bucket_name=bucket_name, show_progress=show_progress)
        elif os.path.isfile(path):
            self.upload_file(path, object_name=object_name, bucket_name=bucket_name, show_progress=show_progress)
        else:
            raise FileNotFoundError(path)

    # ---------------------------------------------------------------
    # Download
    # ---------------------------------------------------------------

    def download_file(self, object_name, file_path, bucket_name=None):
        try:
            bucket_name = self._bucket_name(bucket_name)
            os.makedirs(os.path.dirname(file_path) or ".", exist_ok=True)
            self.client.download_file(bucket_name, object_name, file_path)
            print(f"File {object_name} downloaded from bucket {bucket_name} to {file_path}.")
        except Exception as e:
            print(f"Error downloading file: {e}")

    # ---------------------------------------------------------------
    # Delete
    # ---------------------------------------------------------------

    def delete_file(self, object_name, bucket_name=None):
        try:
            bucket_name = self._bucket_name(bucket_name)
            self.client.delete_object(Bucket=bucket_name, Key=object_name)
            print(f"File {object_name} deleted from bucket {bucket_name}.")
        except Exception as e:
            print(f"Error deleting file: {e}")

    def delete_directory(self, prefix, bucket_name=None):
        """Delete every object under `prefix` (a directory-style key prefix)."""
        try:
            bucket_name = self._bucket_name(bucket_name)
            prefix = prefix.rstrip("/") + "/"
            keys = self.list_files(prefix=prefix, bucket_name=bucket_name)
            if not keys:
                print(f"No objects found under prefix {prefix}.")
                return

            # delete_objects accepts at most 1000 keys per call
            for start in range(0, len(keys), 1000):
                batch = keys[start:start + 1000]
                self.client.delete_objects(
                    Bucket=bucket_name,
                    Delete={"Objects": [{"Key": k} for k in batch]},
                )
            print(f"Deleted {len(keys)} objects under prefix {prefix} from bucket {bucket_name}.")
        except Exception as e:
            print(f"Error deleting directory {prefix}: {e}")

    def delete(self, target, bucket_name=None):
        """Delete a single object or, if `target` matches a prefix, an entire directory tree."""
        bucket_name = self._bucket_name(bucket_name)

        if self._object_exists(target, bucket_name):
            self.delete_file(target, bucket_name)
            return

        # not an exact object key -> treat it as a directory prefix
        if self.list_files(prefix=target.rstrip("/") + "/", bucket_name=bucket_name):
            self.delete_directory(target, bucket_name)
        else:
            print(f"No object or directory found matching '{target}' in bucket {bucket_name}.")


if __name__ == "__main__":
    bb = Blackblaze(bucket_name="pciu-bba-37")

    # # single file
    # bb.upload("/home/eiadurrahman/Desktop/bba-study-content/ACC-100-FInancial-Accounting/"
    #           "Accounting_Principles_12th_Edition_by_Jerry_Weygandt.pdf")

    # # whole directory, mirrored under the given prefix
    bb.upload("/home/eiadurrahman/Desktop/bba-study-content/Introduction to business",
              object_name="Introduction to business")

    # # delete a single file or an entire mirrored directory - same call either way
    # bb.delete("Accounting_Principles_12th_Edition_by_Jerry_Weygandt.pdf")
    # bb.delete("ACC-100-FInancial-Accounting")
    
    files = bb.list_files()
    print(f"Files in bucket: {files}")