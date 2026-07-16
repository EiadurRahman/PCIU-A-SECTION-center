# Project Context: pciuAsec

## Project Structure

```
layouts/
    _default/
        baseof.html
        single.html
    about.html
    index.html
    partials/
        class_card.html
        navbar.html
    upload.html
static/
    images/
        Logo.png
        background.png
        background_m.png
        favicon_io/
            android-chrome-192x192.png
            android-chrome-512x512.png
            apple-touch-icon.png
            favicon-16x16.png
            favicon-32x32.png
            favicon.ico
            site.webmanifest
    js/
        main.js
        settings.js
        upload.js
```

## Project Files

### layouts/upload.html

```html
{{ define "main" }}
<div class="bg-black text-amber-50">
    <h1>upload</h1>
</div>
{{ end }}
```

### layouts/index.html

```html
{{ define "main" }}
{{ partial "class_card.html" . }}
{{ end }}
```

### layouts/about.html

```html
{{ define "main" }}
    <div class="text-white">
        <h1>About</h1>
    </div>
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

### static/js/upload.js

```javascript

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

### static/images/favicon_io/site.webmanifest

```
{"name":"","short_name":"","icons":[{"src":"/android-chrome-192x192.png","sizes":"192x192","type":"image/png"},{"src":"/android-chrome-512x512.png","sizes":"512x512","type":"image/png"}],"theme_color":"#ffffff","background_color":"#ffffff","display":"standalone"}
```

