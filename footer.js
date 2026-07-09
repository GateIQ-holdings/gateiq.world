(function () {
  var el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML =
    '<div class="foot">' +
      '<div class="foot__brand">' +
        '<img class="foot__brand-logo" src="/assets/gateiq-logo-glide.png" alt="" width="52" height="52">' +
        '<div class="foot__brand-name">Gate<span class="iq">IQ</span></div>' +
      '</div>' +
      '<div class="foot__left">' +
        '<div class="foot__line">© 2026 Gate IQ</div>' +
        '<div class="foot__divider">—</div>' +
        '<div class="foot__line">Proudly made in the U.S.A.</div>' +
        '<div class="foot__line">Crafted with love by <a href="https://nuanceddesign.com" class="foot__link--credit" target="_blank" rel="noopener">Nuanced Design</a></div>' +
        '<div class="foot__divider">—</div>' +
        '<div class="foot__links">' +
          '<a href="/privacy.html" class="foot__link">Privacy &amp; Terms</a>' +
          '<a href="/cookies.html" class="foot__link">Cookies</a>' +
        '</div>' +
      '</div>' +
    '</div>';
})();
