---
name: autorun
description: 週次の記事生成パイプラインを全自動実行する。collect → draft → review を順に実行し、レビュー合格でPRを作成して人間の確認を待つ。「自動実行」「週次実行」「autorun」などの指示で使用する。
allowed-tools: Bash, Read, Write
---

# 週次自動実行パイプライン

## 目的

`/collect` → `/draft` → `/review` を順番に実行し、
レビュー合格の下書きを **Pull Request** として作成する。

- `main` への直接 push は**行わない**
- `/publish` は**実行しない**（人間が PR を確認・マージ後に手動実行する）

## フロー概要

```
[自動] collect → draft → review
                              ↓ 合格
              ブランチ作成 → pending/ にコミット → PR オープン
                              ↓ 不合格
              ステータス記録 → 停止（手動修正待ち）

[人間] GitHub で PR を確認・修正・マージ → /publish
```

## 実行手順

### Step 0: 実行前準備

```bash
TODAY=$(date +%Y-%m-%d)
echo "## $TODAY 自動実行開始 ($(date '+%H:%M'))" >> drafts/.pipeline-status.md
```

**コスト抑制チェック**: 既に今週の実行済みエントリが `sources/collected.md` にある場合は
重複実行とみなし、ユーザーに確認を求めて停止する。

### Step 1: 情報収集（/collect）

`/collect` スキルの手順に従って情報収集を実行する。

- Tier 1 の4サイトをフェッチし、記事化候補を抽出する
- **候補が3件以上得られた時点で Tier 2 補完はスキップする**（コスト抑制）
- 0件の場合はパイプラインを中断してステータスに記録する

```bash
echo "- Step 1 完了: 記事化候補 N 件" >> drafts/.pipeline-status.md
```

### Step 2: 下書き生成（/draft）

`/draft` スキルの手順に従って下書きを生成する。

- 生成したファイルパスを `DRAFT_FILE` として記録する

```bash
echo "- Step 2 完了: $DRAFT_FILE" >> drafts/.pipeline-status.md
```

### Step 3: レビュー（/review）

`/review` スキルの**全ステップ**（Step 2〜5e）を実行する。
プロンプトインジェクションチェック（Step 5e）を必ず含めること。

#### 合格（「公開可能」）の場合 → Step 4 へ

#### 不合格（「要修正」）の場合

```bash
echo "- Step 3: レビュー不合格 → 要修正" >> drafts/.pipeline-status.md
echo "  修正点: [修正必須項目を箇条書き]" >> drafts/.pipeline-status.md
echo "  対応: 修正後に /review $DRAFT_FILE を再実行してください" >> drafts/.pipeline-status.md
```

パイプラインを**停止する**（Step 4 以降は実行しない）。

### Step 4: PR ブランチを作成する（合格時のみ）

```bash
SLUG=$(basename "$DRAFT_FILE" .md)
BRANCH="autorun/$SLUG"

# ブランチ作成・切り替え
git checkout -b "$BRANCH"

# pending/ にコピー（drafts/ は gitignore 対象のため pending/ 経由）
cp "$DRAFT_FILE" "pending/$(basename $DRAFT_FILE)"

# sources/collected.md と pending/ をまとめてコミット
git add sources/collected.md "pending/$(basename $DRAFT_FILE)"
git commit -m "autorun: $TODAY 週次記事の下書きを追加 ($SLUG)"

# ブランチを push（main への直接 push は行わない）
git push origin "$BRANCH"
```

### Step 5: Pull Request を作成する

```bash
gh pr create \
  --base main \
  --head "$BRANCH" \
  --title "[$TODAY] 週次記事: $(grep '^title:' pending/$(basename $DRAFT_FILE) | sed 's/title: //' | tr -d '\"')" \
  --body "$(cat <<'PRBODY'
## 自動生成された週次記事の下書き

このPRは /autorun によって自動生成されました。

### チェック済み項目
- [x] 情報収集（Tier 1 ソース）
- [x] 下書き生成（1000字以上・ですます調）
- [x] 自動レビュー（frontmatter・文体・構成・文字数・著作権・重複・個人情報・インジェクション）

### 人間による確認事項
- [ ] 事実関係の確認
- [ ] 文章のニュアンス確認
- [ ] 公開日付の確認

### 公開手順
このPRをマージ後、ローカルで `git pull` してから `/publish pending/[ファイル名]` を実行してください。
PRBODY
)"
```

### Step 6: 完了報告

```bash
echo "- Step 4/5 完了: PR オープン済み ($BRANCH)" >> drafts/.pipeline-status.md
echo "- **次のアクション**: GitHub PR を確認・マージ後に /publish を実行" >> drafts/.pipeline-status.md
echo "- 実行完了: $(date '+%Y-%m-%d %H:%M')" >> drafts/.pipeline-status.md
```

サマリを出力する:

```
=== 週次自動実行 完了 ===
日時: YYYY-MM-DD HH:MM
収集: N 件（記事化候補: N 件）
下書き: pending/YYYY-MM-DD-slug.md
レビュー: 合格
PR: https://github.com/Bild739/agent-blog/pulls

次のアクション:
  1. GitHub PR を確認・必要なら編集
  2. 問題なければ PR をマージ
  3. ローカルで git pull
  4. /publish pending/YYYY-MM-DD-slug.md
===
```

## エラーハンドリング

| 状況 | 対応 |
|------|------|
| 今週の収集済みエントリが既にある | 重複確認プロンプト → ユーザー応答待ち |
| 収集件数 0件 | ステータス記録 → 中断 |
| draft 生成失敗 | ステータス記録 → 中断 |
| review 要修正 | ステータス記録 → 停止 |
| gh コマンド未認証 | PR 作成スキップ → ブランチ push のみ実施・手動 PR 作成を案内 |

## 注意事項

- `main` への直接 push は**禁止**
- `git push --force` は**禁止**
- API キー・トークンをファイルに書かない
- `/publish` はこのスキルでは実行しない
