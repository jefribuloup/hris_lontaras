(function () {
  "use strict";
  // Pencarian FAQ di Pusat Bantuan. Memakai event delegation supaya tetap
  // berfungsi setelah Turbo berpindah halaman tanpa reload.
  if (window.__hrisPagesBound) return;
  window.__hrisPagesBound = true;

  document.addEventListener("input", function (e) {
    var box = e.target.closest("[data-faq-search]");
    if (!box) return;
    var q = box.value.trim().toLowerCase();
    var root = document.querySelector("[data-faq]");
    if (!root) return;

    var anyVisible = false;
    root.querySelectorAll("[data-faq-group]").forEach(function (group) {
      var groupVisible = false;
      group.querySelectorAll("[data-faq-item]").forEach(function (item) {
        var match = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
        item.hidden = !match;
        if (match) groupVisible = true;
      });
      group.hidden = !groupVisible;
      if (groupVisible) anyVisible = true;
    });
    var empty = root.querySelector("[data-faq-empty]");
    if (empty) empty.hidden = anyVisible;
  });
})();
