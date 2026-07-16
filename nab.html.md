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
        navbar.html
        todaysclass.html
    upload.html
static/
    images/
        Logo.png
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
{{ partial "todaysclass.html" . }}
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
    <!-- We will link custom CSS here later -->

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

    <script>
        // Inline script to prevent theme flash using cookies
        (function () {
            function getCookie(name) {
                var value = "; " + document.cookie;
                var parts = value.split("; " + name + "=");
                if (parts.length === 2) return parts.pop().split(";").shift();
            }
            var theme = getCookie('color-theme');
            var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (theme === 'dark' || (!theme && systemDark)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        })();
    </script>
</head>
<header>
    {{ partial "navbar.html" . }}

</header>

<body>
    <script src="{{ " js/main.js" | relURL }}"></script>
    <main class="max-w-7xl mx-auto p-6">
        {{ block "main" . }}{{ end }}
    </main>
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
<nav
    class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex items-center">
                <div class="flex-shrink-0 flex items-center">
                    <a href="{{ .Site.BaseURL }}"
                        class="flex items-center space-x-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:opacity-90 transition-opacity">
                        {{ if .Site.Params.logoLight }}
                        <img src="{{ .Site.Params.logoLight | relURL }}" alt="{{ .Site.Title }} Logo"
                            style="height: {{ default " 32px" .Site.Params.logoHeight }};"
                            class="w-auto {{ if .Site.Params.logoDark }}block dark:hidden{{ else }}block{{ end }}">

                        {{ if .Site.Params.logoDark }}
                        <img src="{{ .Site.Params.logoDark | relURL }}" alt="{{ .Site.Title }} Logo"
                            style="height: {{ default " 32px" .Site.Params.logoHeight }};"
                            class="w-auto hidden dark:block">
                        {{ end }}
                        <span class="hidden md:block text-lg font-bold">{{ .Site.Title }}</span>
                        {{ else }}
                        <span>{{ .Site.Title }}</span>
                        {{ end }}
                    </a>
                </div>

                <div class="hidden sm:-my-px sm:ml-8 sm:flex sm:space-x-8 h-full">
                    {{ range .Site.Menus.main }}
                    {{ if not .Params.is_button }}
                    <a href="{{ .URL | relLangURL }}" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200
                               {{ if or ($.IsMenuCurrent " main" .) ($.HasMenuCurrent "main" .) }} border-indigo-600
                        text-gray-900 dark:text-white dark:border-indigo-400 {{ else }} border-transparent text-gray-500
                        dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300
                        dark:hover:border-gray-700 {{ end }}">
                        {{ .Name }}
                    </a>
                    {{ end }}
                    {{ end }}
                </div>
            </div>

            <div class="flex items-center space-x-4">
                <button id="theme-toggle" type="button"
                    class="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Toggle dark mode">
                    <svg id="theme-toggle-sun-icon" class="block dark:hidden w-5 h-5" fill="currentColor"
                        viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z"
                            fill-rule="evenodd" clip-rule="evenodd"></path>
                    </svg>

                    <svg id="theme-toggle-moon-icon" class="hidden dark:block w-5 h-5" fill="currentColor"
                        viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                    </svg>
                </button>

                <div class="hidden sm:flex sm:items-center">
                    {{ range .Site.Menus.main }}
                    {{ if .Params.is_button }}
                    <a href="{{ .URL | relLangURL }}"
                        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                        {{ .Name }}
                    </a>
                    {{ end }}
                    {{ end }}
                </div>

                <div class="flex items-center sm:hidden">
                    <button id="mobile-menu-button" type="button"
                        class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        aria-controls="mobile-menu" aria-expanded="false">
                        <span class="sr-only">Open main menu</span>
                        <svg id="hamburger-icon" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <svg id="close-icon" class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="hidden sm:hidden" id="mobile-menu">
        <div
            class="pt-2 pb-4 px-4 space-y-1 bg-white/95 dark:bg-gray-900/95 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            {{ range .Site.Menus.main }}
            {{ if not .Params.is_button }}
            <a href="{{ .URL | relLangURL }}" class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium rounded-r-md transition-colors duration-150
                       {{ if or ($.IsMenuCurrent " main" .) ($.HasMenuCurrent "main" .) }} bg-indigo-50
                dark:bg-indigo-950/30 border-indigo-500 text-indigo-700 dark:text-indigo-300 {{ else }}
                border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50
                hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-800 dark:hover:text-white {{ end }}">
                {{ .Name }}
            </a>
            {{ end }}
            {{ end }}

            <div class="pt-4 pb-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                {{ range .Site.Menus.main }}
                {{ if .Params.is_button }}
                <a href="{{ .URL | relLangURL }}"
                    class="block w-full text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200">
                    {{ .Name }}
                </a>
                {{ end }}
                {{ end }}
            </div>
        </div>
    </div>
</nav>
```

### layouts/partials/todaysclass.html

```html
<div class="text-xls">
    <h1>hello</h1>
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
document.addEventListener("DOMContentLoaded", function() {
    // === Global Cookie Helpers ===
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    }

    // === Theme Toggle Logic ===
    var themeToggleBtn = document.getElementById('theme-toggle');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            // Check if dark is currently applied, toggle it, and persist global cookie
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                setCookie('color-theme', 'light', 365);
            } else {
                document.documentElement.classList.add('dark');
                setCookie('color-theme', 'dark', 365);
            }
        });
    }

    // === Mobile Menu Toggle Logic ===
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            hamburgerIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
    }
});
```

### static/images/favicon_io/site.webmanifest

```
{"name":"","short_name":"","icons":[{"src":"/android-chrome-192x192.png","sizes":"192x192","type":"image/png"},{"src":"/android-chrome-512x512.png","sizes":"512x512","type":"image/png"}],"theme_color":"#ffffff","background_color":"#ffffff","display":"standalone"}
```

