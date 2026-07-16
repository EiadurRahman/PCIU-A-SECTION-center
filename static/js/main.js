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