(function () {
  var PASSWORDS = ["Nashville", "gateiq"];

  function isValidPassword(value) {
    var v = value.trim();
    return PASSWORDS.some(function (p) {
      return v.toLowerCase() === p.toLowerCase();
    });
  }
  var STORAGE_KEY = "gateiq_unlocked";

  function isUnlocked() {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  }

  function unlock() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    document.documentElement.classList.remove("gateiq-locked");
    var gate = document.getElementById("password-gate");
    if (gate) gate.classList.add("password-gate--hidden");
    var content = document.getElementById("site-content");
    if (content) content.style.display = "";
    document.dispatchEvent(new CustomEvent("gateiq-unlocked"));
  }

  function checkPassword() {
    var input = document.getElementById("gate-password");
    var error = document.getElementById("gate-error");
    if (!input || !error) return;

    if (isValidPassword(input.value)) {
      error.textContent = "";
      unlock();
    } else {
      error.textContent = "Incorrect access code.";
      input.value = "";
      input.focus();
    }
  }

  function togglePasswordVisibility() {
    var input = document.getElementById("gate-password");
    var btn = document.querySelector(".password-gate__eye");
    if (!input || !btn) return;

    var show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.innerHTML = show
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  }

  var GATE_HTML =
    '<div id="password-gate" class="password-gate">' +
      '<div><div class="password-gate__brand brand-mark">' +
        '<img class="brand-mark__logo brand-mark__logo--lg" src="/assets/gateiq-logo-glide.png" alt="" width="48" height="48">' +
        '<span class="brand-mark__name">Gate<span class="iq">IQ</span></span>' +
      '</div></div>' +
      '<div class="password-gate__label">Private preview · Enter access code</div>' +
      '<div class="password-gate__row">' +
        '<div class="password-gate__input-wrap">' +
          '<input id="gate-password" class="password-gate__input" type="password" placeholder="Access code" autocomplete="off">' +
          '<button class="password-gate__eye" type="button" aria-label="Toggle visibility">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
          '</button>' +
        '</div>' +
        '<button class="password-gate__btn" type="button">Enter →</button>' +
      '</div>' +
      '<div class="password-gate__error" id="gate-error"></div>' +
    '</div>';

  function wireGate() {
    var gate = document.getElementById("password-gate");
    if (!gate) return;

    var input = document.getElementById("gate-password");
    var btn = gate.querySelector(".password-gate__btn");
    var eye = gate.querySelector(".password-gate__eye");

    if (btn) btn.addEventListener("click", checkPassword);
    if (eye) eye.addEventListener("click", togglePasswordVisibility);
    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") checkPassword();
      });
    }
  }

  function init() {
    if (isUnlocked()) {
      unlock();
      return;
    }

    document.documentElement.classList.add("gateiq-locked");

    if (!document.getElementById("password-gate") && document.body) {
      document.body.insertAdjacentHTML("afterbegin", GATE_HTML);
    }

    wireGate();
  }

  if (!isUnlocked()) {
    document.documentElement.classList.add("gateiq-locked");
  }

  window.checkPassword = checkPassword;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
