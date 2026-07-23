(function () {
  // Password gate retired for public launch.
  function unlock() {
    document.documentElement.classList.remove("gateiq-locked");
    var gate = document.getElementById("password-gate");
    if (gate) gate.classList.add("password-gate--hidden");
    var content = document.getElementById("site-content");
    if (content) content.style.display = "";
    document.dispatchEvent(new CustomEvent("gateiq-unlocked"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", unlock);
  } else {
    unlock();
  }
})();
