(function () {
  var el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML =
    '<div class="foot">' +
      '<div>© 2026 Gate IQ · Nashville</div>' +
      '<div style="display:flex;gap:24px;">' +
        '<a href="/privacy.html" class="foot__link">Privacy &amp; Terms</a>' +
        '<a href="/cookies.html" class="foot__link">Cookies</a>' +
      '</div>' +
    '</div>';
})();
