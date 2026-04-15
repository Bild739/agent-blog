---
name: collect
description: エージェントAI関連の最新情報をWebから収集し sources/collected.md に追記する。「情報収集」「最新動向を調べて」「ソース収集」などの指示が来たら使用する。
disable-model-invocation: true
allowed-tools: WebFetch, WebSearch, Read, Write
---

# 情報収集ワークフロー

## 目的

エージェントAI関連の最新記事・ブログ・論文を収集し、`sources/collected.md` に整理する。

## 手順

### Step 1: 収集対象を決める

$ARGUMENTS があればそのテーマで収集する。
なければ以下のキーワードで幅広く収集する:

- 「AI agent 2026」
- 「LLM agent workflow」
- 「Claude Code tips」
- 「MCP server」
- 「agentic AI use case」
- 「AIエージェント 活用」
- 「自律型AI 最新」

### Step 2: 情報源を確認する

`.claude/rules/sources.md` に記載された優先度の高いサイトから順に確認する。
特に以下は毎回チェックする:

1. https://www.anthropic.com/news
2. https://openai.com/blog
3. https://huggingface.co/blog

### Step 3: 記事を収集する

- 公開から30日以内の記事を対象にする
- 1回の収集で5〜10件を目安にする
- タイトルと本文冒頭を読んで関連性を判断する

### Step 4: sources/collected.md に追記する

既存の内容を保持しつつ、先頭に今日の収集分を追記する。
フォーマットは `.claude/rules/sources.md` の「収集フォーマット」に従う。

### Step 5: 完了報告

収集件数・記事化候補の件数・今日の収集日時をサマリとして出力する。
