#!/bin/bash
# scripts/pre-publish-check.sh
# /publish 実行前の自動チェックスクリプト
#
# 使い方:
#   bash scripts/pre-publish-check.sh [drafts/YYYY-MM-DD-slug.md]
#   引数省略時は drafts/ の最新ファイルを自動検出
#
# 終了コード:
#   0 = 全チェック通過（警告あり含む）
#   1 = エラーあり（公開不可）

ERRORS=0
WARNINGS=0

# ── 対象ファイルの特定 ──────────────────────────────────────
if [ -n "$1" ]; then
  DRAFT_FILE="$1"
else
  DRAFT_FILE=$(ls -t drafts/*.md 2>/dev/null | head -1)
fi

echo "=== publish 前チェック ==="
echo "対象: $DRAFT_FILE"
echo ""

# Check 1: ファイルの存在
if [ ! -f "$DRAFT_FILE" ]; then
  echo "✗ ファイルが見つかりません: $DRAFT_FILE"
  exit 1
fi
echo "✓ ファイル存在確認"

# Check 2: レビュー済みステータス（status: reviewed）
STATUS=$(grep -m1 '^status:' "$DRAFT_FILE" | awk '{print $2}' | tr -d '"')
if [ "$STATUS" = "reviewed" ]; then
  echo "✓ レビュー済み (status: reviewed)"
else
  echo "✗ レビュー未完了 (status: ${STATUS:-未設定}) — /review を先に実行してください"
  ERRORS=$((ERRORS + 1))
fi

# Check 3: frontmatter の date（警告のみ。自動実行では日付ズレを許容）
ARTICLE_DATE=$(grep -m1 '^date:' "$DRAFT_FILE" | awk '{print $2}' | tr -d '"')
TODAY=$(date +%Y-%m-%d)
if [ -z "$ARTICLE_DATE" ]; then
  echo "✗ frontmatter に date がありません"
  ERRORS=$((ERRORS + 1))
elif [ "$ARTICLE_DATE" != "$TODAY" ]; then
  echo "⚠ 記事の日付 ($ARTICLE_DATE) が今日 ($TODAY) と異なります（自動実行では許容）"
  WARNINGS=$((WARNINGS + 1))
else
  echo "✓ 日付確認 ($ARTICLE_DATE)"
fi

# Check 4: git の状態
DIRTY=$(git status --porcelain 2>/dev/null)
if [ -n "$DIRTY" ]; then
  echo "✗ git に未コミットの変更があります:"
  git status --short
  ERRORS=$((ERRORS + 1))
else
  echo "✓ git 状態クリーン"
fi

# ── 結果サマリ ───────────────────────────────────────────────
echo ""
if [ $ERRORS -gt 0 ]; then
  echo "結果: ✗ $ERRORS 件のエラー — 公開できません"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo "結果: ⚠ $WARNINGS 件の警告あり — 公開可能（確認推奨）"
  echo "DRAFT_FILE=$DRAFT_FILE"
  exit 0
else
  echo "結果: ✓ 全チェック通過 — 公開可能"
  echo "DRAFT_FILE=$DRAFT_FILE"
  exit 0
fi
