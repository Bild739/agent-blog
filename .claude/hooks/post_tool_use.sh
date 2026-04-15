#!/bin/bash
# post_tool_use.sh
# PostToolUse フック: ファイル書き込み後に文字数をチェックしてフィードバックする

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# drafts/ への Write/Edit の後だけチェックする
if [ "$TOOL_NAME" = "Write" ] || [ "$TOOL_NAME" = "Edit" ]; then
  if echo "$FILE_PATH" | grep -q '^drafts/'; then

    # ファイルが存在する場合に文字数をカウント
    if [ -f "$FILE_PATH" ]; then
      CHAR_COUNT=$(wc -m < "$FILE_PATH")

      # frontmatter を除いた本文文字数の目安（frontmatterは約200字と仮定）
      BODY_COUNT=$((CHAR_COUNT - 200))

      if [ "$BODY_COUNT" -lt 800 ]; then
        echo "文字数警告: 現在の本文は約${BODY_COUNT}字です。目安は1000字以上です。まとめセクションや具体例を追加することを検討してください。"
      elif [ "$BODY_COUNT" -lt 1000 ]; then
        echo "文字数メモ: 現在の本文は約${BODY_COUNT}字です。あと少しで目安の1000字に達します。"
      fi
    fi

  fi
fi

exit 0
