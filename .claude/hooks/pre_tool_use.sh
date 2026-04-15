#!/bin/bash
# pre_tool_use.sh
# PreToolUse フック: 危険な操作をブロックする

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# ── Bash コマンドのチェック ──────────────────────────────

if [ "$TOOL_NAME" = "Bash" ]; then

  # git push --force をブロック
  if echo "$COMMAND" | grep -qE 'git push.*(--force|-f)'; then
    echo "force pushは禁止されています。通常の git push を使ってください。" >&2
    exit 2
  fi

  # rm -rf をブロック（posts/ drafts/ sources/ docs/ への適用）
  if echo "$COMMAND" | grep -qE 'rm\s+-rf?\s+(posts|drafts|sources|docs)'; then
    echo "重要ディレクトリへの rm -rf は禁止されています。" >&2
    exit 2
  fi

  # drafts/ を経由せず直接 posts/ に書き込む mv をブロック
  if echo "$COMMAND" | grep -qE 'mv\s+(?!drafts/).+\s+posts/'; then
    echo "posts/ への直接書き込みは禁止です。必ず drafts/ を経由してください。" >&2
    exit 2
  fi

fi

# ── Write / Edit ツールのチェック ────────────────────────

if [ "$TOOL_NAME" = "Write" ] || [ "$TOOL_NAME" = "Edit" ]; then

  # .md .json .sh .env 以外のファイル拡張子をブロック
  if [ -n "$FILE_PATH" ]; then
    EXT="${FILE_PATH##*.}"
    case "$EXT" in
      md|json|sh|env|gitignore|txt|yaml|yml) ;;
      *)
        echo "このプロジェクトでは .$EXT ファイルの編集は想定されていません。意図した操作か確認してください。" >&2
        exit 2
        ;;
    esac
  fi

  # posts/ への直接書き込みをブロック
  if echo "$FILE_PATH" | grep -q '^posts/'; then
    echo "posts/ への直接書き込みは禁止です。drafts/ に保存してから /publish で移動してください。" >&2
    exit 2
  fi

fi

exit 0
