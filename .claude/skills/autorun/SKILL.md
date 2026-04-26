---
name: autorun
description: 週次の記事生成パイプラインをエージェントチームで実行するオーケストレーター。researcher → writer → editor の順にサブエージェントを起動し、レビュー合格でPRを作成する。「自動実行」「週次実行」「autorun」などの指示で使用する。
allowed-tools: Agent, Bash, Read, Write
---

# 週次自動実行パイプライン（オーケストレーター）

## 役割

このスキルは **オーケストレーター** として動作します。
自分では収集・執筆・レビューを行わず、専門エージェントに委任します。

```
autorun（オーケストレーター）
    ├── Agent: researcher  → 情報収集
    ├── Agent: writer      → 記事執筆
    └── Agent: editor      → 品質レビュー
```

## 実行手順

### Step 0: 重複実行チェック

今週の収集済みエントリが `sources/collected.md` に存在する場合は停止してユーザーに確認する。

```bash
TODAY=$(date +%Y-%m-%d)
WEEK_START=$(date -d "last monday" +%Y-%m-%d 2>/dev/null || date +%Y-%m-%d)
echo "実行日: $TODAY"
```

### Step 1: researcher エージェントを起動する

```
Agent(
  subagent_type="researcher",
  prompt="情報収集タスクを実行してください。完了後は必ず COLLECT_RESULT 形式で報告してください。"
)
```

**researcher の出力を受け取り**、`candidates=N` の値を確認する:
- N = 0: パイプラインを中断し、ユーザーに報告して終了する
- N >= 1: Step 2 に進む

### Step 2: writer エージェントを起動する

```
Agent(
  subagent_type="writer",
  prompt="下書き生成タスクを実行してください。完了後は必ず DRAFT_RESULT 形式で報告してください。"
)
```

**writer の出力を受け取り**、`file=drafts/...` のパスを取得する:
- ファイルパスが取得できない場合は中断してユーザーに報告する
- 取得できた場合: `DRAFT_FILE` としてStep 3 に渡す

### Step 3: editor エージェントを起動する

```
Agent(
  subagent_type="editor",
  prompt="以下のファイルをレビューしてください: [DRAFT_FILE]\n完了後は必ず REVIEW_RESULT 形式で報告してください。"
)
```

**editor の出力を受け取り**、`verdict=` の値を確認する:

#### verdict = 公開可能 → Step 4 へ

#### verdict = 要修正 → パイプライン停止

```bash
echo "## $(date +%Y-%m-%d) 自動実行: レビュー不合格" >> drafts/.pipeline-status.md
echo "- 対象: $DRAFT_FILE" >> drafts/.pipeline-status.md
echo "- 要修正のため pending/ への移動を中止" >> drafts/.pipeline-status.md
```

### Step 4: pending/ に移動してブランチを作成する（合格時のみ）

```bash
SLUG=$(basename "$DRAFT_FILE" .md)
BRANCH="autorun/$SLUG"

# ブランチ作成
git checkout -b "$BRANCH"

# pending/ にコピー（drafts/ は gitignore 対象のため）
cp "$DRAFT_FILE" "pending/$(basename $DRAFT_FILE)"
rm "$DRAFT_FILE"

# コミット（sources/collected.md と pending/ をまとめて）
git add sources/collected.md "pending/$(basename $DRAFT_FILE)"
git commit -m "autorun: $(date +%Y-%m-%d) 週次記事の下書きを追加 ($SLUG)"

# ブランチを push（main への直接 push は禁止）
git push origin "$BRANCH"
```

### Step 5: Pull Request を作成する

```bash
TITLE=$(grep '^title:' "pending/$(basename $DRAFT_FILE)" | sed 's/title: //' | tr -d '"')
gh pr create \
  --base main \
  --head "$BRANCH" \
  --title "[autorun] $TITLE" \
  --body "週次自動実行による下書き。レビュー済み（status: reviewed）。\n\n確認後、マージして /publish pending/$(basename $DRAFT_FILE) を実行してください。"
```

gh コマンドが使えない場合はブランチ push のみ実施し、手動 PR 作成を案内する。

### Step 6: 完了報告

```bash
echo "## $(date +%Y-%m-%d) 自動実行: 完了" >> drafts/.pipeline-status.md
echo "- PR: $BRANCH" >> drafts/.pipeline-status.md
```

以下のサマリを出力する:

```
=== autorun 完了 ===
researcher: 記事化候補 N 件
writer:     [ファイル名]（XXXX字）
editor:     公開可能

次のアクション:
  1. GitHub PR を確認・マージ
  2. git pull
  3. /publish pending/[ファイル名]
===================
```

## エラーハンドリング

| 状況 | 対応 |
|------|------|
| 今週収集済み | 確認プロンプト → ユーザー応答待ち |
| researcher: candidates=0 | 中断・ユーザーに報告 |
| writer: ファイル未生成 | 中断・ユーザーに報告 |
| editor: 要修正 | ステータス記録・停止 |
| git/gh 失敗 | エラー内容を報告・手動対応を案内 |

## 注意事項

- main への直接 push 禁止
- git push --force 禁止
- /publish はこのスキルでは実行しない
- 各エージェントの判断には介入しない（オーケストレーターはフローのみ制御）
