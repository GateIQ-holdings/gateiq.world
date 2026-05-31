(function () {
  var el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML =
    '<div class="foot">' +
      '<div style="display:flex;flex-direction:column;gap:6px;">' +
        '<div>© 2026 Gate IQ &nbsp;·&nbsp; Peace in Motion&#8482; &nbsp;·&nbsp; Nashville</div>' +
        '<div>Proudly made in the 🇺🇸 &nbsp;·&nbsp; Crafted with ❤️ by <a href="https://nuanceddesign.com" class="foot__link" target="_blank" rel="noopener">Nuanced Design</a></div>' +
      '</div>' +
      '<div style="display:flex;gap:24px;">' +
        '<a href="/privacy.html" class="foot__link">Privacy &amp; Terms</a>' +
        '<a href="/cookies.html" class="foot__link">Cookies</a>' +
      '</div>' +
    '</div>';
})();
