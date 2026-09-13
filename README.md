# ryozowski.github.io

個人で開発しているアプリの公開ページ。GitHub Pages で `https://ryozowski.github.io/` として公開している。

アプリ本体のリポジトリは private のため、**外部に公開してよい文書だけ**をここに置く。

## 構成

```
.
├── index.html            アプリ一覧
├── style.css             共通スタイル（ダーク / ライト両対応）
├── .nojekyll             Jekyll のビルドを抑止する
└── multilap/
    ├── index.html        サポートページ
    └── privacy/
        ├── index.html    プライバシーポリシー（日本語）
        └── en.html       英語
```

## ストアに登録している URL

| 用途 | URL |
| --- | --- |
| サポート URL（App Store 必須） | https://ryozowski.github.io/multilap/ |
| プライバシーポリシー（両ストア必須） | https://ryozowski.github.io/multilap/privacy/ |

**これらの URL はストアの掲載情報から参照されている。パスを変えたりファイルを消したりしない。**
変更が必要な場合は、先にストア側の登録内容を更新すること。

## ポリシーを更新するとき

プライバシーポリシーの本文は 3 箇所にある。**必ず同時に更新する**。

1. このリポジトリの `multilap/privacy/index.html` と `en.html`
2. アプリ本体の `docs/privacy-policy.md` と `docs/privacy-policy.en.md`
3. アプリ内表示（`lib/l10n/app_ja.arb` / `app_en.arb` の `privacy*` キー）

内容がずれるとストア審査で不整合を指摘される。

## アプリを追加するとき

`<アプリ名>/` ディレクトリを作り、`index.html`（サポート）と `privacy/` を同じ構成で置く。
ルートの `index.html` にカードを 1 枚足す。
