# Project Context: pciuAsec

## Project Structure

```
content/
    _index.md
    about.md
    howto.md
    library.md
    upload.md
layouts/
    _default/
        baseof.html
        single.html
    about/
        single.html
    index.html
    library/
        single.html
    partials/
        class_card.html
        navbar.html
    upload/
        single.html
netlify/
    functions/
        _b2-client.js
        list-files.js
        presign-download.js
        presign-upload.js
static/
    assets/
        google-docs-black-thick-outline-24173_32.png
        pdf-3375_32.png
        presentation-1470_32.png
    images/
        Logo.png
        background.png
        background.webp
        background_m.png
        background_m.webp
        favicon_io/
            android-chrome-192x192.png
            android-chrome-512x512.png
            apple-touch-icon.png
            favicon-16x16.png
            favicon-32x32.png
            favicon.ico
            site.webmanifest
        howto/
            lib1.png
            lib2.png
            lib3.png
            routine_card.png
            upload.png
        me.webp
    js/
        library.js
        main.js
        settings.js
        upload.js
```

## Project Files

### content/_index.md

```markdown
---
title: "Dashboard Home"
---

```

### content/upload.md

```markdown
---
title: "Upload Files"
layout: "single"
type: "upload"
---
```

### content/about.md

```markdown
---
title: "About Us"
layout: "single"
type: "about"       
---
```

### content/library.md

```markdown
---
title: "Class Library"
layout: "single"
type: "library"
---

```

### content/howto.md

```markdown
---
title: "How to use this site?"       
date : "2026-07-24"
---

Well hello, it's me! The dev of the Yaad project. This site is fairly straightforward to use, but I still made this simple guide for anyone struggling with it.

----
<!-- home page -->
<div style="padding:10px">
<h1 style="font-size:2.5em">Home page:</h1>
  <p>The home page consists of a simple class routine that automatically updates every day.
  An admin can also add short notes under the class cards.</p>
  <div style="display:flex; justify-content:center; padding:10px">
    <img src="/images/howto/routine_card.png" loading="lazy" style="width: 100%; max-width: 750px; height: auto; border-radius: 16px;" alt="Routine card preview">
  </div>
</div>

----

<!-- upload -->
<!-- Upload Section -->

<h1 style="font-size:2.5em">Upload:</h1>

This page is where you upload course materials. Follow the options below:

| Field | Description |
| :--- | :--- |
| **Course** | Select the corresponding subject from the menu. |
| **Category** | What type of content is this? Choose from *Professor's Slides*, *Student Notes*, or *Homework/Assignments*. |
| **Index** *(Homework only)* |  Enter the class/lecture number for which the HW was given (e.g., `1`). |
| **Access Password** | Prevents unauthorized uploads. |

> **Note:** Due to current limits, you can only upload **1 file at a time**.

<div align="center">
  <img src="/images/howto/upload.png" loading="lazy" alt="Upload Page Preview" style="border-radius: 12px; max-width: 550px; width: 100%;">
</div>

---

----
<!-- library -->
<div style="padding:10px">
<h1 style="font-size:2.5em">Library:</h1>
<p>In this tab, everything is organized and ready for you to download.</p>
<p>This section is self-explanatory.</p>
<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:20px; padding:10px; width:100%; align-items:start;">
    <img src="/images/howto/lib1.png" loading="lazy" style="width:100%; height:auto; border-radius:16px; display:block;" alt="library card preview">
    <img src="/images/howto/lib2.png" loading="lazy" style="width:100%; height:auto; border-radius:16px; display:block;" alt="upload card preview">
    <img src="/images/howto/lib3.png" loading="lazy" style="width:100%; height:auto; border-radius:16px; display:block;" alt="upload card preview">
</div>
</div>

---
```

### layouts/index.html

```html
{{ define "main" }}
{{ partial "class_card.html" . }}
{{ end }}
```

### layouts/_default/baseof.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ block "title" . }}{{ .Site.Title }}{{ end }}</title>
    <script>
        (function () {
            var theme = localStorage.getItem('color-theme');
            var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (theme === 'dark' || (!theme && systemDark)) {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>

    {{ with resources.Get "css/main.css" }}
    {{ $opts := dict "minify" (not hugo.IsDevelopment) }}
    {{ with . | css.TailwindCSS $opts }}
    {{ if hugo.IsDevelopment }}
    <link rel="stylesheet" href="{{ .RelPermalink }}">
    {{ else }}
    {{ with . | fingerprint }}
    <link rel="stylesheet" href="{{ .RelPermalink }}" integrity="{{ .Data.Integrity }}" crossorigin="anonymous">
    {{ end }}
    {{ end }}
    {{ end }}
    {{ end }}

    <link rel="apple-touch-icon" sizes="180x180" href="{{ "images/favicon_io/apple-touch-icon.png" | relURL }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ "images/favicon_io/favicon-32x32.png" | relURL }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ "images/favicon_io/favicon-16x16.png" | relURL }}">
    <link rel="manifest" href="{{ "images/favicon_io/site.webmanifest" | relURL }}">
    


</head>

<body
    class="h-full min-h-screen bg-[url('/images/background_m.webp')] md:bg-[url('/images/background.webp')] bg-cover bg-center bg-fixed dark:bg-neutral-950 text-black dark:text-white transition-colors duration-300 flex flex-col">

    <div class="pointer-events-none fixed inset-0 z-0 hidden dark:block bg-black/40 transition-opacity duration-300">
    </div>

    <header class="relative z-10">
        {{ partial "navbar.html" . }}
    </header>

    <main class="relative z-10 flex-grow max-w-6xl w-full mx-auto p-6 md:py-10">
        {{ block "main" . }}{{ end }}
    </main>

    <script src="{{ "js/main.js" | relURL }}" defer></script>
</body>

</html>
```

### layouts/_default/single.html

```html
{{ define "main" }}
<article class="space-y-4">
    <div
        class="mt-4 rounded-xl border border-black/10 bg-white/50 p-4 text-black shadow-sm backdrop-blur-sm transition-colors duration-300 prose prose-lg max-w-none dark:border-white/10 dark:bg-black/50 dark:text-slate-100">
        <div class="flex items-center justify-between gap-4">
            <h2 class="text-2xl font-bold">{{ .Title }}</h2>
            <a href="/"
                style="display:inline-block; padding: 10px 18px; border-radius: 999px; text-decoration: none; font-weight: 700; background: var(--accent-color, #535353); color: var(--text-on-accent, #ffffff); box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s ease;"
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.25)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';">Go
                to Home Page</a>
        </div>
    </div>

    <div
        class="content mt-4 rounded-xl border border-black/10 bg-white/50 p-4 text-black shadow-sm backdrop-blur-sm transition-colors duration-300 prose prose-lg max-w-none dark:border-white/10 dark:bg-black/50 dark:text-slate-100">
        {{ .RawContent | markdownify }}
    </div>
</article>
{{ end }}
```

### layouts/partials/navbar.html

```html
<nav class="sticky top-0 z-50 bg-white/30 dark:bg-black/50 backdrop-blur-md border-b border-black/5 dark:border-white/5 transition-colors duration-300">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">

      <a href="{{ "/" | relLangURL }}" class="flex items-center shrink-0 gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white rounded">
        {{ with .Site.Params.logo }}
        <img
          src="{{ . | relURL }}"
          alt="{{ $.Site.Title }}"
          style="height: {{ $.Site.Params.logoHeight | default "36px" }};"
          class="w-auto"
        >
        {{ else }}
        <span class="text-lg font-semibold tracking-tight text-black dark:text-white">
          {{ .Site.Title }}
        </span>
        {{ end }}
      </a>

      <div class="hidden md:flex items-center gap-1">
        {{ range .Site.Menus.main }}
          {{ $active := or ($.IsMenuCurrent "main" .) ($.HasMenuCurrent "main" .) }}
          {{ $base := "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 " }}
          {{ $activeClass := "text-black dark:text-white bg-black/5 dark:bg-white/10" }}
          {{ $inactiveClass := "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5" }}
          {{ $class := print $base (cond $active $activeClass $inactiveClass) }}
          <a href="{{ .URL | relLangURL }}" class="{{ $class }}">{{ .Name }}</a>
        {{ end }}
      </div>

      <div class="flex items-center gap-1">
        <button
          id="theme-toggle"
          type="button"
          aria-label="Toggle dark mode"
          class="p-2 rounded-md text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
        >
          <svg class="block dark:hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
          <svg class="hidden dark:block w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z"></path>
          </svg>
        </button>

        <button
          id="mobile-menu-button"
          type="button"
          aria-label="Open menu"
          aria-expanded="false"
          aria-controls="mobile-menu"
          class="md:hidden p-2 rounded-md text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
        >
          <svg id="hamburger-icon" class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg id="close-icon" class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <div id="mobile-menu" class="hidden md:hidden border-t border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md">
    <div class="px-4 py-3 space-y-1">
      {{ range .Site.Menus.main }}
        {{ $active := or ($.IsMenuCurrent "main" .) ($.HasMenuCurrent "main" .) }}
        {{ $base := "block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 " }}
        {{ $activeClass := "text-black dark:text-white bg-black/5 dark:bg-white/10" }}
        {{ $inactiveClass := "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5" }}
        {{ $class := print $base (cond $active $activeClass $inactiveClass) }}
        <a href="{{ .URL | relLangURL }}" class="{{ $class }}">{{ .Name }}</a>
      {{ end }}
    </div>
  </div>
</nav>
```

### layouts/partials/class_card.html

```html
<!--
  Today's Class card — fully client-side.
  No Hugo template logic is used to render data, so this partial never needs
  a rebuild/redeploy when data/classes.json changes on GitHub. All fetching,
  day-matching (using the visitor's own clock), and rendering happens in the
  browser via the script at the bottom.

  Sizing note: this does NOT use Tailwind breakpoints (md:) to reflow the
  layout on small screens. Every box, gap, and font uses clamp()-based fluid
  CSS instead, so the structure (3-column grid, single-row header) stays
  identical from a phone up to a laptop — it just scales down continuously
  with the viewport instead of stacking/reordering at a breakpoint.

  Theme note: colors use Tailwind's `dark:` variant to follow the site-wide
  dark/light toggle in the navbar (the `dark` class on <html>) rather than
  being hardcoded to the dark palette. No extra JS is needed here — the
  navbar's existing theme-toggle script already flips the `dark` class.
-->

<style>
    #class-card-root {
        padding: clamp(0.75rem, 4vw, 1.5rem);
        border-radius: clamp(1rem, 5vw, 2rem);
        margin-top: clamp(1rem, 3vw, 2rem);
        margin-bottom: clamp(1rem, 3vw, 2rem);
    }

    /* Top info row (Program / Semester / Batch) */
    #class-card-root .cc-topinfo {
        font-size: clamp(0.58rem, 1.9vw, 0.75rem);
        padding-left: clamp(0.15rem, 1vw, 1rem);
        padding-right: clamp(0.15rem, 1vw, 1rem);
        padding-bottom: clamp(0.5rem, 2vw, 0.75rem);
        margin-bottom: clamp(0.6rem, 2.5vw, 1rem);
        gap: clamp(0.35rem, 1.5vw, 0.5rem);
    }

    /* Header row: day | title | date, always one row */
    #class-card-root .cc-header {
        padding-left: clamp(0.15rem, 1vw, 1rem);
        padding-right: clamp(0.15rem, 1vw, 1rem);
        padding-bottom: clamp(0.6rem, 2.5vw, 1rem);
        margin-bottom: clamp(0.6rem, 2.5vw, 2rem);
        gap: clamp(0.4rem, 2vw, 1rem);
    }

    #class-card-root .cc-title {
        font-size: clamp(0.8rem, 3.4vw, 1.5rem);
        letter-spacing: clamp(0.03em, 0.6vw, 0.2em);
        white-space: nowrap;
    }

    #class-card-root .cc-daydate {
        font-size: clamp(0.55rem, 2vw, 0.875rem);
        white-space: nowrap;
    }

    /* Class grid: always 3 columns, never stacks */
    #class-card-root .cc-grid {
        gap: clamp(0.4rem, 2.2vw, 1.5rem);
        margin-bottom: clamp(0.75rem, 3vw, 2rem);
    }

    #class-card-root .cc-item {
        padding: clamp(0.4rem, 2.6vw, 1.25rem);
        border-radius: clamp(0.55rem, 3vw, 1.5rem);
        min-height: clamp(72px, 20vw, 140px);
    }

    #class-card-root .cc-item-title {
        font-size: clamp(0.6rem, 2.6vw, 1rem);
    }

    #class-card-root .cc-item-sub {
        font-size: clamp(0.55rem, 2vw, 0.875rem);
        margin-top: clamp(0.1rem, 0.6vw, 0.25rem);
    }

    #class-card-root .cc-item-meta {
        font-size: clamp(0.5rem, 1.6vw, 0.75rem);
        margin-top: clamp(0.4rem, 1.8vw, 1rem);
        padding-top: clamp(0.2rem, 1vw, 0.5rem);
    }

    #class-card-root .cc-item-note {
        font-size: clamp(0.46rem, 1.4vw, 0.7rem);
        margin-top: clamp(0.15rem, 0.8vw, 0.3rem);
    }

    #class-card-root .cc-empty {
        padding-top: clamp(1.25rem, 6vw, 3rem);
        padding-bottom: clamp(1.25rem, 6vw, 3rem);
        border-radius: clamp(0.55rem, 3vw, 1.5rem);
    }

    #class-card-root .cc-empty-title {
        font-size: clamp(0.68rem, 2.6vw, 1.125rem);
    }

    #class-card-root .cc-empty-sub {
        font-size: clamp(0.55rem, 1.6vw, 0.75rem);
        margin-top: clamp(0.1rem, 0.6vw, 0.15rem);
    }

    /* Coordinator block */
    #class-card-root .cc-coord {
        padding: clamp(0.6rem, 3vw, 1.5rem);
        border-radius: clamp(0.55rem, 3vw, 1.5rem);
        font-size: clamp(0.55rem, 1.9vw, 0.875rem);
        gap: clamp(0.15rem, 0.8vw, 0.375rem);
    }

    #class-card-root .cc-coord-row {
        gap: clamp(0.2rem, 1vw, 0.375rem);
    }

    #class-card-root .cc-coord-label {
        min-width: clamp(72px, 17vw, 150px);
    }
</style>

<div id="class-card-root" class="max-w-4xl mx-auto bg-gradient-to-b from-white to-neutral-50 dark:from-[#2a2a2a] dark:to-[#1c1c1c] text-black dark:text-white border border-black/5 dark:border-white/5 shadow-xl dark:shadow-2xl font-sans transition-colors duration-300">

    <!-- Top Info Row: Semester, Program, and Batch details -->
    <div class="cc-topinfo flex flex-wrap justify-between font-medium tracking-wide text-black/60 dark:text-neutral-400 border-b border-black/10 dark:border-neutral-800">
        <div>
            <span class="text-black/40 dark:text-neutral-500">Program:</span> <span id="cc-program" class="text-black dark:text-neutral-200 font-semibold">&nbsp;</span>
            <span class="mx-2 text-black/20 dark:text-neutral-700">|</span>
            <span class="text-black/40 dark:text-neutral-500">Semester:</span> <span id="cc-semester" class="text-black dark:text-neutral-200 font-semibold">&nbsp;</span>
        </div>
        <div>
            <span class="text-black/40 dark:text-neutral-500">Batch:</span> <span id="cc-batch" class="text-black dark:text-neutral-200 font-mono">&nbsp;</span>
        </div>
    </div>

    <!-- Header: day (left) | title (center) | date (right) — always a single row -->
    <div class="cc-header flex flex-row items-baseline justify-between border-b border-black/10 dark:border-neutral-700/50">
        <span id="cc-day" class="cc-daydate flex-none font-semibold tracking-wider text-black/60 dark:text-neutral-400 uppercase">&nbsp;</span>
        <h2 class="cc-title flex-1 text-center font-light tracking-widest text-black dark:text-neutral-200">
            TODAY'S CLASS
        </h2>
        <span id="cc-date" class="cc-daydate flex-none font-semibold tracking-wider text-black/60 dark:text-neutral-400">&nbsp;</span>
    </div>

    <div id="cc-classes" class="cc-grid grid grid-cols-3">
        <!-- Loading skeleton (replaced by JS once the fetch resolves) -->
        <div class="cc-empty col-span-3 text-center text-black/50 dark:text-neutral-400 bg-black/5 dark:bg-neutral-500/10 border border-dashed border-black/10 dark:border-neutral-700 animate-pulse">
            <p class="cc-empty-title font-light">Loading today's routine…</p>
        </div>
    </div>

    <!-- Batch Coordinator details -->
    <div class="cc-coord flex flex-col bg-black/5 dark:bg-neutral-500/15 backdrop-blur-md border border-black/10 dark:border-neutral-600/25 text-black/70 dark:text-neutral-300">
        <div class="cc-coord-row flex flex-row items-baseline">
            <span class="cc-coord-label font-semibold text-black dark:text-neutral-100 shrink-0">Batch Coordinator:</span>
            <span id="cc-coord-name" class="truncate">&nbsp;</span>
        </div>
        <div class="cc-coord-row flex flex-row items-baseline">
            <span class="cc-coord-label font-semibold text-black dark:text-neutral-100 shrink-0">Designation:</span>
            <span id="cc-coord-designation" class="text-black/50 dark:text-neutral-400 truncate">&nbsp;</span>
        </div>
        <div id="cc-coord-major-row" class="cc-coord-row flex flex-row items-baseline hidden">
            <span class="cc-coord-label font-semibold text-black dark:text-neutral-100 shrink-0">Major:</span>
            <span id="cc-coord-major" class="text-black/70 dark:text-neutral-300 truncate">&nbsp;</span>
        </div>
        <div class="cc-coord-row flex flex-row items-baseline">
            <span class="cc-coord-label font-semibold text-black dark:text-neutral-100 shrink-0">Contact Number:</span>
            <span id="cc-coord-contact" class="font-mono text-black dark:text-neutral-200">&nbsp;</span>
        </div>
    </div>
</div>

<script>
(function () {
    var DATA_URL = "https://raw.githubusercontent.com/EiadurRahman/PCIU-A-SECTION-center/refs/heads/main/data/classes.json";

    // Escape any text pulled from the remote JSON before it touches innerHTML.
    function esc(value) {
        var div = document.createElement("div");
        div.textContent = value === undefined || value === null ? "" : String(value);
        return div.innerHTML;
    }

    function setText(id, value) {
        var el = document.getElementById(id);
        if (el) el.textContent = value === undefined || value === null || value === "" ? "\u00A0" : value;
    }

    function renderClasses(container, classes) {
        if (!classes || classes.length === 0) {
            container.innerHTML =
                '<div class="cc-empty col-span-3 text-center text-black/50 dark:text-neutral-400 bg-black/5 dark:bg-neutral-500/10 border border-dashed border-black/10 dark:border-neutral-700">' +
                    '<p class="cc-empty-title font-light">No classes scheduled for today!</p>' +
                    '<p class="cc-empty-sub text-black/40 dark:text-neutral-500">Enjoy your day off.</p>' +
                '</div>';
            return;
        }

        var html = classes.map(function (c) {
            var noteHtml = c.note && String(c.note).trim() !== ""
                ? '<p class="cc-item-note italic text-black/40 dark:text-neutral-500">' + esc(c.note) + '</p>'
                : '';

            return (
                '<div class="cc-item bg-black/5 dark:bg-neutral-500/20 backdrop-blur-md border border-black/10 dark:border-neutral-600/30 flex flex-col justify-between min-w-0 hover:bg-black/10 dark:hover:bg-neutral-500/30 transition duration-300">' +
                    '<div class="min-w-0">' +
                        '<h3 class="cc-item-title font-medium text-black dark:text-neutral-100 leading-snug">' + esc(c.course_title) + '</h3>' +
                        '<p class="cc-item-sub text-black/70 dark:text-neutral-300">' + esc(c.course_code) + '&nbsp;&nbsp;' + esc(c.instructor) + '</p>' +
                    '</div>' +
                    '<div class="cc-item-meta border-t border-black/10 dark:border-neutral-600/20 text-black/50 dark:text-neutral-400">' +
                        '<p>Room : ' + esc(c.room) + '</p>' +
                        '<p>' + esc(c.time_slot) + '</p>' +
                        noteHtml +
                    '</div>' +
                '</div>'
            );
        }).join("");

        container.innerHTML = html;
    }

    function renderError(container, message) {
        container.innerHTML =
            '<div class="cc-empty col-span-3 text-center text-black/50 dark:text-neutral-400 bg-black/5 dark:bg-neutral-500/10 border border-dashed border-black/10 dark:border-neutral-700">' +
                '<p class="cc-empty-title font-light">Couldn\'t load today\'s routine</p>' +
                '<p class="cc-empty-sub text-black/40 dark:text-neutral-500">' + esc(message) + '</p>' +
            '</div>';
    }

    function init() {
        var root = document.getElementById("class-card-root");
        if (!root) return;
        var classesContainer = document.getElementById("cc-classes");

        var now = new Date();
        var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var today = dayNames[now.getDay()];
        var dateStr = String(now.getDate()).padStart(2, "0") + " | " + monthNames[now.getMonth()] + " | " + now.getFullYear();

        setText("cc-day", today);
        setText("cc-date", dateStr);

        // Cache-bust on every load with a unique timestamp. raw.githubusercontent.com
        // sits behind a CDN that caches responses by URL regardless of the
        // browser's own cache (which `cache: "no-store"` below can't touch),
        // so a cache-buster that only changes once a day can serve a stale
        // response for hours after an edit. A per-load value guarantees a
        // fresh fetch every time.
        var url = DATA_URL + "?cb=" + Date.now();

        fetch(url, { cache: "no-store" })
            .then(function (res) {
                if (!res.ok) throw new Error("HTTP " + res.status);
                return res.json();
            })
            .then(function (data) {
                setText("cc-program", data.program);
                setText("cc-semester", data.semester);
                setText("cc-batch", data.batch);

                var coord = data.batch_coordinator || {};
                setText("cc-coord-name", coord.name);
                setText("cc-coord-designation", coord.designation ? "(" + coord.designation + ")" : "");
                setText("cc-coord-contact", coord.contact_number);

                var majorRow = document.getElementById("cc-coord-major-row");
                if (coord.major) {
                    setText("cc-coord-major", coord.major);
                    majorRow.classList.remove("hidden");
                } else {
                    majorRow.classList.add("hidden");
                }

                var schedule = data.schedule || {};
                renderClasses(classesContainer, schedule[today]);
            })
            .catch(function (err) {
                renderError(classesContainer, err.message || "Network error");
            });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
</script>
```

### layouts/about/single.html

```html
{{ define "main" }}
{{- with .Site.Params.about_card -}}
{{- if .enable -}}
<!-- Outer Box: Scaled down padding & rounded corners on mobile -->
<div
  class="mx-auto my-4 sm:my-8 max-w-[850px] rounded-2xl sm:rounded-[28px] bg-slate-50/30 p-4 sm:p-8 md:p-10 font-sans text-slate-700 shadow-xl backdrop-blur-md transition-all duration-300 dark:bg-zinc-900/30 dark:text-zinc-300 dark:shadow-2xl">

  <h2
    class="mt-0 mb-2 sm:mb-3 text-center text-xl sm:text-2xl font-extrabold uppercase tracking-wider text-slate-800 transition-colors duration-300 dark:text-zinc-100">
    {{ .title }}
  </h2>

  <div
    class="mb-4 sm:mb-8 rounded-xl sm:rounded-[24px] border border-slate-200/60 bg-slate-50/90 p-3 sm:p-5 text-center shadow-sm transition-colors duration-300 dark:border-zinc-700/60 dark:bg-zinc-900/80">
    <p
      class="m-0 font-mono text-xs sm:text-sm leading-relaxed text-slate-500 transition-colors duration-300 dark:text-zinc-400">
      {{ .subtitle }}
    </p>
  </div>

  <div class="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-[1.1fr_0.9fr]">

    <!-- Left Inner Box -->
    <div
      class="flex flex-col rounded-xl sm:rounded-[20px] bg-white/95 p-4 sm:p-6 shadow-sm border border-slate-100/50 transition-all duration-300 dark:bg-zinc-800/90 dark:border-zinc-700/30">
      <h3
        class="mt-0 mb-2 sm:mb-4 text-center text-base sm:text-lg font-bold text-slate-800 transition-colors duration-300 dark:text-zinc-200">
        {{ .left_title }}
      </h3>
      <p
        class="m-0 text-xs sm:text-sm leading-relaxed text-slate-600 whitespace-pre-line transition-colors duration-300 dark:text-zinc-300">
        {{ .left_text | markdownify }}
      </p>
    </div>

    <div class="flex flex-col gap-4 sm:gap-5">

      <!-- Right Inner Box -->
      <div
        class="flex gap-3 sm:gap-4 rounded-xl sm:rounded-[20px] bg-white/95 p-4 sm:p-6 items-start shadow-sm border border-slate-100/50 transition-all duration-300 dark:bg-zinc-800/90 dark:border-zinc-700/30">
        <div class="flex-1">
          <h3
            class="mt-0 mb-2 sm:mb-4 text-center text-base sm:text-lg font-bold text-slate-800 transition-colors duration-300 dark:text-zinc-200">
            {{ .right_title }}
          </h3>
          <p
            class="m-0 text-xs sm:text-sm leading-relaxed text-slate-600 whitespace-pre-line transition-colors duration-300 dark:text-zinc-300">
            {{ .right_text | markdownify }}
          </p>
        </div>

        <!-- Creator Avatar & Socials -->
        <div class="flex min-w-[60px] sm:min-w-[80px] flex-col items-center gap-3 sm:gap-4">
          {{ if .creator_image }}
          <img src="{{ .creator_image | relURL }}" alt="Creator Photo"
            class="h-14 w-14 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-slate-200/80 object-cover border border-slate-200/50 transition-colors duration-300 dark:bg-zinc-700/80 dark:border-zinc-600/50">
          {{ end }}

          <div class="flex flex-col gap-2.5 sm:gap-3 items-center">
            {{ if .facebook_url }}
            <a href="{{ .facebook_url }}" target="_blank" rel="noopener" aria-label="Facebook"
              class="text-slate-500 transition-all duration-200 hover:scale-110 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">
              <svg class="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>
            {{ end }}

            {{ if .whatsapp_url }}
            {{ $waText := .whatsapp_text | default "" }}
            {{ $waLink := .whatsapp_url }}
            {{ if $waText }}
              {{ $waLink = printf "%s?text=%s" .whatsapp_url ($waText | urlquery) }}
            {{ end }}
            <a href="{{ $waLink }}" target="_blank" rel="noopener" aria-label="WhatsApp"
              class="text-slate-500 transition-all duration-200 hover:scale-110 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-400">
              <svg class="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.221h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.176-2.925-7.062A9.925 9.925 0 0012.012 2zm0 1.664c2.222 0 4.312.866 5.88 2.435A8.271 8.271 0 0120.327 12c0 4.586-3.731 8.318-8.316 8.318h-.003a8.28 8.28 0 01-4.223-1.157l-.303-.18-3.102.734.747-3.023-.197-.312a8.278 8.278 0 01-1.267-4.38c0-4.586 3.732-8.318 8.319-8.318zm4.568 11.234c-.25-.125-1.482-.731-1.711-.814-.23-.083-.397-.125-.564.125-.166.25-.646.814-.792.98-.146.166-.292.187-.542.062-.25-.125-1.056-.389-2.011-1.24-.744-.664-1.247-1.484-1.393-1.734-.146-.25-.015-.385.11-.509.112-.112.25-.292.375-.438.125-.145.166-.25.25-.416.083-.166.042-.312-.02-.437-.063-.125-.564-1.358-.773-1.858-.203-.487-.41-.421-.564-.428l-.481-.009c-.166 0-.437.062-.666.312-.229.25-.875.855-.875 2.085 0 1.23.896 2.417 1.02 2.584.125.166 1.764 2.694 4.274 3.777.597.257 1.064.411 1.428.526.6.19 1.146.163 1.577.099.48-.071 1.482-.605 1.69-1.189.208-.583.208-1.083.145-1.188-.062-.104-.229-.166-.479-.291z" />
              </svg>
            </a>
            {{ end }}

            {{ if .instagram_url }}
            <a href="{{ .instagram_url }}" target="_blank" rel="noopener" aria-label="Instagram"
              class="text-slate-500 transition-all duration-200 hover:scale-110 hover:text-pink-600 dark:text-zinc-400 dark:hover:text-pink-400">
              <svg class="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            {{ end }}
          </div>
        </div>
      </div>

      <!-- Action Button -->
      {{ if .extra_box_text }}
      <a href="{{ .extra_box_url | default "#" }}"
        class="block rounded-xl sm:rounded-[20px] bg-slate-800/95 py-3 sm:py-4 px-4 sm:px-6 text-center text-base sm:text-xl font-medium text-white no-underline shadow-md transition-all duration-200 hover:bg-slate-800 hover:scale-[1.01] active:scale-100 dark:bg-zinc-700/95 dark:hover:bg-zinc-700">
        {{ .extra_box_text }}
      </a>
      {{ end }}
    </div>

  </div>
</div>
{{- end -}}
{{- end -}}
{{ end }}
```

### layouts/upload/single.html

```html
{{ define "main" }}
<div class="flex items-center justify-center min-h-screen sm:min-h-[65vh] px-3 sm:px-4 py-6 sm:py-8">
  <div class="w-full max-w-lg p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/40 dark:bg-black/50 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl transition-all duration-300">

    <div class="text-center mb-6 sm:mb-8">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight">Upload Asset</h2>
      <p class="text-xs sm:text-sm text-black/60 dark:text-white/60 mt-1 break-words">Upload files directly to the PCIU class library.</p>
    </div>

    <form id="uploadForm" class="space-y-4 sm:space-y-5" onsubmit="return false;">
      
      <!-- Course Selector -->
      <div>
        <label for="courseSelect" class="block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1.5 sm:mb-2">
          Course
        </label>
        <select id="courseSelect" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 dark:bg-neutral-900/80 border border-black/10 dark:border-white/10 text-black dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
          <option value="ACC-100">ACC-100 — Financial Accounting</option>
          <option value="BUS 100">BUS 100 — Introduction to Business</option>
          <option value="ENG 101">ENG 101 — English Composition</option>
          <option value="HIST-101">HIST-101 — History of Bangladesh</option>
          <option value="MGT 200">MGT 200 — Principles of Management</option>
          <option value="MKT 200">MKT 200 — Principles of Marketing</option>
        </select>
      </div>

      <!-- Category Selector -->
      <div>
        <label for="categorySelect" class="block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1.5 sm:mb-2">
          Category
        </label>
        <select id="categorySelect" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 dark:bg-neutral-900/80 border border-black/10 dark:border-white/10 text-black dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
          <option value="CLS-CONTENT">Class Content</option>
          <option value="CLS-NOTE">Class Notes</option>
          <option value="HW">Homework / Assignment</option>
        </select>
      </div>

      <!-- Conditional Homework Number Input -->
      <div id="hwNumberWrapper" class="hidden transition-all duration-300">
        <label for="hwNumber" class="block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1.5 sm:mb-2">
          Assignment #
        </label>
        <input id="hwNumber" type="number" min="1" max="99" placeholder="e.g. 1" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 dark:bg-neutral-900/80 border border-black/10 dark:border-white/10 text-black dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
      </div>

      <!-- Upload Password Secret -->
      <div>
        <label for="uploadSecret" class="block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1.5 sm:mb-2">
          Access Password
        </label>
        <input id="uploadSecret" type="password" placeholder="Enter authorization key" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 dark:bg-neutral-900/80 border border-black/10 dark:border-white/10 text-black dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
      </div>

      <!-- Drag and Drop Dropzone -->
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1.5 sm:mb-2">
          File Attachment
        </label>
        <div id="dropZone" class="relative group flex flex-col items-center justify-center w-full min-h-[110px] sm:min-h-[140px] p-3 sm:p-4 border-2 border-dashed border-black/20 dark:border-white/20 rounded-2xl bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 hover:border-indigo-500 transition-all cursor-pointer">
          <input type="file" id="fileInput" class="hidden">
          
          <div id="dropZoneContent" class="text-center space-y-1.5 sm:space-y-2 pointer-events-none px-2">
            <svg class="mx-auto h-7 w-7 sm:h-8 sm:w-8 text-black/40 dark:text-white/40 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p id="filePlaceholder" class="text-xs sm:text-sm font-medium text-black/70 dark:text-white/70 leading-snug break-words">
              Drag and drop your file here, or <span class="text-indigo-600 dark:text-indigo-400 underline">browse</span>
            </p>
            <p id="fileHint" class="text-[11px] sm:text-xs text-black/40 dark:text-white/40">Max allowed file size: 100 MB</p>
          </div>
        </div>
      </div>

      <!-- Progress Meter -->
      <div id="progressWrapper" class="hidden space-y-1.5 sm:space-y-2">
        <div class="flex justify-between text-[11px] sm:text-xs text-black/60 dark:text-white/60">
          <span id="progressPercent">0%</span>
          <span id="progressSpeed">0 KB/s</span>
        </div>
        <div class="w-full h-2 sm:h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <div id="progressBar" class="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-150 rounded-full" style="width:0%"></div>
        </div>
      </div>

      <!-- Action Button -->
      <button
        id="uploadBtn"
        type="submit"
        class="w-full py-3 sm:py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-indigo-500/25 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        <span>Upload Asset</span>
      </button>

      <!-- Status Message Output -->
      <p id="status" class="text-xs sm:text-sm font-medium text-center min-h-[20px] break-words transition-colors duration-200"></p>
    </form>

  </div>
</div>

<script src="{{ "js/upload.js" | relURL }}" defer></script>
{{ end }}
```

### layouts/library/single.html

```html
{{ define "main" }}
<div id="library-root" class="max-w-5xl mx-auto">

  <!-- Breadcrumb rendered as pill buttons, horizontally scrollable on narrow screens -->
  <nav id="lib-breadcrumb" class="hidden mb-4 sm:mb-6 flex items-center gap-1.5 overflow-x-auto pb-1"></nav>

  <div id="lib-loading" class="flex flex-col items-center justify-center gap-3 py-16 text-black/50 dark:text-white/50">
    <svg class="animate-spin h-8 w-8 text-black/40 dark:text-white/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
    <span class="text-sm">Loading library…</span>
  </div>

  <div id="lib-error" class="hidden text-center py-16 text-rose-500"></div>

  <!-- Course grid -->
  <div id="lib-courses" class="hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"></div>

  <!-- Category grid (3 fixed categories for one course) -->
  <div id="lib-categories" class="hidden grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"></div>

  <!-- File / subfolder list -->
  <div id="lib-files" class="hidden space-y-2"></div>

</div>

<template id="tpl-card">
  <button class="lib-card w-full text-left p-4 sm:p-5 rounded-2xl bg-white/30 dark:bg-black/50 backdrop-blur-md border border-black/5 dark:border-white/5 hover:bg-white/50 dark:hover:bg-black/70 active:scale-[0.98] transition-all duration-200">
    <div class="text-xs uppercase tracking-wide text-black/50 dark:text-white/50 card-code"></div>
    <div class="text-base sm:text-lg font-semibold text-black dark:text-white card-name break-words"></div>
    <div class="text-xs text-black/40 dark:text-white/40 mt-2 card-meta"></div>
  </button>
</template>

<template id="tpl-file-row">
  <div class="file-row flex items-center justify-between gap-2 p-3 rounded-xl bg-white/30 dark:bg-black/50 backdrop-blur-md border border-black/5 dark:border-white/5">
    <div class="flex items-center gap-2.5 sm:gap-3 overflow-hidden min-w-0">
      <svg class="w-5 h-5 text-black/40 dark:text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <div class="truncate min-w-0">
        <p class="text-sm font-medium text-black dark:text-white truncate file-name"></p>
        <p class="text-xs text-black/40 dark:text-white/40 file-size"></p>
      </div>
    </div>
    <button class="file-download shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-black dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
      <svg class="dl-spinner hidden animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      <span class="dl-label">Download</span>
    </button>
  </div>
</template>

<script src="{{ "js/library.js" | relURL }}" defer></script>
{{ end }}
```

### static/js/settings.js

```javascript

```

### static/js/main.js

```javascript
(function () {
  var html = document.documentElement;
  var themeToggleBtn = document.getElementById('theme-toggle');

  themeToggleBtn.addEventListener('click', function () {
    var isDark = html.classList.toggle('dark');
    localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
  });

  var mobileMenuButton = document.getElementById('mobile-menu-button');
  var mobileMenu = document.getElementById('mobile-menu');
  var hamburgerIcon = document.getElementById('hamburger-icon');
  var closeIcon = document.getElementById('close-icon');

  mobileMenuButton.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    hamburgerIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
    mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
  });
})();
```

### static/js/library.js

```javascript
(function () {
  const COURSES = [
    { code: "ACC-100", name: "Financial Accounting" },
    { code: "BUS 100", name: "Introduction to Business" },
    { code: "ENG 101", name: "English Composition" },
    { code: "HIST-101", name: "History of Bangladesh" },
    { code: "MGT 200", name: "Principles of Management" },
    { code: "MKT 200", name: "Principles of Marketing" },
  ];
  const CATEGORIES = [
    { code: "CLS-CONTENT", name: "Class Content" },
    { code: "CLS-NOTE", name: "Class Notes" },
    { code: "HW", name: "Homework" },
  ];

  const $ = (id) => document.getElementById(id);
  const loading = $("lib-loading");
  const errorBox = $("lib-error");
  const coursesEl = $("lib-courses");
  const categoriesEl = $("lib-categories");
  const filesEl = $("lib-files");
  const breadcrumb = $("lib-breadcrumb");
  const cardTpl = $("tpl-card");
  const fileRowTpl = $("tpl-file-row");

  let tree = {}; // tree[course][category] = { files: [], subfolders: { "01": [files] } }
  let state = { view: "courses", course: null, category: null, subfolder: null };

  function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const k = 1024, sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  function buildTree(files) {
    const t = {};
    for (const c of COURSES) {
      t[c.code] = {};
      for (const cat of CATEGORIES) t[c.code][cat.code] = { files: [], subfolders: {} };
    }
    for (const f of files) {
      const parts = f.key.split("/");
      const [course, category] = parts;
      if (!t[course] || !t[course][category]) continue; // ignore keys outside the fixed convention
      if (category === "HW" && parts.length === 4) {
        const [, , num, filename] = parts;
        (t[course][category].subfolders[num] ||= []).push({ ...f, name: filename });
      } else if (parts.length === 3) {
        const [, , filename] = parts;
        t[course][category].files.push({ ...f, name: filename });
      }
    }
    return t;
  }

  async function load() {
    try {
      const res = await fetch("/.netlify/functions/list-files");
      if (!res.ok) throw new Error("Bad response");
      const data = await res.json();
      tree = buildTree(data.files || []);
      loading.classList.add("hidden");
      render();
    } catch (err) {
      loading.classList.add("hidden");
      errorBox.textContent = "Couldn't load the library. Try refreshing.";
      errorBox.classList.remove("hidden");
    }
  }

  function setView(view, extra = {}) {
    state = { view, course: null, category: null, subfolder: null, ...extra };
    render();
  }

  function renderBreadcrumb() {
    const crumbs = [{ label: "Courses", onClick: () => setView("courses") }];
    if (state.course) {
      const c = COURSES.find((x) => x.code === state.course);
      crumbs.push({ label: c.name, onClick: () => setView("categories", { course: state.course }) });
    }
    if (state.category) {
      const cat = CATEGORIES.find((x) => x.code === state.category);
      crumbs.push({
        label: cat.name,
        onClick: () => setView("files", { course: state.course, category: state.category }),
      });
    }
    if (state.subfolder) {
      crumbs.push({ label: `Assignment ${state.subfolder}`, onClick: null });
    }

    breadcrumb.innerHTML = "";
    if (crumbs.length <= 1) {
      breadcrumb.classList.add("hidden");
      return;
    }
    breadcrumb.classList.remove("hidden");
    crumbs.forEach((crumb, i) => {
      const isLast = i === crumbs.length - 1;
      const el = document.createElement(crumb.onClick ? "button" : "span");
      el.textContent = crumb.label;
      if (crumb.onClick) {
        el.type = "button";
        el.className =
          "shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium bg-white/40 dark:bg-black/50 border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:bg-white/70 dark:hover:bg-black/70 hover:text-black dark:hover:text-white active:scale-95 transition-all duration-150";
        el.addEventListener("click", crumb.onClick);
      } else {
        el.className =
          "shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-semibold bg-indigo-600/90 text-white";
      }
      breadcrumb.appendChild(el);
      if (!isLast) {
        const sep = document.createElement("span");
        sep.textContent = "›";
        sep.className = "shrink-0 text-black/30 dark:text-white/30 px-0.5";
        breadcrumb.appendChild(sep);
      }
    });
  }

  function makeCard(codeText, nameText, metaText, onClick) {
    const node = cardTpl.content.cloneNode(true);
    node.querySelector(".card-code").textContent = codeText;
    node.querySelector(".card-name").textContent = nameText;
    node.querySelector(".card-meta").textContent = metaText;
    node.querySelector(".lib-card").addEventListener("click", onClick);
    return node;
  }

  function makeFileRow(file, key) {
    const node = fileRowTpl.content.cloneNode(true);
    node.querySelector(".file-name").textContent = file.name;
    node.querySelector(".file-size").textContent = formatBytes(file.size);
    const btn = node.querySelector(".file-download");
    btn.addEventListener("click", () => downloadFile(key, btn));
    return node;
  }


  async function downloadFile(key, btn) {
    const label = btn.querySelector(".dl-label");
    const spinner = btn.querySelector(".dl-spinner");
    btn.disabled = true;
    spinner.classList.remove("hidden");
    label.textContent = "Downloading…";
    try {
      const res = await fetch(`/.netlify/functions/presign-download?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      window.open(data.url, "_blank");
    } catch (err) {
      alert("Couldn't get download link. Try again.");
    } finally {
      spinner.classList.add("hidden");
      label.textContent = "Download";
      btn.disabled = false;
    }
  }

  function render() {
    [coursesEl, categoriesEl, filesEl].forEach((el) => el.classList.add("hidden"));
    renderBreadcrumb();

    if (state.view === "courses") {
      coursesEl.innerHTML = "";
      coursesEl.classList.remove("hidden");
      for (const c of COURSES) {
        const cat = tree[c.code];
        const total = CATEGORIES.reduce((sum, k) => {
          const bucket = cat[k.code];
          return sum + bucket.files.length + Object.values(bucket.subfolders).flat().length;
        }, 0);
        coursesEl.appendChild(
          makeCard(c.code, c.name, total === 0 ? "No files yet" : `${total} file${total === 1 ? "" : "s"}`, () =>
            setView("categories", { course: c.code })
          )
        );
      }
    }

    if (state.view === "categories") {
      categoriesEl.innerHTML = "";
      categoriesEl.classList.remove("hidden");
      for (const cat of CATEGORIES) {
        const bucket = tree[state.course][cat.code];
        const count = bucket.files.length + Object.values(bucket.subfolders).flat().length;
        categoriesEl.appendChild(
          makeCard(cat.code, cat.name, count === 0 ? "Empty" : `${count} file${count === 1 ? "" : "s"}`, () =>
            setView("files", { course: state.course, category: cat.code })
          )
        );
      }
    }

    if (state.view === "files") {
      filesEl.innerHTML = "";
      filesEl.classList.remove("hidden");
      const bucket = tree[state.course][state.category];

      if (state.category === "HW" && !state.subfolder) {
        const nums = Object.keys(bucket.subfolders).sort();
        if (nums.length === 0) {
          filesEl.innerHTML = `<p class="text-center py-8 text-black/40 dark:text-white/40">No homework uploaded yet.</p>`;
          return;
        }
        for (const num of nums) {
          filesEl.appendChild(
            makeCard(`Assignment ${num}`, `${bucket.subfolders[num].length} file(s)`, "", () =>
              setView("files", { course: state.course, category: state.category, subfolder: num })
            )
          );
        }
        return;
      }

      const files = state.subfolder ? bucket.subfolders[state.subfolder] : bucket.files;
      if (!files || files.length === 0) {
        filesEl.innerHTML = `<p class="text-center py-8 text-black/40 dark:text-white/40">No files here yet.</p>`;
        return;
      }
      for (const f of files) {
        filesEl.appendChild(makeFileRow(f, f.key));
      }
    }
  }

  load();
})();

```

### static/js/upload.js

```javascript
document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("uploadForm");
    const courseSelect = document.getElementById("courseSelect");
    const categorySelect = document.getElementById("categorySelect");
    const hwNumberWrapper = document.getElementById("hwNumberWrapper");
    const hwNumber = document.getElementById("hwNumber");
    const uploadSecret = document.getElementById("uploadSecret");
    const fileInput = document.getElementById("fileInput");
    const dropZone = document.getElementById("dropZone");
    const filePlaceholder = document.getElementById("filePlaceholder");
    const progressWrapper = document.getElementById("progressWrapper");
    const progressBar = document.getElementById("progressBar");
    const progressPercent = document.getElementById("progressPercent");
    const progressSpeed = document.getElementById("progressSpeed");
    const statusText = document.getElementById("status");
    const uploadBtn = document.getElementById("uploadBtn");

    const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB

    // Allow any file type for uploads so teachers/students can submit the formats they need.
    const ALLOWED_EXTENSIONS = {
        "CLS-CONTENT": null,
        "CLS-NOTE": null,
        "HW": null,
    };

    // Toggle Homework input visibility on select
    categorySelect.addEventListener("change", () => {
        const isHW = categorySelect.value === "HW";
        hwNumberWrapper.classList.toggle("hidden", !isHW);
        if (isHW) hwNumber.focus();
        validateSelectedFile();
    });

    // Handle Drag & Drop Events
    ["dragenter", "dragover"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add("border-indigo-500", "bg-indigo-500/10");
        });
    });

    ["dragleave", "drop"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove("border-indigo-500", "bg-indigo-500/10");
        });
    });

    dropZone.addEventListener("drop", (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelected();
        }
    });

    dropZone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", handleFileSelected);

    function handleFileSelected() {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const sizeFormatted = formatBytes(file.size);
            filePlaceholder.innerHTML = `<span class="font-semibold text-indigo-600 dark:text-indigo-400">${file.name}</span> (${sizeFormatted})`;
            validateSelectedFile();
        } else {
            filePlaceholder.innerHTML = 'Drag and drop your file here, or <span class="text-indigo-600 dark:text-indigo-400 underline">browse</span>';
            clearStatus();
        }
    }

    function validateSelectedFile() {
        if (fileInput.files.length === 0) return true;

        const file = fileInput.files[0];
        const category = categorySelect.value;
        const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";

        if (file.size > MAX_FILE_BYTES) {
            showStatus(`File size exceeds max limit of ${formatBytes(MAX_FILE_BYTES)}.`, "error");
            return false;
        }

        // ALLOW ALL EXTENSIONS SAFE CHECK
        const allowed = ALLOWED_EXTENSIONS[category];
        if (allowed !== null && Array.isArray(allowed) && !allowed.includes(ext)) {
            showStatus(`Format "${ext}" is not permitted for ${categorySelect.options[categorySelect.selectedIndex].text}.`, "error");
            return false;
        }

        clearStatus();
        return true;
    }

    // Handle Form Submission
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (fileInput.files.length === 0) {
            return showStatus("Please choose or drop a file to upload.", "error");
        }
        if (!uploadSecret.value.trim()) {
            return showStatus("Access password is required.", "error");
        }
        if (categorySelect.value === "HW" && !hwNumber.value.trim()) {
            return showStatus("Assignment number is required for Homework uploads.", "error");
        }
        if (!validateSelectedFile()) return;

        const file = fileInput.files[0];
        uploadBtn.disabled = true;
        showStatus("Initializing secure upload...", "info");

        try {
            const contentType = file.type && file.type.trim() !== "" ? file.type : "application/octet-stream";

            // 1. Request presigned PUT URL from Netlify function
            const presignRes = await fetch("/.netlify/functions/presign-upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-upload-secret": uploadSecret.value.trim()
                },
                body: JSON.stringify({
                    course: courseSelect.value,
                    category: categorySelect.value,
                    hwNumber: categorySelect.value === "HW" ? hwNumber.value.trim() : undefined,
                    filename: file.name,
                    contentType: contentType,
                    fileSize: file.size
                })
            });

            const presignData = await presignRes.json();
            
            // Check HTTP status and ensure uploadUrl field is present
            if (!presignRes.ok || !presignData.uploadUrl) {
                throw new Error(presignData.error || "Failed to retrieve direct upload target.");
            }

            // 2. Perform direct storage PUT with progress tracking
            showStatus("Uploading asset...", "info");
            progressWrapper.classList.remove("hidden");

            // FIX: Pass presignData.uploadUrl instead of presignData.url
            await putWithProgress(presignData.uploadUrl, file, contentType);

            showStatus("File successfully uploaded to library!", "success");

            // Reset Form State
            uploadForm.reset();
            filePlaceholder.innerHTML = 'Drag and drop your file here, or <span class="text-indigo-600 dark:text-indigo-400 underline">browse</span>';
            hwNumberWrapper.classList.add("hidden");

        } catch (err) {
            console.error("Upload error:", err);
            showStatus(err.message || "Upload failed.", "error");
        } finally {
            uploadBtn.disabled = false;
            progressWrapper.classList.add("hidden");
            resetProgress();
        }
    });

    function putWithProgress(url, file, contentType) {
        return new Promise((resolve, reject) => {
            // Guard clause to catch malformed URLs before issuing network request
            if (!url || typeof url !== "string" || !url.startsWith("http")) {
                return reject(new Error("Invalid upload target URL received."));
            }

            const xhr = new XMLHttpRequest();
            xhr.open("PUT", url, true);
            xhr.setRequestHeader("Content-Type", contentType);

            let startTime = Date.now();

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
                    const speedBytesPerSec = elapsedTime > 0 ? e.loaded / elapsedTime : 0;

                    progressBar.style.width = `${percent}%`;
                    progressPercent.textContent = `${percent}%`;
                    progressSpeed.textContent = `${formatBytes(speedBytesPerSec)}/s`;
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error(`Storage returned HTTP ${xhr.status}. Upload failed.`));
                }
            };

            xhr.onerror = () => {
                reject(new Error("Network connection lost or CORS error during upload."));
            };

            xhr.send(file);
        });
    }

    function showStatus(text, type) {
        statusText.textContent = text;
        statusText.className =
            "text-sm font-medium text-center min-h-[20px] " +
            (type === "error"
                ? "text-rose-500 dark:text-rose-400"
                : type === "success"
                    ? "text-emerald-500 dark:text-emerald-400"
                    : "text-amber-500 dark:text-amber-400");
    }

    function clearStatus() {
        statusText.textContent = "";
    }

    function resetProgress() {
        progressBar.style.width = "0%";
        progressPercent.textContent = "0%";
        progressSpeed.textContent = "0 KB/s";
    }

    function formatBytes(bytes) {
        if (!bytes || bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }
});
```

### static/images/favicon_io/site.webmanifest

```
{"name":"","short_name":"","icons":[{"src":"/android-chrome-192x192.png","sizes":"192x192","type":"image/png"},{"src":"/android-chrome-512x512.png","sizes":"512x512","type":"image/png"}],"theme_color":"#ffffff","background_color":"#ffffff","display":"standalone"}
```

### netlify/functions/_b2-client.js

```javascript
// Shared Backblaze B2 (S3-compatible) client + fixed course/category convention.
// All Netlify Functions in this folder import from here.
const { S3Client } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION || "us-east-005",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
  forcePathStyle: true,
  // Disable automatic flexible checksum query params in presigned URLs
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

const BUCKET = process.env.B2_BUCKET_NAME;

// Fixed convention — keep this in sync with what's actually in the bucket.
const COURSES = ["ACC-100", "BUS 100", "ENG 101", "HIST-101", "MGT 200", "MKT 200"];
const CATEGORIES = ["CLS-CONTENT", "CLS-NOTE", "HW"];

// Allow any file type for uploads so teachers/students can submit the formats they need.
const ALLOWED_EXTENSIONS = {
  "CLS-CONTENT": null,
  "CLS-NOTE": null,
  "HW": null,
};

const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100MB

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Headers": "Content-Type, x-upload-secret",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
    body: JSON.stringify(body),
  };
}

// Validates course/category/[hwNumber/]filename and returns the bucket key
function buildKey({ course, category, hwNumber, filename }) {
  if (!COURSES.includes(course)) throw new Error(`Unknown course: ${course}`);
  if (!CATEGORIES.includes(category)) throw new Error(`Unknown category: ${category}`);
  if (!filename || /[\/\\]/.test(filename)) throw new Error("Invalid filename");

  // Check extension safely if allowed extensions array is provided
  const allowed = ALLOWED_EXTENSIONS[category];
  if (allowed !== null && Array.isArray(allowed)) {
    const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      throw new Error(`Extension ${ext} not allowed for ${category}`);
    }
  }

  if (category === "HW") {
    if (!/^\d{1,3}$/.test(String(hwNumber || ""))) {
      throw new Error("HW uploads require a numeric assignment number");
    }
    const num = String(hwNumber).padStart(2, "0");
    return `${course}/${category}/${num}/${filename}`;
  }

  return `${course}/${category}/${filename}`;
}

module.exports = { 
  s3Client, 
  BUCKET, 
  COURSES, 
  CATEGORIES, 
  ALLOWED_EXTENSIONS, 
  MAX_FILE_BYTES, 
  corsHeaders, 
  json, 
  buildKey 
};

// this shoud fix the issue with the presign-upload.js and upload.js files by ensuring that the s3Client is correctly named and exported, and that the buildKey function properly validates the course, category, hwNumber, and filename before constructing the S3 key.
```

### netlify/functions/list-files.js

```javascript
// GET /.netlify/functions/list-files
// Returns every object in the bucket as a flat list; the client builds the
// course -> category -> (subfolder) -> file tree from this.
const { ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { s3Client: b2, BUCKET, corsHeaders, json } = require("./_b2-client"); // Changed s3Client: b2

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders() };
  if (event.httpMethod !== "GET") return json(405, { error: "GET only" });

  try {
    let files = [];
    let ContinuationToken;

    do {
      const res = await b2.send(new ListObjectsV2Command({
        Bucket: BUCKET,
        ContinuationToken,
      }));
      for (const obj of res.Contents || []) {
        if (obj.Key.endsWith("/")) continue; // skip folder placeholder objects
        files.push({ key: obj.Key, size: obj.Size, lastModified: obj.LastModified });
      }
      ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (ContinuationToken);

    return json(200, { files });
  } catch (err) {
    console.error(err);
    return json(500, { error: "Failed to list bucket" });
  }
};
```

### netlify/functions/presign-upload.js

```javascript
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  s3Client,
  BUCKET,
  MAX_FILE_BYTES,
  corsHeaders,
  json,
  buildKey,
} = require("./_b2-client");

exports.handler = async (event) => {
  // Handle CORS preflight for Netlify Function calls
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders(), body: "" };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  try {
    // 1. Secret validation
    const secret = event.headers["x-upload-secret"];
    if (!secret || secret !== process.env.UPLOAD_SECRET) {
      return json(401, { error: "Unauthorized: Invalid upload secret" });
    }

    const body = JSON.parse(event.body || "{}");
    const { course, category, hwNumber, filename, contentType, fileSize } = body;

    // 2. File size limit validation
    if (fileSize && fileSize > MAX_FILE_BYTES) {
      return json(400, { error: "File exceeds 100MB limit" });
    }

    // 3. Construct storage path key
    const key = buildKey({ course, category, hwNumber, filename });

    // 4. Generate presigned URL
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType || "application/octet-stream",
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return json(200, { uploadUrl, key });
  } catch (err) {
    console.error("Presign error:", err);
    return json(400, { error: err.message || "Failed to generate presigned URL" });
  }
};
```

### netlify/functions/presign-download.js

```javascript
// GET /.netlify/functions/presign-download?key=<bucket-key>
// Returns: { url } — a short-lived presigned GET URL.
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// const { b2, BUCKET, corsHeaders, json } = require("./_b2-client"); 
const { s3Client: b2, BUCKET, corsHeaders, json } = require("./_b2-client"); // this should work with the new AWS SDK v3

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders() };
  if (event.httpMethod !== "GET") return json(405, { error: "GET only" });

  const key = event.queryStringParameters && event.queryStringParameters.key;
  if (!key) return json(400, { error: "Missing key" });

  try {
    const url = await getSignedUrl(
      b2,
      new GetObjectCommand({ Bucket: BUCKET, Key: key }),
      { expiresIn: 300 }
    );
    return json(200, { url });
  } catch (err) {
    console.error(err);
    return json(500, { error: "Failed to create download URL" });
  }
};

```

