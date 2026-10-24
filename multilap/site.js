/*
 * マルチラップ計測（MultiLap）の公開ページ用スクリプト。<head> で同期的に読み込む。
 *
 * 1. テーマ: アプリは URL の末尾に #theme-light / #theme-dark を付けて開く。その指定を
 *    sessionStorage に残し、<html data-theme> に反映する。ページ内リンクで URL の印が外れても、
 *    同じタブで別のページへ移っても、アプリの指定どおりの色が続く。訪問者がテーマボタンで
 *    選んだ値は localStorage に残す。優先順位は URL の印 > このタブの指定 > 保存した選択 > 端末の設定。
 * 2. 触れるデモ（使い方）と、動き続けるカード（トップ）。
 * 3. よくある質問の絞り込み。
 *
 * JavaScript が無くても本文は読め、テーマは CSS（site.css の :target）だけで切り替わる。
 */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  /* ================= テーマ ================= */

  var SESSION_KEY = "multilap.theme.session";
  var SAVED_KEY = "multilap.theme";

  function read(store, key) {
    try { return window[store].getItem(key); } catch (e) { return null; }
  }
  function write(store, key, value) {
    try {
      if (value == null) window[store].removeItem(key);
      else window[store].setItem(key, value);
    } catch (e) { /* 保存できない環境でもページは表示する */ }
  }
  function valid(v) { return v === "light" || v === "dark" ? v : null; }

  function themeFromUrl() {
    var m = /theme-(light|dark)/.exec(location.hash);
    if (m) return m[1];
    var q = /[?&]theme=(light|dark)\b/.exec(location.search);
    return q ? q[1] : null;
  }

  function applyTheme(mode) {
    if (mode === "light" || mode === "dark") root.setAttribute("data-theme", mode);
    else root.removeAttribute("data-theme");
  }

  var fromUrl = themeFromUrl();
  if (fromUrl) write("sessionStorage", SESSION_KEY, fromUrl);
  var current = fromUrl || valid(read("sessionStorage", SESSION_KEY)) || valid(read("localStorage", SAVED_KEY));
  applyTheme(current);

  var LANG = (root.lang || "ja").slice(0, 2) === "ja" ? "ja" : "en";

  var THEME_LABEL = {
    ja: { auto: "テーマ: 端末の設定に合わせる", light: "テーマ: ライト", dark: "テーマ: ダーク" },
    en: { auto: "Theme: match device", light: "Theme: light", dark: "Theme: dark" },
  };

  function setupThemeButton() {
    var btn = document.querySelector(".theme-btn");
    if (!btn) return;
    function sync() {
      var mode = root.getAttribute("data-theme") || "auto";
      btn.setAttribute("data-mode", mode);
      btn.setAttribute("aria-label", THEME_LABEL[LANG][mode]);
      btn.title = THEME_LABEL[LANG][mode];
    }
    btn.addEventListener("click", function () {
      var mode = root.getAttribute("data-theme") || "auto";
      var next = mode === "auto" ? "light" : mode === "light" ? "dark" : "auto";
      var value = next === "auto" ? null : next;
      write("localStorage", SAVED_KEY, value);
      write("sessionStorage", SESSION_KEY, value);
      applyTheme(value);
      // URL の印が残っていると、次に開き直したときにボタンの選択より印が勝つ
      if (/theme-(light|dark)/.test(location.hash)) {
        history.replaceState(null, "", location.pathname + location.search);
      }
      sync();
    });
    sync();
  }

  /* ================= 時刻の表示（アプリと同じ書式） ================= */

  var H100 = 100 * 3600 * 1000;
  function p2(n) { return String(n).padStart(2, "0"); }
  // 1/100 秒未満は切り捨て。1 時間未満は MM:SS.hh、以上は H:MM.SS。100 時間で周回する
  function fmt(ms) {
    ms = ((Math.floor(ms) % H100) + H100) % H100;
    var cs = Math.floor(ms / 10) % 100, s = Math.floor(ms / 1000) % 60;
    var m = Math.floor(ms / 60000) % 60, h = Math.floor(ms / 3600000);
    return h > 0 ? h + ":" + p2(m) + "." + p2(s) : p2(m) + ":" + p2(s) + "." + p2(cs);
  }
  function stamp(d) {
    return "" + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()) + "_" + p2(d.getHours()) + p2(d.getMinutes());
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ================= デモの文言 ================= */

  var T = {
    ja: {
      app: "マルチラップ計測", edit: "Edit", all: "一括",
      names: ["太郎", "花子", "健太"],
      tabs: ["標準", "ミニ", "リッチ"],
      laps: function (n) { return n + " Laps・Avg "; },
      lapNo: function (n) { return "Lap" + n; },
      share: ["データを保存", "テキストをコピー", "CSVで共有", "TXTで共有"], cancel: "キャンセル",
      saved: function (l) { return "保存しました: " + l; },
      copied: "コピーしました",
      osShare: "OS の共有シートが開きます",
      resetAsk: function (n) { return "停止中の" + n + "件をリセットしますか?"; }, reset: "リセット",
      omitted: "このデモでは省略しています",
      name: "名前をタップすると変更できます（6文字まで）",
      tabsNote: "標準・ミニ・リッチは、それぞれ別のカードを持ちます",
      target: "旗のボタンで目標ラップ数を決められます",
      tips: [
        "ここをタップ",
        function (left) { return "Lap をタップ（あと " + left + " 回）"; },
        "一括 Start をタップ",
        "タイムをタップ",
        "「<」で戻る",
        "共有アイコンをタップ",
      ],
      progress: function (d, n) { return d + " / " + n; },
    },
    en: {
      app: "MultiLap", edit: "Edit", all: "All",
      names: ["Alex", "Mia", "Sam"],
      tabs: ["Standard", "Mini", "Rich"],
      laps: function (n) { return n + " Laps・Avg "; },
      lapNo: function (n) { return "Lap " + n; },
      share: ["Save Data", "Copy as Text", "Share as CSV", "Share as TXT"], cancel: "Cancel",
      saved: function (l) { return "Saved: " + l; },
      copied: "Copied",
      osShare: "The system share sheet opens here",
      resetAsk: function (n) { return "Reset " + n + " paused cards?"; }, reset: "Reset",
      omitted: "Not included in this demo",
      name: "Tap the name to rename the card (up to 6 characters)",
      tabsNote: "Standard, Mini and Rich each keep their own cards",
      target: "The flag button sets target laps",
      tips: [
        "Tap here",
        function (left) { return "Tap Lap (" + left + " more)"; },
        "Tap All Start",
        "Tap the time",
        "Go back with “<”",
        "Tap the share icon",
      ],
      progress: function (d, n) { return d + " / " + n; },
    },
  }[LANG];

  var COLORS = ["#4A90D9", "#F77E31", "#3FD8E9"];

  var ICON = {
    tpl: '<svg viewBox="0 0 24 24"><path d="M6 3.5h9l3 3v14H6z"/><path d="M9 8.5h6M9 12h6M9 15.5h4"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M12 3v12M12 3l-4 4M12 3l4 4M5 12v7h14v-7"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"/></svg>',
    flag: '<svg viewBox="0 0 24 24"><path d="M6 21V4h11l-1.6 3.5L17 11H6"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    palette: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="9.5" r="1" fill="currentColor"/><circle cx="14.5" cy="9" r="1" fill="currentColor"/><circle cx="15.5" cy="13.5" r="1" fill="currentColor"/></svg>',
    tabStd: '<svg viewBox="0 0 24 24"><rect x="4" y="4.5" width="16" height="5" rx="1.6"/><rect x="4" y="14.5" width="16" height="5" rx="1.6"/></svg>',
    tabMini: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/></svg>',
    tabRich: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="8.5" cy="12" r="2.4"/><path d="M13 10.5h5M13 13.5h3.5"/></svg>',
  };

  /* ================= デモ ================= */

  // カードの計測は時刻差分方式（開始時刻 + 累積値）。アプリと同じく、UI のタイマーに依存しない
  function Card(i) {
    return { i: i, name: T.names[i], ac: COLORS[i], st: "idle", startAt: 0, acc: 0, marks: [] };
  }
  function total(c, now) { return c.st === "run" ? c.acc + (now - c.startAt) : c.acc; }
  function curLap(c, now) { return total(c, now) - (c.marks.length ? c.marks[c.marks.length - 1] : 0); }
  function lapCount(c) { return c.marks.length + 1; }

  function Demo(el, opts) {
    this.el = el;
    this.auto = !!opts.auto;
    this.tour = opts.tour || null;
    this.cards = [Card(0), Card(1), Card(2)];
    this.detail = null;
    this.step = 0;
    this.visible = true;
    this.build();
    this.render();
    this.loop();
    if (this.auto) this.autoplay();
    if (this.tour) this.syncTour();
  }

  Demo.prototype.build = function () {
    var tabs = [ICON.tabStd, ICON.tabMini, ICON.tabRich].map(function (ic, k) {
      return '<button class="a-tab' + (k === 0 ? " on" : "") + '" data-a="tab">' + ic + T.tabs[k] + "</button>";
    }).join("");
    this.el.innerHTML =
      '<div class="screen"><i class="blob a"></i><i class="blob b"></i><i class="blob c"></i>' +
      '<div class="app">' +
      '<div class="a-hdr"><button class="hb" data-a="omit">' + T.edit + '</button>' +
      '<button class="hb icon" data-a="omit" aria-label="templates">' + ICON.tpl + "</button>" +
      '<div class="ttl">' + esc(T.app) + "</div>" +
      '<button class="hb icon" data-a="share" data-k="share" aria-label="share">' + ICON.share + "</button>" +
      '<button class="hb icon" data-a="omit" aria-label="settings">' + ICON.gear + "</button></div>" +
      '<div class="a-bulk">' +
      '<button class="bb g" data-a="bStart" data-k="bStart"><span>' + T.all + "</span><b>Start</b></button>" +
      '<button class="bb r" data-a="bStop"><span>' + T.all + "</span><b>Stop</b></button>" +
      '<button class="bb" data-a="bLap"><span>' + T.all + "</span><b>Lap</b></button>" +
      '<button class="bb" data-a="bReset"><span>' + T.all + "</span><b>Reset</b></button>" +
      '<button class="bb tg" data-a="target" aria-label="target laps">' + ICON.flag + "</button></div>" +
      '<div class="a-list"></div>' +
      '<div class="a-tabs glass">' + tabs + "</div></div>" +
      '<div class="a-page"><div class="a-hdr"><button class="hb icon" data-a="back" data-k="back" aria-label="back">' + ICON.back + "</button>" +
      '<div class="ttl d-name"></div>' +
      '<button class="hb icon" data-a="target" aria-label="target laps">' + ICON.flag + "</button>" +
      '<button class="hb icon" data-a="omit" aria-label="color">' + ICON.palette + "</button>" +
      '<button class="hb icon" data-a="share" aria-label="share">' + ICON.share + "</button></div>" +
      '<div class="d-total"></div><div class="d-sub"></div><div class="d-laps"></div></div>' +
      '<div class="a-veil" data-a="close"></div>' +
      '<div class="a-sheet"><div class="a-grp">' +
      T.share.map(function (s, k) { return '<button data-a="sheet" data-n="' + k + '">' + esc(s) + "</button>"; }).join("") +
      '</div><div class="a-grp cancel"><button data-a="close">' + esc(T.cancel) + "</button></div></div>" +
      '<div class="a-dlg" role="alertdialog"><p></p><div class="acts"><button data-a="close">' + esc(T.cancel) +
      '</button><button class="danger" data-a="resetOk">' + esc(T.reset) + "</button></div></div>" +
      '<div class="a-toast" role="status" aria-live="polite"></div></div>' +
      '<i class="notch"></i>';
    if (!this.auto) {
      this.ring = document.createElement("i");
      this.ring.className = "coach";
      this.tip = document.createElement("span");
      this.tip.className = "tip below";
      this.el.appendChild(this.ring);
      this.el.appendChild(this.tip);
    }
    this.q = function (s) { return this.el.querySelector(s); };
    var self = this;
    if (this.auto) {
      this.el.setAttribute("inert", "");
    } else {
      this.el.addEventListener("click", function (e) { self.onClick(e); });
      // タイム部はボタン要素ではないため、キーボードでも押せるようにする
      this.el.addEventListener("keydown", function (e) {
        if ((e.key === "Enter" || e.key === " ") && e.target.getAttribute("role") === "button") {
          e.preventDefault();
          e.target.click();
        }
      });
      window.addEventListener("resize", function () { self.placeCoach(); });
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { self.visible = es[0].isIntersecting; }).observe(this.el);
    }
  };

  Demo.prototype.cardHTML = function (c) {
    var left = c.st === "run"
      ? '<button class="cbtn stop" data-a="stop" data-k="stop' + c.i + '">Stop</button>'
      : '<button class="cbtn start" data-a="start" data-k="start' + c.i + '">Start</button>';
    var right = c.st === "pause"
      ? '<button class="cbtn" data-a="reset">Reset</button>'
      : '<button class="cbtn" data-a="lap" data-k="lap' + c.i + '"' + (c.st === "run" ? "" : " disabled") + ">Lap</button>";
    return '<div class="card" data-i="' + c.i + '" style="--ac:' + c.ac + '">' +
      '<div class="nm" data-a="name">' + esc(c.name) + "</div>" +
      '<div class="tz" data-a="detail" data-k="tz' + c.i + '" role="button" tabindex="0">' +
      '<div class="tt" data-live="t' + c.i + '"></div>' +
      '<div class="lp"><span class="lb" data-live="n' + c.i + '">' + lapCount(c) + "</span>" +
      '<span data-live="c' + c.i + '"></span></div></div>' +
      '<div class="cbtns">' + left + right + "</div></div>";
  };

  Demo.prototype.render = function () {
    var self = this;
    this.q(".a-list").innerHTML = this.cards.map(function (c) { return self.cardHTML(c); }).join("");
    var any = function (f) { return self.cards.some(f); };
    this.q('[data-a="bStart"]').disabled = !any(function (c) { return c.st !== "run"; });
    this.q('[data-a="bStop"]').disabled = !any(function (c) { return c.st === "run"; });
    this.q('[data-a="bLap"]').disabled = !any(function (c) { return c.st === "run"; });
    this.q('[data-a="bReset"]').disabled = !any(function (c) { return c.st === "pause"; });
    this.renderDetail(true);
    this.tick(Date.now());
    this.placeCoach();
  };

  Demo.prototype.renderDetail = function (full) {
    var page = this.q(".a-page");
    var c = this.detail;
    if (!c) return;
    page.style.setProperty("--ac", c.ac);
    if (!full) return;
    this.q(".d-name").textContent = c.name;
    var now = Date.now(), prev = 0, laps = [];
    c.marks.forEach(function (m) { laps.push(m - prev); prev = m; });
    // 最速・最遅は確定ラップが 2 本以上のときだけ。現在ラップは対象外、同タイムは全て
    var fast = null, slow = null;
    if (laps.length >= 2) {
      var cs = laps.map(function (l) { return Math.floor(l / 10); });
      fast = Math.min.apply(null, cs);
      slow = Math.max.apply(null, cs);
    }
    var rows = laps.map(function (l, k) {
      var v = Math.floor(l / 10);
      var cls = v === fast ? " fast" : v === slow ? " slow" : "";
      return '<div class="laprow' + cls + '"><span class="ln">' + T.lapNo(k + 1) + '</span><span class="lt">' + fmt(l) + "</span></div>";
    });
    rows.push('<div class="laprow cur"><span class="ln">' + T.lapNo(laps.length + 1) + '</span><span class="lt" data-live="dc"></span></div>');
    this.q(".d-laps").innerHTML = rows.join("");
    this.tick(now);
  };

  Demo.prototype.tick = function (now) {
    var el = this.el;
    this.cards.forEach(function (c) {
      var t = el.querySelector('[data-live="t' + c.i + '"]');
      var l = el.querySelector('[data-live="c' + c.i + '"]');
      if (t) t.textContent = fmt(total(c, now));
      if (l) l.textContent = fmt(curLap(c, now));
    });
    var c = this.detail;
    if (c) {
      this.q(".d-total").textContent = fmt(total(c, now));
      // Avg = Total ÷ 現在ラップを含むラップ数
      this.q(".d-sub").textContent = T.laps(lapCount(c)) + fmt(total(c, now) / lapCount(c));
      var dc = el.querySelector('[data-live="dc"]');
      if (dc) dc.textContent = fmt(curLap(c, now));
    }
  };

  // 表示の更新は 1 つの requestAnimationFrame に集約し、画面外では止める
  Demo.prototype.loop = function () {
    var self = this;
    function frame() {
      if (self.visible && !document.hidden) self.tick(Date.now());
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  Demo.prototype.toast = function (msg) {
    var t = this.q(".a-toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  };

  Demo.prototype.overlay = function (which) {
    this.q(".a-veil").classList.toggle("show", !!which);
    this.q(".a-sheet").classList.toggle("show", which === "sheet");
    this.q(".a-dlg").classList.toggle("show", which === "dlg");
  };

  Demo.prototype.flashBadge = function (c) {
    var b = this.el.querySelector('[data-live="n' + c.i + '"]');
    if (!b) return;
    b.classList.add("flash");
    setTimeout(function () { b.classList.remove("flash"); }, 350);
  };

  Demo.prototype.act = function (a, c, now) {
    if (a === "start" && c.st !== "run") { c.st = "run"; c.startAt = now; }
    else if (a === "stop" && c.st === "run") { c.acc = total(c, now); c.st = "pause"; }
    else if (a === "lap" && c.st === "run") { c.marks.push(total(c, now)); }
    else if (a === "reset") { c.st = "idle"; c.acc = 0; c.startAt = 0; c.marks = []; }
  };

  Demo.prototype.onClick = function (e) {
    var btn = e.target.closest("[data-a]");
    if (!btn || btn.disabled) return;
    var a = btn.getAttribute("data-a");
    var cardEl = btn.closest(".card");
    var c = cardEl ? this.cards[+cardEl.getAttribute("data-i")] : null;
    // 一括 Start は、タップした瞬間の時刻を全カードの共通の起点にする
    var now = Date.now();
    var self = this;
    var ev = { a: a, i: c ? c.i : -1 };

    if (a === "start" || a === "stop" || a === "lap" || a === "reset") {
      this.act(a, c, now);
      this.render();
      if (a === "lap") this.flashBadge(c);
    } else if (a === "bStart") {
      this.cards.forEach(function (x) { if (x.st !== "run") self.act("start", x, now); });
      this.render();
    } else if (a === "bStop") {
      this.cards.forEach(function (x) { self.act("stop", x, now); });
      this.render();
    } else if (a === "bLap") {
      this.cards.forEach(function (x) { if (x.st === "run") { self.act("lap", x, now); } });
      this.render();
      this.cards.forEach(function (x) { if (x.st === "run") self.flashBadge(x); });
    } else if (a === "bReset") {
      var n = this.cards.filter(function (x) { return x.st === "pause"; }).length;
      this.q(".a-dlg p").textContent = T.resetAsk(n);
      this.overlay("dlg");
    } else if (a === "resetOk") {
      this.cards.forEach(function (x) { if (x.st === "pause") self.act("reset", x, now); });
      this.overlay(null);
      this.render();
    } else if (a === "detail") {
      this.detail = c;
      this.renderDetail(true);
      this.q(".a-page").classList.add("open");
      setTimeout(function () { self.placeCoach(); }, 320);
    } else if (a === "back") {
      this.q(".a-page").classList.remove("open");
      this.detail = null;
      setTimeout(function () { self.placeCoach(); }, 320);
    } else if (a === "share") {
      this.overlay("sheet");
    } else if (a === "sheet") {
      var k = +btn.getAttribute("data-n");
      this.overlay(null);
      this.toast(k === 0 ? T.saved(stamp(new Date())) : k === 1 ? T.copied : T.osShare);
    } else if (a === "close") {
      this.overlay(null);
    } else if (a === "name") {
      this.toast(T.name);
    } else if (a === "tab") {
      this.toast(T.tabsNote);
    } else if (a === "target") {
      this.toast(T.target);
    } else if (a === "omit") {
      this.toast(T.omitted);
    }
    if (this.tour) this.advance(ev);
  };

  /* ---- 手順の案内 ---- */

  // 各手順の完了条件。lap は状態で判定し、それ以外は手順の最中に押したかで判定する
  var STEPS = [
    { key: "start0", done: function (d) { return d.cards[0].st !== "idle"; } },
    { key: "lap0", done: function (d) { return d.cards[0].marks.length >= 2; } },
    { key: "bStart", done: function (d, ev) { return ev.a === "bStart" || !d.cards.some(function (c) { return c.st === "idle"; }); } },
    { key: "tz0", done: function (d, ev) { return ev.a === "detail"; } },
    { key: "back", done: function (d, ev) { return ev.a === "back"; } },
    { key: "share", done: function (d, ev) { return ev.a === "share"; } },
  ];

  Demo.prototype.advance = function (ev) {
    while (this.step < STEPS.length && STEPS[this.step].done(this, ev)) {
      this.step++;
      ev = {};
    }
    this.syncTour();
  };

  Demo.prototype.targetFor = function (step) {
    if (step >= STEPS.length) return null;
    var key = STEPS[step].key;
    if (key === "start0") return this.q('[data-k="start0"]');
    if (key === "lap0") return this.q('[data-k="lap0"]');
    if (key === "bStart") return this.q('[data-k="bStart"]');
    if (key === "tz0") return this.detail ? null : this.q('[data-k="tz0"]');
    if (key === "back") return this.detail ? this.q('[data-k="back"]') : null;
    if (key === "share") return this.detail ? null : this.q('[data-k="share"]');
    return null;
  };

  Demo.prototype.tipText = function (step) {
    var t = T.tips[step];
    if (typeof t === "function") return t(Math.max(1, 2 - this.cards[0].marks.length));
    return t;
  };

  Demo.prototype.placeCoach = function () {
    if (!this.ring) return;
    var target = this.targetFor(this.step);
    var busy = this.q(".a-veil").classList.contains("show");
    if (!target || target.disabled || busy) {
      this.ring.hidden = true;
      this.tip.hidden = true;
      return;
    }
    var box = this.el.getBoundingClientRect();
    var r = target.getBoundingClientRect();
    var pad = 4;
    this.ring.hidden = false;
    this.ring.style.left = (r.left - box.left - pad) + "px";
    this.ring.style.top = (r.top - box.top - pad) + "px";
    this.ring.style.width = (r.width + pad * 2) + "px";
    this.ring.style.height = (r.height + pad * 2) + "px";
    this.ring.style.borderRadius = getComputedStyle(target).borderRadius;

    this.tip.hidden = false;
    this.tip.textContent = this.tipText(this.step);
    var tw = this.tip.offsetWidth, th = this.tip.offsetHeight;
    var cx = r.left - box.left + r.width / 2;
    var x = Math.max(8, Math.min(box.width - tw - 8, cx - tw / 2));
    var below = r.bottom - box.top + th + 18 < box.height - 70;
    var y = below ? r.bottom - box.top + 12 : r.top - box.top - th - 12;
    this.tip.className = "tip " + (below ? "below" : "above");
    this.tip.style.left = x + "px";
    this.tip.style.top = y + "px";
    this.tip.style.setProperty("--arrow-x", Math.max(12, Math.min(tw - 12, cx - x)) + "px");
  };

  Demo.prototype.syncTour = function () {
    var list = this.tour.querySelectorAll(".tour li");
    var step = this.step;
    for (var k = 0; k < list.length; k++) {
      list[k].classList.toggle("done", k < step);
      list[k].classList.toggle("now", k === step);
      list[k].setAttribute("aria-current", k === step ? "step" : "false");
    }
    var bar = this.tour.querySelector(".progress i");
    if (bar) bar.style.width = (step / STEPS.length) * 100 + "%";
    var count = this.tour.querySelector(".progress .count");
    if (count) count.textContent = T.progress(step, STEPS.length);
    var done = this.tour.querySelector(".tour-done");
    if (done) done.classList.toggle("show", step >= STEPS.length);
    this.placeCoach();
  };

  Demo.prototype.restart = function () {
    this.cards = [Card(0), Card(1), Card(2)];
    this.detail = null;
    this.q(".a-page").classList.remove("open");
    this.overlay(null);
    this.step = 0;
    this.render();
    this.syncTour();
  };

  /* ---- 自動再生（トップのヒーロー） ---- */

  Demo.prototype.autoplay = function () {
    var self = this;
    var now = Date.now();
    // すでに数周しているところから見せる
    var seed = [[71230, 143870, 214410], [69980, 141120, 213990], [74560, 150210]];
    this.cards.forEach(function (c, k) {
      c.st = "run";
      c.startAt = now - (seed[k][seed[k].length - 1] + 20000 + k * 3100);
      c.marks = seed[k].slice();
    });
    this.render();
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    setInterval(function () {
      if (!self.visible || document.hidden) return;
      var c = self.cards[Math.floor(Math.random() * self.cards.length)];
      if (curLap(c, Date.now()) < 8000) return;
      self.act("lap", c, Date.now());
      self.render();
      self.flashBadge(c);
    }, 2600);
  };

  /* ================= よくある質問の絞り込み ================= */

  function setupFaqSearch() {
    var input = document.querySelector(".search input");
    if (!input) return;
    var items = Array.prototype.slice.call(document.querySelectorAll("details.qa"));
    var secs = Array.prototype.slice.call(document.querySelectorAll(".faq-sec"));
    var none = document.querySelector(".no-hit");
    var texts = items.map(function (d) { return d.textContent.toLowerCase(); });
    input.addEventListener("input", function () {
      var words = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      var hits = 0;
      items.forEach(function (d, k) {
        var ok = words.every(function (w) { return texts[k].indexOf(w) >= 0; });
        d.hidden = !ok;
        if (ok) hits++;
        if (words.length) d.open = ok;
      });
      if (!words.length) items.forEach(function (d) { d.open = false; });
      secs.forEach(function (s) {
        s.hidden = !s.querySelector("details.qa:not([hidden])");
      });
      if (none) none.classList.toggle("show", hits === 0);
    });
    // ページ内リンク（#q-…）で開いたときは、その質問を開く
    function openTarget() {
      var id = location.hash.slice(1);
      if (!id || /^theme-/.test(id)) return;
      var d = document.getElementById(id);
      if (d && d.tagName === "DETAILS") d.open = true;
    }
    window.addEventListener("hashchange", openTarget);
    openTarget();
  }

  /* ================= 起動 ================= */

  document.addEventListener("DOMContentLoaded", function () {
    setupThemeButton();
    setupFaqSearch();
    var demo = document.querySelector("[data-demo]");
    if (demo) {
      var tour = document.querySelector("[data-tour]");
      var d = new Demo(demo, { auto: demo.getAttribute("data-demo") === "auto", tour: tour });
      var again = tour && tour.querySelector("[data-restart]");
      if (again) again.addEventListener("click", function () { d.restart(); });
    }
  });
})();
