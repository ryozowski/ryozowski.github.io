# ryozowski.github.io

個人で開発しているアプリの公開ページ。GitHub Pages で `https://ryozowski.github.io/` として公開している。

アプリ本体のリポジトリは private のため、**外部に公開してよい文書だけ**をここに置く。

## 構成

```
.
├── index.html            アプリ一覧
├── style.css             共通スタイル（ダーク / ライト両対応）
├── .nojekyll             Jekyll のビルドを抑止する
├── multilap/
│   ├── index.html        サポートページ
│   └── privacy/
│       ├── index.html    プライバシーポリシー（日本語）
│       └── en.html       英語
├── nisedenwa/            偽電話（Fake Call）
│   ├── index.html        サポートページ
│   ├── privacy/
│   │   ├── index.html    プライバシーポリシー（日本語）
│   │   └── en.html       英語
│   └── terms/
│       ├── index.html    利用規約（日本語）
│       └── en.html       英語
└── watch-the-stone/      石を見守る（Watch the Stone）
    ├── index.html        サポートページ
    └── privacy/
        ├── index.html    プライバシーポリシー（日本語）
        └── en.html       英語
```

## ストアに登録している URL

### マルチラップ計測（MultiLap）

| 用途 | URL |
| --- | --- |
| サポート URL（App Store 必須） | https://ryozowski.github.io/multilap/ |
| プライバシーポリシー（両ストア必須） | https://ryozowski.github.io/multilap/privacy/ |

### 偽電話（Fake Call）

| 用途 | URL |
| --- | --- |
| サポート URL（App Store 必須） | https://ryozowski.github.io/nisedenwa/ |
| プライバシーポリシー（両ストア必須） | https://ryozowski.github.io/nisedenwa/privacy/ |
| 利用規約 | https://ryozowski.github.io/nisedenwa/terms/ |

### 石を見守る（Watch the Stone）

| 用途 | URL |
| --- | --- |
| サポート URL（App Store 必須） | https://ryozowski.github.io/watch-the-stone/ |
| プライバシーポリシー（両ストア必須） | https://ryozowski.github.io/watch-the-stone/privacy/ |

**これらの URL はストアの掲載情報から参照されている。パスを変えたりファイルを消したりしない。**
変更が必要な場合は、先にストア側の登録内容を更新すること。

偽電話は、これらのページ（日英とも）を**アプリ内の WebView からも直接読み込んでいる**
（アプリ本体の `lib/core/constants/app_constants.dart`）。パスを変えるとアプリの設定画面から
ポリシーが開けなくなり、それはストアの更新なしには直せない。アプリ内の WebView は
`/nisedenwa/` の外へは遷移しない。

**GitHub のアカウント名を変えない・アカウントを削除しない。** ユーザー名が空くと第三者が
同じ URL でページを配信できるようになり、アプリに入っている URL は差し替えられない。

**アプリ本体（nisedenwa）のリポジトリで GitHub Pages を有効にしない。** 有効にすると、
そのプロジェクトサイトが `https://ryozowski.github.io/nisedenwa/` を上書きする。

## ポリシーを更新するとき

### マルチラップ計測

プライバシーポリシーの本文は 3 箇所にある。**必ず同時に更新する**。

1. このリポジトリの `multilap/privacy/index.html` と `en.html`
2. アプリ本体の `docs/privacy-policy.md` と `docs/privacy-policy.en.md`
3. アプリ内表示（`lib/l10n/app_ja.arb` / `app_en.arb` の `privacy*` キー）

内容がずれるとストア審査で不整合を指摘される。

### 偽電話

プライバシーポリシーと利用規約の本文は**このリポジトリだけ**にある。アプリは本文を持たず、
このページを WebView で表示する。日本語版と英語版は必ず同時に更新する。

アプリが端末内に保存する情報・要求する権限・通信先を変えたときは、プライバシーポリシーの
該当箇所（「端末内に保存する情報」「端末の権限の利用」「基本方針」の通信先）も更新すること。

### 石を見守る

プライバシーポリシーの本文は 2 箇所にある。**必ず同時に更新する**。

1. このリポジトリの `watch-the-stone/privacy/index.html` と `en.html`
2. アプリ本体の `docs/legal/privacy-policy.md` と `docs/legal/privacy-policy.en.md`（正本）

アプリは本文を持たず、図鑑画面からこのページを外部ブラウザで開く。

## アプリを追加するとき

`<アプリ名>/` ディレクトリを作り、`index.html`（サポート）と `privacy/` を同じ構成で置く。
利用規約が要るアプリは `terms/` を同じ形で足す。
ルートの `index.html` にカードを 1 枚足す。
