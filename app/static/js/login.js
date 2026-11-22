(function () {
  "use strict";
  // Dimuat sekali saja. Memakai event delegation di document supaya tetap
  // berfungsi setelah Turbo mengganti isi halaman tanpa reload.
  if (window.__hrisLoginBound) return;
  window.__hrisLoginBound = true;

  function resetSubmit(form) {
    var btn = form.querySelector('button[type="submit"]');
    if (btn && btn.dataset.label) {
      btn.disabled = false;
      btn.textContent = btn.dataset.label;
    }
  }

  document.addEventListener("click", function (e) {
    // Pilih peran
    var tab = e.target.closest("[data-login-form] [data-role]");
    if (tab) {
      var form = tab.closest("[data-login-form]");
      form.querySelectorAll("[data-role]").forEach(function (t) {
        t.setAttribute("aria-pressed", "false");
      });
      tab.setAttribute("aria-pressed", "true");
      form.querySelector('input[name="role"]').value = tab.dataset.role;
      form.querySelector("[data-sub]").textContent = tab.dataset.sub;
      return;
    }

    // Tampilkan / sembunyikan kata sandi
    var eye = e.target.closest("[data-login-form] [data-toggle-password]");
    if (eye) {
      var input = eye.parentNode.querySelector("input");
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      eye.textContent = show ? "Sembunyikan" : "Tampilkan";
      eye.setAttribute("aria-pressed", String(show));
    }
  });

  // Status memuat saat form dikirim
  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form.matches || !form.matches("[data-login-form]")) return;
    var btn = form.querySelector('button[type="submit"]');
    btn.dataset.label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Memeriksa…";
  });

  // Jika pengiriman selesai tapi form masih di halaman (mis. gangguan jaringan)
  document.addEventListener("turbo:submit-end", function (e) {
    if (e.target && e.target.matches && e.target.matches("[data-login-form]")) {
      resetSubmit(e.target);
    }
  });

  // Tombol Back dari cache browser
  window.addEventListener("pageshow", function () {
    document.querySelectorAll("[data-login-form]").forEach(resetSubmit);
  });
})();
