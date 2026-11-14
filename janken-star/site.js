/*
 * じゃんけんスター（Janken Star）の公開ページ用スクリプト。<head> で defer で読み込む。
 *
 * 1. 目次: 規約・ポリシーの目次（.toc）で、いま読んでいる節を光らせる。
 * 2. よくある質問の絞り込み（サポートページ）。
 *
 * JavaScript が無くても本文・目次・質問はすべて読める。保存も通信もしない。
 */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ================= 目次 ================= */

  function setupToc() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var heads = Object.keys(byId)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    var visible = {};
    function mark() {
      var current = null;
      for (var i = 0; i < heads.length; i++) {
        if (visible[heads[i].id]) { current = heads[i].id; break; }
      }
      if (!current) return;
      links.forEach(function (a) {
        if (a === byId[current]) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      mark();
    }, { rootMargin: "-88px 0px -55% 0px" });
    heads.forEach(function (h) { observer.observe(h); });
  }

  /* ================= よくある質問の絞り込み ================= */

  function setupFaqSearch() {
    var input = document.querySelector(".search input");
    if (!input) return;
    var items = Array.prototype.slice.call(document.querySelectorAll("details.qa"));
    var none = document.querySelector(".no-hit");
    var texts = items.map(function (d) { return d.textContent.toLowerCase(); });
    input.addEventListener("input", function () {
      var words = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      var hits = 0;
      items.forEach(function (d, k) {
        var ok = words.every(function (w) { return texts[k].indexOf(w) >= 0; });
        d.hidden = !ok;
        if (ok) hits++;
        d.open = words.length > 0 && ok;
      });
      if (none) none.classList.toggle("show", hits === 0);
    });
    // ページ内リンク（#q-…）で開いたときは、その質問を開く
    function openTarget() {
      var id = location.hash.slice(1);
      var d = id && document.getElementById(id);
      if (d && d.tagName === "DETAILS") d.open = true;
    }
    window.addEventListener("hashchange", openTarget);
    openTarget();
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupToc();
    setupFaqSearch();
  });
})();
