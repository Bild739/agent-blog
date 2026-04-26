---
name: autorun
description: 週次の記事生成パイプラインを全自動実行する。collect → draft → review を順に実行し、レビュー合格で下書きを準備完了状態にする。「自動実行」「週次実行」「autorun」などの指示で使用する。
allowed-tools: Bash, Read, Write
---

# 週次自動実行パイプライン

## 目的

`/collect` → `/draft` → `/review` を順番に実行し、
公開準備が整った下書きを `drafts/` に生成する。

`/publish` は**実行しない**（最終確認は人間が行う）。

## 実行フロー

### Step 0: 実行前準備

```bash
# パイプライン開始を記録
TODAY=$(date +%Y-%m-%d)
echo "## $TODAY 自動実行開始 ($(date '+%H:%M'))" >> drafts/.pipeline-status.md
```

git の状態を確認し、未コミットの変更があれば警告を出して続行する
（自動実行では停止しない）。

### Step 1: 情報収集（/collect）

`/collect` スキルの手順に従って情報収集を実行する。

完了後、`sources/collected.md` の記事化候補件数を確認する:
- **3件以上**: Step 2 に進む
- **1〜2件**: Tier 2 補完を試みてから Step 2 に進む
- **0件**: パイプラインを中断し、ステータスに記録して終了する

```bash
echo "- Step 1 完了: 記事化候補 N 件" >> drafts/.pipeline-status.md
```

### Step 2: 下書き生成（/draft）

`/draft` スキルの手順に従って下書きを生成する。

- 生成したファイルパスを変数 `DRAFT_FILE` に保存する
- 完了後、ファイル名と文字数を記録する

```bash
echo "- Step 2 完了: $DRAFT_FILE (XXXX字)" >> drafts/.pipeline-status.md
```

### Step 3: レビュー（/review）

`/review` スキルの手順に従って `$DRAFT_FILE` をレビューする。

#### 合格（「公開可能」）の場合

- `status: reviewed` が frontmatter に書き込まれる（/review Step 7 で自動実行）
- `drafts/` から `pending/` にファイルをコピーして git にコミットする:

```bash
SLUG=$(basename "$DRAFT_FILE")
cp "$DRAFT_FILE" "pending/$SLUG"
rm "$DRAFT_FILE"
git add "pending/$SLUG"
git commit -m "autorun: レビュー済み下書きを pending/ に追加 ($SLUG)"
git push origin main
```

- ステータスに記録する:

```bash
echo "- Step 3 完了: レビュー合格 → pending/$SLUG にコミット済み" >> drafts/.pipeline-status.md
echo "- **公開準備完了**: /publish pending/$SLUG を実行してください" >> drafts/.pipeline-status.md
```

#### 不合格（「要修正」）の場合

- `status` は書き込まない
- ステータスに修正点を記録してパイプラインを停止する:

```bash
echo "- Step 3 完了: レビュー不合格 → 要修正" >> drafts/.pipeline-status.md
echo "  修正点: [レビュー結果の修正必須項目を箇条書き]" >> drafts/.pipeline-status.md
echo "  対応: 修正後に /review $DRAFT_FILE を再実行してください" >> drafts/.pipeline-status.md
```

### Step 4: 完了通知

パイプラインの結果サマリを出力する:

```
=== 週次自動実行 完了 ===
日時: YYYY-MM-DD HH:MM
収集件数: N 件（記事化候補: N 件）
下書き: drafts/YYYY-MM-DD-slug.md
レビュー: 合格 / 要修正

次のアクション:
  合格 → /publish drafts/YYYY-MM-DD-slug.md
  要修正 → 内容を確認して修正後 /review を再実行
===
```

ステータスファイルの最終更新時刻を記録する:

```bash
echo "- 実行完了: $(date '+%Y-%m-%d %H:%M')" >> drafts/.pipeline-status.md
```

## エラーハンドリング

| 状況 | 対応 |
|------|------|
| 収集件数 0件 | ステータス記録 → 中断 |
| draft 生成失敗 | ステータス記録 → 中断 |
| review 要修正 | ステータス記録 → 停止（手動修正を待つ） |
| git push 失敗 | /publish は手動のため対象外 |

## 注意事項

- このスキルは `/publish` を実行しない
- `drafts/.pipeline-status.md` はセッション開始時に session_start.sh が読み込んで表示する
- 同じ日に複数回実行した場合は `sources/collected.md` への重複追記に注意する
