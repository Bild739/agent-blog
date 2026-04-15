# agent-blog

エージェントAIの活用術と最新動向を発信する日本語ブログ。
国内外の記事・研究・ツールを収集・要約し、週1〜2本のペースで記事化する。

## プロジェクト構成

```
agent-blog/
├── CLAUDE.md / CLAUDE.local.md
├── .claude/
│   ├── settings.json       # hooks・MCP設定
│   ├── rules/              # seo.md / tone.md / sources.md
│   ├── skills/             # collect / draft / review / publish
│   ├── agents/             # researcher / writer / editor
│   └── hooks/              # pre_tool_use.sh / session_start.sh
├── posts/                  # 公開済み記事（git管理）
├── drafts/                 # 下書き（.gitignore対象）
├── sources/collected.md    # 収集済みソース一覧
└── docs/                   # GitHub Pages公開ルート
```

## コマンド

```bash
# 記事ワークフロー
/collect   # 情報収集 → sources/collected.md を更新
/draft     # 収集結果から記事MD生成 → drafts/ に保存
/review    # SEO・文体チェック（結果をコメントで返す）
/publish   # drafts/ → posts/ → GitHub push

# 確認
ls drafts/           # 未完成下書き一覧
ls posts/            # 公開済み記事一覧
cat sources/collected.md   # 収集済みソース確認
```

## 記事フォーマット

```markdown
---
title: "記事タイトル（30〜50字）"
date: YYYY-MM-DD
tags: [agent, ai, workflow]  # 2〜4個
summary: "1〜2文の要約（SNSシェア用）"
---

## はじめに（200字程度）

## 本文セクション（H2で2〜4個）

## まとめ（200字程度）
```

## コーディング規約

- Markdownファイルのみ編集する（.sh/.json以外は原則触らない）
- ファイル名は `YYYY-MM-DD-slug.md` 形式（例: 2026-04-14-agent-news.md）
- drafts/ に保存してから /review → /publish の順で進める

## 絶対ルール

- `git push --force` は実行しない
- `posts/` 配下のファイルを直接編集しない（必ず drafts/ を経由する）
- APIキー・トークン類をファイルに書かない（.envのみ）
- 事実確認できない情報を記事に含めない

## チームへの共有

このリポジトリはpublicで公開する。
`drafts/` と `CLAUDE.local.md` は .gitignore に追加済み。
新しくセットアップする人は README.md の手順を参照。
