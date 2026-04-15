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
echo "ワークフロー: /collect → /draft → /review → /publish"
echo "================================="

exit 0
