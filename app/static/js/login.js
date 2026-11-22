(function () {
  "use strict";
  var form = document.querySelector("[data-login-form]");
  if (!form) return;

  var roleInput = form.querySelector('input[name="role"]');
  var sub = form.querySelector("[data-sub]");
  var tabs = form.querySelectorAll("[data-role]");
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn.textContent;

  // Pilih peran: ubah tombol aktif, teks bantuan, dan nilai field tersembunyi
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.setAttribute("aria-pressed", "false"); });
      tab.setAttribute("aria-pressed", "true");
      roleInput.value = tab.dataset.role;
      sub.textContent = tab.dataset.sub;
    });
  });

  // Tampilkan / sembunyikan kata sandi
  form.querySelectorAll("[data-toggle-password]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = btn.parentNode.querySelector("input");
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "Sembunyikan" : "Tampilkan";
      btn.setAttribute("aria-pressed", String(show));
    });
  });

  // Status memuat saat form dikirim (form tetap terkirim ke server)
  form.addEventListener("submit", function () {
    submitBtn.disabled = true;
    submitBtn.textContent = "Memeriksa…";
  });

  // Pulihkan tombol jika halaman dibuka lagi lewat tombol Back
  window.addEventListener("pageshow", function () {
    submitBtn.disabled = false;
    submitBtn.textContent = submitLabel;
  });
})();
