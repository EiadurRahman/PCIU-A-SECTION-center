# Prompt: Build the PCIU class content library + upload pages

Paste this whole prompt back to Claude, along with the code context listed
at the bottom, to pick this up later.

## Context

- Hugo site, source on a **private GitHub repo**, deployed via **Netlify**
  (static build only — no server-side code runs on Netlify).
- File storage is a **private Backblaze B2 bucket** (S3-compatible API).
- A **Cloudflare Worker** sits between the site and the bucket: it holds the
  B2 credentials, handles auth (pre-shared secret for write actions), issues
  presigned upload/download URLs, and sets CORS headers for the Netlify
  domain. Assume the Worker already exists — ask to see its current routes
  before adding new ones, and extend rather than replace it.
- UI style: dark glassmorphic single-page look (see PCIU.jpg reference if
  provided), Tailwind CSS utility classes, matching the rest of the Hugo
  site's existing design.

## Bucket / library structure (fixed convention)

```
<COURSE-CODE>/<CATEGORY>/<files or numbered subfolders>
```

- 6 fixed courses, each its own card:
  - `ACC-100` — Financial Accounting
  - `BUS 100` — Introduction to Business
  - `ENG 101` — English Composition
  - `HIST-101` — History of Bangladesh
  - `MGT 200` — Principles of Management
  - `MKT 200` — Principles of Marketing
- Each course has exactly 3 fixed categories, always present even if empty:
  - `CLS-CONTENT` — lecture slides, textbooks, PDFs
  - `CLS-NOTE` — photographed class notes (images)
  - `HW` — homework, may contain numbered subfolders per assignment (e.g.
    `HW/01/`, `HW/02/`) holding photos/scans of submitted work
- Course codes and category names are exact object-key prefixes in the
  bucket — don't reformat them (e.g. keep the space in `"BUS 100"` if
  that's what the bucket actually uses; confirm the real prefixes from a
  `list` call rather than assuming).

## What to build

**1. Library page** (`library.html` or equivalent Hugo layout)
- Landing view: 6 course cards in a grid (glassmorphic style), always
  visible even for courses with no files yet.
- Click a course card → show its 3 category cards/tabs (CLS-CONTENT,
  CLS-NOTE, HW), with a breadcrumb or back button to return to the course
  grid.
- Click a category → list its files (and, for HW, its numbered
  subfolders — clicking one drills into that subfolder). Each file row
  shows name, maybe size/type icon, and a download action.
- All of this is populated **client-side at page load** via `fetch()` to
  the Worker's list endpoint (Hugo can't know bucket contents at build
  time) — render the tree from the JSON response, don't hardcode course
  contents.
- Download either hits a Worker route that returns a presigned B2 URL
  (browser downloads directly from B2), or proxies the file — prefer the
  presigned-URL approach for anything but tiny files.
- Empty states: a category or course with zero files should say so
  clearly, not look broken.

**2. Upload page** (`upload.html` or a modal on the library page)
- Course dropdown/select (the same 6 fixed courses), category select
  (CLS-CONTENT / CLS-NOTE / HW), and for HW an assignment-number field
  (maps to the `HW/NN/` subfolder).
- File picker, with a progress indicator during upload.
- On submit: request a presigned upload URL from the Worker for the
  computed key (`<course>/<category>/[<hw-number>/]<filename>`), then
  `PUT` the file directly to B2 from the browser.
- Enforce sane limits client-side before uploading: file size cap,
  allowed extensions for the given category (adjust as needed) — the
  Worker should also enforce these server-side, don't rely on the client
  alone.

## Deliverables expected

- Hugo template/layout files (Tailwind markup) for both pages.
- Vanilla JS (or whatever the existing site already uses) for: fetching
  the file list, rendering the drill-down UI (course → category →
  files/subfolders), handling download clicks, and handling the upload
  flow with a progress bar.
- Any new/changed Worker routes needed to support the above (`list`,
  presigned `download`, presigned `upload`), matching the existing auth
  pattern already in use.

## Code context to provide when starting this

- Current Worker source (routes, auth, CORS setup).
- Existing Hugo layout(s)/partials this should match stylistically, plus
  the Tailwind config.
- The PCIU.jpg UI reference image, if the exact visual style needs to be
  matched.
- Actual current bucket contents (a real `list` response) rather than
  assuming the tree above is exhaustive or unchanging.
