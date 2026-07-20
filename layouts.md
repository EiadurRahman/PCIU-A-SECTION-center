# Project Context: pciuAsec

## Project Structure

```
layouts/
    _default/
        baseof.html
        single.html
    about/
        single.html
    index.html
    partials/
        class_card.html
        navbar.html
    upload/
        single.html
```

## Project Files

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

    <link rel="apple-touch-icon" sizes="180x180" href="images/favicon_io/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="images/favicon_io/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="images/favicon_io/favicon-16x16.png">
    <link rel="manifest" href="images/favicon_io/site.webmanifest">
    


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
<article>
    <h2>{{ .Title }}</h2>
    <time>{{ .Date.Format "January 2, 2006" }}</time>
    <div class="content">
        {{ .Content }}
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
<!-- Outer Box: High-opacity (95%) background with a soft glassmorphism blur -->
<div class="mx-auto my-8 max-w-[850px] rounded-[28px] bg-slate-50/30 p-10 font-sans text-slate-700 shadow-xl backdrop-blur-md transition-all duration-300 dark:bg-zinc-900/30 dark:text-zinc-300 dark:shadow-2xl">
  
  <h2 class="mt-0 mb-3 text-center text-2xl font-extrabold uppercase tracking-wider text-slate-800 transition-colors duration-300 dark:text-zinc-100">
    {{ .title }}
  </h2>
  <div class="mb-8 rounded-[24px] border border-slate-200/60 bg-slate-50/90 p-5 text-center shadow-sm transition-colors duration-300 dark:border-zinc-700/60 dark:bg-zinc-900/80">
    <p class="m-0 font-mono text-sm leading-relaxed text-slate-500 transition-colors duration-300 dark:text-zinc-400">
      {{ .subtitle }}
    </p>
  </div>

  <div class="grid grid-cols-1 gap-5 sm:grid-cols-[1.1fr_0.9fr]">
    
    <!-- Left Inner Box: High-opacity (95% light / 90% dark) -->
    <div class="flex flex-col rounded-[20px] bg-white/95 p-6 shadow-sm border border-slate-100/50 transition-all duration-300 dark:bg-zinc-800/90 dark:border-zinc-700/30">
      <h3 class="mt-0 mb-4 text-center text-lg font-bold text-slate-800 transition-colors duration-300 dark:text-zinc-200">
        {{ .left_title }}
      </h3>
      <p class="m-0 text-sm leading-relaxed text-slate-600 whitespace-pre-line transition-colors duration-300 dark:text-zinc-300">
        {{ .left_text | markdownify }}
      </p>
    </div>

    <div class="flex flex-col gap-5">
      
      <!-- Right Inner Box: High-opacity (95% light / 90% dark) -->
      <div class="flex gap-4 rounded-[20px] bg-white/95 p-6 items-start shadow-sm border border-slate-100/50 transition-all duration-300 dark:bg-zinc-800/90 dark:border-zinc-700/30">
        <div class="flex-1">
          <h3 class="mt-0 mb-4 text-center text-lg font-bold text-slate-800 transition-colors duration-300 dark:text-zinc-200">
            {{ .right_title }}
          </h3>
          <p class="m-0 text-sm leading-relaxed text-slate-600 whitespace-pre-line transition-colors duration-300 dark:text-zinc-300">
            {{ .right_text | markdownify }}
          </p>
        </div>
        
        <!-- Creator Avatar & Socials -->
        <div class="flex min-w-[80px] flex-col items-center gap-4">
          {{ if .creator_image }}
          <img src="{{ .creator_image | relURL }}" alt="Creator Photo" class="h-20 w-20 rounded-2xl bg-slate-200/80 object-cover border border-slate-200/50 transition-colors duration-300 dark:bg-zinc-700/80 dark:border-zinc-600/50">
          {{ end }}
          
          <div class="flex flex-col gap-3">
            {{ if .facebook_url }}
            <a href="{{ .facebook_url }}" target="_blank" rel="noopener" aria-label="Facebook" class="text-slate-500 transition-all duration-200 hover:scale-110 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">
              <svg class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            {{ end }}
            
            {{ if .instagram_url }}
            <a href="{{ .instagram_url }}" target="_blank" rel="noopener" aria-label="Instagram" class="text-slate-500 transition-all duration-200 hover:scale-110 hover:text-pink-600 dark:text-zinc-400 dark:hover:text-pink-400">
              <svg class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            {{ end }}
          </div>
        </div>
      </div>

      <!-- Action Button: Smooth 95% opacity to 100% opacity on hover -->
      {{ if .extra_box_text }}
      <a href="{{ .extra_box_url | default "#" }}" class="block rounded-[20px] bg-slate-800/95 py-4 px-6 text-center text-xl font-medium text-white no-underline shadow-md transition-all duration-200 hover:bg-slate-800 hover:scale-[1.01] active:scale-100 dark:bg-zinc-700/95 dark:hover:bg-zinc-700">
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
<div class="flex items-center justify-center min-h-[60vh] px-4 py-12">
  <div class="w-full max-w-md p-8 bg-white border border-gray-100 rounded-2xl shadow-xl dark:bg-zinc-900 dark:border-zinc-800">
    
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Upload File</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Files will be saved in the <code class="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-rose-500 font-mono text-xs">uploads/</code> directory.</p>
    </div>

    <div class="space-y-5">
      <label for="fileInput" class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-zinc-850 hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-colors group">
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <svg class="w-10 h-10 mb-3 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p class="mb-1 text-sm text-gray-600 dark:text-gray-300 font-medium">Click to select a file</p>
          <p class="text-xs text-gray-400 dark:text-gray-500" id="filePlaceholder">Any format allowed</p>
        </div>
        <input type="file" id="fileInput" class="hidden" onchange="updateFileInfo()" />
      </label>

      <div id="fileInfoWrapper" class="hidden flex items-center justify-between p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-lg">
        <div class="flex items-center space-x-3 overflow-hidden">
          <svg class="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <div class="truncate">
            <p id="fileName" class="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate"></p>
            <p id="fileSize" class="text-xs text-gray-400 dark:text-gray-500"></p>
          </div>
        </div>
        <button onclick="clearSelection()" class="text-gray-400 hover:text-rose-500 transition-colors p-1 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/30">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <button 
        id="uploadBtn"
        onclick="handleUpload()" 
        class="w-full flex justify-center items-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
      >
        Upload File
      </button>

      <p id="status" class="text-sm font-medium text-center min-h-[20px] transition-all duration-150"></p>
    </div>

  </div>
</div>

<script>
  const fileInput = document.getElementById('fileInput');
  const fileInfoWrapper = document.getElementById('fileInfoWrapper');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const statusText = document.getElementById('status');
  const uploadBtn = document.getElementById('uploadBtn');

  // Triggered when file input updates
  function updateFileInfo() {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      fileName.innerText = file.name;
      fileSize.innerText = formatBytes(file.size);
      fileInfoWrapper.classList.remove('hidden');
      clearStatus();
    } else {
      clearSelection();
    }
  }

  // Resets selection
  function clearSelection() {
    fileInput.value = '';
    fileInfoWrapper.classList.add('hidden');
    fileName.innerText = '';
    fileSize.innerText = '';
    clearStatus();
  }

  // Format File Size
  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // Handle status feedback styling
  function showStatus(text, type) {
    statusText.innerText = text;
    // Reset status colors
    statusText.className = "text-sm font-medium text-center min-h-[20px] transition-all duration-150";
    
    if (type === 'error') {
      statusText.classList.add('text-rose-600', 'dark:text-rose-400');
    } else if (type === 'success') {
      statusText.classList.add('text-emerald-600', 'dark:text-emerald-400');
    } else if (type === 'info') {
      statusText.classList.add('text-amber-500', 'dark:text-amber-400');
    }
  }

  function clearStatus() {
    statusText.innerText = '';
    statusText.className = "text-sm font-medium text-center min-h-[20px]";
  }

  // Handle Main Upload Operation
  async function handleUpload() {
    if (fileInput.files.length === 0) {
      showStatus("Please select a file first.", "error");
      return;
    }

    const file = fileInput.files[0];
    
    // Disable inputs during network request
    uploadBtn.disabled = true;
    fileInput.disabled = true;
    showStatus("Processing file...", "info");

    const reader = new FileReader();
    reader.onload = async function (e) {
      const base64Data = e.target.result;

      showStatus("Uploading to GitHub...", "info");
      
      try {
        const response = await fetch('/.netlify/functions/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fileName: file.name,
            fileData: base64Data
          })
        });

        const result = await response.text();
        
        if (response.ok) {
          showStatus("Success! File uploaded to GitHub.", "success");
          clearSelection();
        } else {
          showStatus(`Error: ${result}`, "error");
        }
      } catch (err) {
        showStatus(`Network error: ${err.message}`, "error");
      } finally {
        // Re-enable interactive elements
        uploadBtn.disabled = false;
        fileInput.disabled = false;
      }
    };

    reader.readAsDataURL(file);
  }
</script>
{{ end }}
```

