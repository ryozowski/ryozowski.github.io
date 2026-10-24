# ryozowski.github.io

個人で開発しているアプリの公開ページ。GitHub Pages で `https://ryozowski.github.io/` として公開している。

アプリ本体のリポジトリは private のため、**外部に公開してよい文書だけ**をここに置く。

## 構成

```
.
├── index.html            アプリ一覧
├── style.css             共通スタイル（ダーク / ライト両対応）
├── .nojekyll             Jekyll のビルドを抑止する
├── multilap/             マルチラップ計測（MultiLap）。/style.css は使わず site.css で完結
│   ├── index.html        サポートページ（日本語）。en.html が英語
│   ├── site.css          MultiLap のページ共通のスタイル（ダーク / ライト両対応）
│   ├── site.js           テーマの引き継ぎ・テーマ切替・使い方のデモ・FAQ の絞り込み
│   ├── icon.png          アプリのアイコン
│   ├── guide/            使い方（index.html = 日本語 / en.html = 英語。以下同じ）
│   ├── faq/              よくある質問
│   ├── terms/            利用規約
│   └── privacy/          プライバシーポリシー
└── nisedenwa/            偽電話（Fake Call）
    ├── index.html        サポートページ
    ├── site.css          使い方・よくある質問・サポートのページ用（/style.css に重ねる）
    ├── icons.svg         アイコン（Material Icons、Apache License 2.0）
    ├── icon.png          アプリのアイコン（180px）
    ├── guide/
    │   ├── index.html    使い方（日本語）
    │   └── en.html       英語
    ├── faq/
    │   ├── index.html    よくある質問（日本語）
    │   └── en.html       英語
    ├── privacy/
    │   ├── index.html    プライバシーポリシー（日本語）
    │   └── en.html       英語
    └── terms/
        ├── index.html    利用規約（日本語）
        └── en.html       英語
```

## ストアに登録している URL

### マルチラップ計測（MultiLap）

| 用途 | URL |
| --- | --- |
| サポート URL（App Store 必須） | https://ryozowski.github.io/multilap/ |
| プライバシーポリシー（両ストア必須） | https://ryozowski.github.io/multilap/privacy/ |
| 利用規約 | https://ryozowski.github.io/multilap/terms/ |

マルチラップ計測は、使い方・よくある質問・利用規約・プライバシーポリシー（日英とも）を**アプリの設定画面から
直接開いている**（アプリ本体の `lib/core/constants/web_links.dart`。iOS は SFSafariViewController、
Android は既定のブラウザ）。日本語は `…/guide/`、それ以外の言語は `…/guide/en.html` を開く。
パスを変えるとアプリから開けなくなり、それはストアの更新なしには直せない。

### 偽電話（Fake Call）

| 用途 | URL |
| --- | --- |
| サポート URL（App Store 必須） | https://ryozowski.github.io/nisedenwa/ |
| プライバシーポリシー（両ストア必須） | https://ryozowski.github.io/nisedenwa/privacy/ |
| 利用規約 | https://ryozowski.github.io/nisedenwa/terms/ |

**これらの URL はストアの掲載情報から参照されている。パスを変えたりファイルを消したりしない。**
変更が必要な場合は、先にストア側の登録内容を更新すること。

偽電話は、これらのページと使い方・よくある質問（日英とも）を**アプリ内の WebView からも直接読み込んでいる**
（アプリ本体の `lib/core/constants/app_constants.dart`）。パスを変えるとアプリの設定画面から
ポリシーが開けなくなり、それはストアの更新なしには直せない。アプリ内の WebView は
`/nisedenwa/` の外へは遷移しない。

**GitHub のアカウント名を変えない・アカウントを削除しない。** ユーザー名が空くと第三者が
同じ URL でページを配信できるようになり、アプリに入っている URL は差し替えられない。

**アプリ本体（nisedenwa）のリポジトリで GitHub Pages を有効にしない。** 有効にすると、
そのプロジェクトサイトが `https://ryozowski.github.io/nisedenwa/` を上書きする。

## ライト / ダークの切り替え

ページは端末の設定（`prefers-color-scheme`）に従う。URL の末尾に `#theme-light` / `#theme-dark` を
付けると、端末の設定より優先してライト / ダークになる。偽電話のアプリ内の WebView は
JavaScript を無効にしているため、アプリの外観の設定に合わせてこの印を付けて開く。

- 仕組みは CSS だけ（`style.css` の `:root:has(#theme-light:target)`）。ページに
  `<i id="theme-light" hidden></i><i id="theme-dark" hidden></i>` を置く
- `:has()` の無いブラウザ（iOS 15.3 以前など）では端末の設定に従う
- ページ内の別の場所へのリンク（`href="#..."`）を置くと、印が外れて端末の設定に戻る。
  アプリから開くページには置かない
- 色を変えたときは、`style.css` と `nisedenwa/site.css` の両方で、端末の設定の側と
  `#theme-*` の側を同じ値にする

マルチラップ計測のページ（`multilap/site.js`）は、これに JavaScript を重ねている。

- `#theme-light` / `#theme-dark` の指定をタブ単位（sessionStorage）で覚えて `<html data-theme>` に付けるため、
  ページ内リンクで印が外れても、別のページへ移っても、アプリの指定が続く。ページ内リンクを置いてよい
- 上部のボタンで訪問者が選んだテーマは localStorage に残る
- 色の値は `multilap/site.css` の 5 箇所（ダーク 2・ライト 3）を同じにする

## ポリシーを更新するとき

### マルチラップ計測

プライバシーポリシーの本文は 2 箇所にある。**必ず同時に更新する**（アプリ内表示はやめ、アプリはこのページを開く）。

1. このリポジトリの `multilap/privacy/index.html` と `en.html`
2. アプリ本体の `docs/privacy-policy.md` と `docs/privacy-policy.en.md`

使い方・よくある質問・利用規約の本文は**このリポジトリだけ**にある。アプリの仕様（本体の `docs/spec.md`）を
変えたときは、使い方とよくある質問の該当箇所も日英とも直す。

内容がずれるとストア審査で不整合を指摘される。

### 偽電話

プライバシーポリシーと利用規約の本文は**このリポジトリだけ**にある。アプリは本文を持たず、
このページを WebView で表示する。日本語版と英語版は必ず同時に更新する。

アプリが端末内に保存する情報・要求する権限・通信先を変えたときは、プライバシーポリシーの
該当箇所（「端末内に保存する情報」「端末の権限の利用」「基本方針」の通信先）も更新すること。

## アプリを追加するとき

`<アプリ名>/` ディレクトリを作り、`index.html`（サポート）と `privacy/` を同じ構成で置く。
利用規約が要るアプリは `terms/` を同じ形で足す。
ルートの `index.html` にカードを 1 枚足す。
