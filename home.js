/*
 * トップページ（/ と /en.html）のテーマ切り替え。<head> で同期的に読み込み、描画前に色を決める。
 * 訪問者がボタンで選んだ値（ライト / ダーク）は localStorage に残す。「端末の設定に合わせる」を
 * 選ぶと保存を消す。JavaScript が無い場合はボタンを出さず、端末の設定に従う。
 */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var KEY = "ryozowski.theme";

  function read() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch (e) { return null; }
  }
  function write(v) {
    try {
      if (v) localStorage.setItem(KEY, v);
      else localStorage.removeItem(KEY);
    } catch (e) { /* 保存できない環境でも、このページの表示だけは切り替える */ }
  }
  // ブラウザのアドレスバーの色（<meta name="theme-color">）も、選んだテーマに合わせる。
  // 「端末の設定に合わせる」では、media 属性どおり（ダーク / ライトそれぞれの色）に戻す。
  var BAR = { dark: "#0b1220", light: "#e9eff7" };
  function apply(v) {
    if (v) root.setAttribute("data-theme", v);
    else root.removeAttribute("data-theme");
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      var own = /dark/.test(metas[i].media) ? "dark" : "light";
      metas[i].content = BAR[v || own];
    }
  }

  apply(read());

  var LABEL = {
    ja: { auto: "テーマ: 端末の設定に合わせる", light: "テーマ: ライト", dark: "テーマ: ダーク" },
    en: { auto: "Theme: match device", light: "Theme: light", dark: "Theme: dark" },
  };
  var lang = (root.lang || "ja").slice(0, 2) === "ja" ? "ja" : "en";

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".theme-btn");
    if (!btn) return;
    function sync() {
      var mode = root.getAttribute("data-theme") || "auto";
      btn.setAttribute("data-mode", mode);
      btn.setAttribute("aria-label", LABEL[lang][mode]);
      btn.title = LABEL[lang][mode];
    }
    btn.addEventListener("click", function () {
      var mode = root.getAttribute("data-theme") || "auto";
      var next = mode === "auto" ? "light" : mode === "light" ? "dark" : null;
      write(next);
      apply(next);
      sync();
    });
    sync();
  });
})();
