#!/bin/bash
# session_start.sh
# SessionStart フック: セッション開始時に作業コンテキストを注入する

TODAY=$(date '+%Y-%m-%d')

echo "=== agent-blog セッション開始 ==="
echo "今日の日付: $TODAY"
echo ""

# drafts/ の未完成下書き一覧
if [ -d "drafts" ] && [ "$(ls drafts/*.md 2>/dev/null | wc -l)" -gt 0 ]; then
  echo "【未完成の下書き】"
  for f in drafts/*.md; do
    TITLE=$(grep '^title:' "$f" 2>/dev/null | head -1 | sed 's/title: //' | tr -d '"')
    DATE=$(grep '^date:' "$f" 2>/dev/null | head -1 | sed 's/date: //')
    echo "  - $f (${DATE:-日付なし}) ${TITLE:-タイトルなし}"
  done
  echo ""
else
  echo "【未完成の下書き】なし"
  echo ""
fi

# sources/collected.md の記事化候補件数
if [ -f "sources/collected.md" ]; then
  CANDIDATE_COUNT=$(grep -c '記事化候補: Yes' sources/collected.md 2>/dev/null || echo 0)
  echo "【記事化候補】${CANDIDATE_COUNT}件 (sources/collected.md)"
else
  echo "【記事化候補】sources/collected.md がまだありません。/collect から始めましょう。"
fi

echo ""

# pending/ の公開待ち下書き（/autorun がレビュー合格後にコミットしたもの）
PENDING_COUNT=$(ls pending/*.md 2>/dev/null | grep -v '.gitkeep' | wc -l)
if [ "$PENDING_COUNT" -gt 0 ]; then
  echo "【公開待ち (pending/)】$PENDING_COUNT 件 — /publish pending/[ファイル名] で公開できます"
  for f in pending/*.md; do
    [ "$f" = "pending/.gitkeep" ] && continue
    TITLE=$(grep '^title:' "$f" 2>/dev/null | head -1 | sed 's/title: //' | tr -d '"')
    echo "  - $f: ${TITLE:-タイトルなし}"
  done
  echo ""
fi

# パイプラインステータス（/autorun の実行結果）
if [ -f "drafts/.pipeline-status.md" ]; then
  LAST_RUN=$(tail -5 "drafts/.pipeline-status.md")
  if echo "$LAST_RUN" | grep -q "公開準備完了"; then
    echo "【自動実行ステータス】✓ 公開準備完了の下書きがあります"
    PUBLISH_TARGET=$(grep "公開準備完了" "drafts/.pipeline-status.md" | tail -1 | grep -oE 'drafts/[^ ]+')
    [ -n "$PUBLISH_TARGET" ] && echo "  → /publish $PUBLISH_TARGET"
  elif echo "$LAST_RUN" | grep -q "要修正"; then
    echo "【自動実行ステータス】⚠ レビューで要修正の下書きがあります"
    echo "  → drafts/.pipeline-status.md を確認してください"
  fi
  echo ""
fi

echo "ワークフロー: /collect → /draft → /review → /publish"
echo "   自動実行: /autorun（collect → draft → review を一括実行）"
echo "================================="

exit 0
