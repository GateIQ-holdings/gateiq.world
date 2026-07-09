// Gate IQ — Theme toggle (light/dark) + system preference + persistence
// Drop into any page with: <script src="theme-toggle.js"></script>
// Adds a fixed-position circular toggle button in the bottom-right corner.
// Persists the user's choice in localStorage under "gateiq-theme".
(function () {
  const KEY = "gateiq-theme";
  const root = document.documentElement;

  // Apply stored preference on load (before paint to avoid flash)
  const stored = (() => { try { return localStorage.getItem(KEY); } catch { return null; } })();
  if (stored === "dark" || stored === "light") {
    root.setAttribute("data-theme", stored);
  }

  function currentTheme() {
    const attr = root.getAttribute("data-theme");
    if (attr) return attr;
    // No explicit choice — defer to system
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem(KEY, t); } catch {}
    updateIcon();
    document.dispatchEvent(new CustomEvent("gateiq-theme-change", { detail: { theme: t } }));
  }

  function toggle() {
    setTheme(currentTheme() === "dark" ? "light" : "dark");
  }

  // ── Build button ───────────────────────────────────────────────
  const btn = document.createElement("button");
  btn.className = "theme-toggle";
  btn.setAttribute("aria-label", "Toggle dark mode");
  btn.type = "button";
  btn.addEventListener("click", toggle);

  const SUN = `<svg class="theme-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
  const MOON = `<svg class="theme-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  function updateIcon() {
    btn.innerHTML = currentTheme() === "dark" ? SUN : MOON;
  }
  updateIcon();

  function mount() { if (!document.querySelector(".theme-toggle")) document.body.appendChild(btn); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
