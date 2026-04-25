---
name: publish
description: drafts/ の記事をposts/に移動してGitHubにpushし公開する。「公開して」「publishして」などの明示的な指示が来たときのみ実行する。
disable-model-invocation: true
allowed-tools: Bash, Read, Write
---

# 公開ワークフロー

## 目的

レビュー済みの下書きを `posts/` に移動し、GitHubリポジトリにpushしてGitHub Pagesで公開する。

## 前提確認（必ずStep 0から始める）

### Step 0: 実行前チェック（自動）

以下のスクリプトを実行する。エラーが出た場合は中断してユーザーに報告する:

```bash
bash scripts/pre-publish-check.sh [drafts/YYYY-MM-DD-slug.md]
```

引数省略時は `drafts/` の最新ファイルを自動検出する。
スクリプトが出力する `DRAFT_FILE=...` の値を以降のステップで使用する。

### Step 1: ファイルを移動する

```bash
# drafts/ → posts/ にコピーしてから元ファイルを削除（mv と同等）
cp drafts/YYYY-MM-DD-slug.md posts/YYYY-MM-DD-slug.md
rm drafts/YYYY-MM-DD-slug.md
```

**注意: cp の後に必ず rm を実行する。drafts/ に残ったままにしない。**

### Step 2: docs/ にコピーする

GitHub Pages の公開ルートにコピーする:

```bash
cp posts/YYYY-MM-DD-slug.md docs/posts/YYYY-MM-DD-slug.md
```

### Step 2.5: index.html を更新する

記事リストを自動生成する:

```bash
node docs/update-index.js
```

### Step 3: git操作

```bash
git add posts/ docs/
git commit -m "post: [記事タイトル]"
git push origin main
```

**注意: `git push --force` は絶対に実行しない**

### Step 4: sources/collected.md を更新する

`sources/collected.md` の該当エントリに `記事化済み` を追記する:

```bash
# 記事のタイトルまたはslugに一致する行の「記事化候補: Yes」を「記事化候補: Yes（記事化済み）」に更新
SLUG="YYYY-MM-DD-slug"  # 対象記事のslug
node -e "
const fs = require('fs');
const file = 'sources/collected.md';
let content = fs.readFileSync(file, 'utf8');
// 対象slugの記事化候補行を更新（前後10行以内に slug の文字列がある場合）
// 簡易実装: 全体から記事化候補: Yes の行を記事化済みに（手動確認を推奨）
console.log('sources/collected.md の該当行を手動で「記事化済み」に更新してください');
"
```

**自動実行モードでは**: 公開後に `sources/collected.md` の `記事化候補: Yes` を
`記事化候補: Yes（記事化済み）` に更新するスクリプトを別途 `scripts/mark-published.sh` に実装予定。

### Step 5: 完了報告

公開URLを出力する: `https://Bild739.github.io/agent-blog/posts/[slug]`
