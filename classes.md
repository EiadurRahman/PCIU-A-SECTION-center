# Project Context: pciuAsec

## Project Structure

```
data/
    classes.yml
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

### data/classes.yml

```yaml
semester: "Fall 2026"
program: "BBA"
batch: "BBA-37-D-A (1st semester)"
batch_coordinator:
  name: "Hafsa Binta Firdaus"
  designation: "Lecturer, Department of Business Administration"
  major: "HRM"
  contact_number: "01879377124"
schedule:
  Saturday:
    - time_slot: "8.30am-10.00am"
      course_code: "ACC 100"
      course_title: "Financial Accounting"
      instructor: "CT-MIH"
      room: 119
    - time_slot: "11.30am-1.00pm"
      course_code: "BUS 100"
      course_title: "Introduction to Business"
      instructor: "SHA"
      room: 222
    - time_slot: "1.30pm-03.00pm"
      course_code: "MKT 200"
      course_title: "Principles of Marketing"
      instructor: "CT: MRC"
      room: 119
  Sunday:
    - time_slot: "8.30am-10.00am"
      course_code: "ENG 101"
      course_title: "Composition"
      instructor: "BBA-37-A MRF"
      room: 218
    - time_slot: "10.00am-11.30am"
      course_code: "HIST-101"
      course_title: "History of the Emergence of Independent Bangladesh"
      instructor: "KCB"
      room: 219
    - time_slot: "1.30pm-03.00pm"
      course_code: "MGT 200"
      course_title: "Principles of Management"
      instructor: "CT:AZM"
      room: 208
  Monday:
    - time_slot: "1.30pm-03.00pm"
      course_code: "MKT 200"
      course_title: "Principles of Marketing"
      instructor: "CT: MRC"
      room: 218
    - time_slot: "4.30pm-6.00pm"
      course_code: "ACC 100"
      course_title: "Financial Accounting"
      instructor: "CT-MIH"
      room: 119
  Tuesday: []
  Wednesday:
    - time_slot: "8.30am-10.00am"
      course_code: "HIST-101"
      course_title: "History of the Emergence of Independent Bangladesh"
      instructor: "KCB"
      room: 222
    - time_slot: "10.00am-11.30am"
      course_code: "MGT 200"
      course_title: "Principles of Management"
      instructor: "CT:AZM"
      room: 222
  Thursday:
    - time_slot: "8.30am-10.00am"
      course_code: "ENG 101"
      course_title: "Composition"
      instructor: "BBA-37-A MRF"
      room: 119
    - time_slot: "10.00am-11.30am"
      course_code: "BUS 100"
      course_title: "Introduction to Business"
      instructor: "CT-SHA"
      room: 218
  Friday: []
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

    <link rel="apple-touch-icon" sizes="180x180" href="images/favicon_io/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="images/favicon_io/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="images/favicon_io/favicon-16x16.png">
    <link rel="manifest" href="images/favicon_io/site.webmanifest">


</head>

<body
    class="h-full min-h-screen bg-[url('/images/background_m.png')] md:bg-[url('/images/background.png')] bg-cover bg-center bg-fixed dark:bg-neutral-950 text-black dark:text-white transition-colors duration-300 flex flex-col">

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
{{ $data := .Site.Data.classes }}
{{ $today := now.Format "Monday" }}
{{ $classes := index $data.schedule $today }}

<div
    class="max-w-4xl mx-auto my-4 md:my-8 p-4 md:p-6 bg-gradient-to-b from-[#2a2a2a] to-[#1c1c1c] rounded-2xl md:rounded-[2rem] text-white shadow-2xl font-sans">

    <div
        class="flex flex-col items-center mb-4 md:mb-8 px-1 md:px-4 border-b border-neutral-700/50 pb-3 md:pb-4 md:flex-row md:justify-between">
        <!-- Title: Placed on top on mobile, centered on desktop -->
        <h2 class="text-base md:text-2xl font-light tracking-widest text-neutral-200 order-1 md:order-2 mb-2 md:mb-0">
            TODAY'S CLASS
        </h2>

        <!-- Day and Date: Side-by-side on mobile, split to the outer edges on desktop -->
        <div class="flex justify-between w-full order-2 md:contents">
            <span class="text-[11px] md:text-sm font-semibold tracking-wider text-neutral-400 uppercase md:order-1">
                {{ $today }}
            </span>
            <span class="text-[11px] md:text-sm font-semibold tracking-wider text-neutral-400 md:order-3">
                {{ now.Format "02 | Jan | 2006" }}
            </span>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
        {{ if $classes }}
        {{ range $classes }}
        <div
            class="bg-neutral-500/20 backdrop-blur-md border border-neutral-600/30 rounded-xl md:rounded-[1.5rem] p-3.5 md:p-5 flex flex-col justify-between min-h-[110px] md:min-h-[140px] hover:bg-neutral-500/30 transition duration-300">
            <div>
                <h3 class="text-sm md:text-base font-medium text-neutral-100 leading-snug">
                    {{ .course_title }}
                </h3>
                <p class="text-xs md:text-sm text-neutral-300 mt-0.5 md:mt-1">
                    {{ .course_code }} &nbsp;&nbsp; {{ .instructor }}
                </p>
            </div>
            <div
                class="mt-3 md:mt-4 border-t border-neutral-600/20 pt-1.5 md:pt-2 text-[11px] md:text-xs text-neutral-400 space-y-0.5 md:space-y-1">
                <p>Room : {{ .room }}</p>
                <p>{{ .time_slot }}</p>
            </div>
        </div>
        {{ end }}
        {{ else }}
        <div
            class="col-span-1 md:col-span-3 py-8 md:py-12 text-center text-neutral-400 bg-neutral-500/10 rounded-xl md:rounded-[1.5rem] border border-dashed border-neutral-700">
            <p class="text-sm md:text-lg font-light">No classes scheduled for today!</p>
            <p class="text-[10px] md:text-xs text-neutral-500 mt-0.5">Enjoy your day off.</p>
        </div>
        {{ end }}
    </div>

    <div
        class="bg-neutral-500/15 backdrop-blur-md border border-neutral-600/25 rounded-xl md:rounded-[1.5rem] p-4 md:p-6 text-xs md:text-sm text-neutral-300 space-y-1.5 md:space-y-1">
        <div class="flex flex-row items-baseline gap-1.5">
            <span class="font-semibold text-neutral-100 min-w-[110px] md:min-w-[150px] shrink-0">Batch
                Coordinator:</span>
            <span class="truncate">{{ $data.batch_coordinator.name }}</span>
        </div>
        <div class="flex flex-row items-baseline gap-1.5">
            <span class="font-semibold text-neutral-100 min-w-[110px] md:min-w-[150px] shrink-0">Designation:</span>
            <span class="text-neutral-400 truncate">({{ $data.batch_coordinator.designation }})</span>
        </div>
        <div class="flex flex-row items-baseline gap-1.5">
            <span class="font-semibold text-neutral-100 min-w-[110px] md:min-w-[150px] shrink-0">Contact Number:</span>
            <span class="font-mono text-neutral-200">"{{ $data.batch_coordinator.contact_number }}"</span>
        </div>
    </div>
</div>
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

