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
なければ全般的なAIエージェント最新動向を収集する。

### Step 2: Tier 1 — 必須サイトを WebFetch で確認する

`.claude/rules/sources.md` の **Tier 1** を必ず全件フェッチする:

1. https://www.anthropic.com/news
2. https://openai.com/blog
3. https://huggingface.co/blog
4. https://deepmind.google/discover/blog/

各サイトから公開30日以内の記事を抽出し、記事化候補を判定する。

### Step 3: Tier 2 — 件数が不足する場合は WebSearch で補完する

Tier 1 で記事化候補が3件未満の場合、`sources.md` の **Tier 2 推奨キーワード** で
WebSearch を実行して補完する。

- Tier 1 で3件以上候補が出た場合はこのステップをスキップしてよい

### Step 4: sources/collected.md に追記する

既存の内容を保持しつつ、先頭に今日の収集分を追記する。
フォーマットは `.claude/rules/sources.md` の「収集フォーマット」に従う。

### Step 5: 完了報告

以下をサマリとして出力する:
- 収集件数・記事化候補の件数
- 使用した Tier（Tier 1 のみ / Tier 1 + Tier 2）
- 今日の収集日時
