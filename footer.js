(function () {
  var el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML =
    '<div class="foot">' +
      '<div class="foot__left">' +
        '<div class="foot__line">© 2026 Gate IQ &nbsp;·&nbsp; Peace in Motion&#8482; &nbsp;·&nbsp; Nashville</div>' +
        '<div class="foot__line">Proudly made in the 🇺🇸</div>' +
        '<div class="foot__line">Crafted with ❤️ by <a href="https://nuanceddesign.com" class="foot__link--credit" target="_blank" rel="noopener">Nuanced Design</a></div>' +
      '</div>' +
      '<div style="display:flex;gap:24px;align-items:center;">' +
        '<a href="/privacy.html" class="foot__link">Privacy &amp; Terms</a>' +
        '<a href="/cookies.html" class="foot__link">Cookies</a>' +
      '</div>' +
    '</div>';
})();
