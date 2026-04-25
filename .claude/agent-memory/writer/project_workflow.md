---
name: ブログ記事作成ワークフロー
description: agent-blogでの記事作成の基本的な流れと保存先ルール
type: project
---

記事の下書きは必ず `drafts/YYYY-MM-DD-[slug].md` に保存する。`posts/` への直接編集は禁止で、`/review` → `/publish` の順で進める。

**Why:** CLAUDE.mdの絶対ルールとして定められており、レビューなしに公開されないよう設計されている。

**How to apply:** `/draft` 実行時は常に `drafts/` に書き出す。`posts/` に直接書かない。
