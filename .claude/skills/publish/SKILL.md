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

### Step 0: 実行前チェック

以下をすべて確認してから進む。1つでも未完了なら中断してユーザーに確認する:

- [ ] 対象ファイルが `drafts/` に存在するか
- [ ] `/review` のチェックで「公開可能」判定を受けているか
- [ ] frontmatterの `date` が今日の日付か
- [ ] gitの状態が clean か（未コミットの変更がないか）

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

### Step 4: 完了報告

- 公開URLを出力する（`https://[username].github.io/agent-blog/posts/[slug]`）
- `sources/collected.md` の該当ソースに「記事化済み」と追記するよう促す
