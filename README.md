# agent-blog

エージェントAIの活用術と最新動向を発信する日本語ブログ。

Claude Codeのエージェント機能（Skills・Hooks・Subagents・MCP等）を活用して、
情報収集から記事公開までを半自動化しています。

---

## セットアップ（初回のみ）

### 1. リポジトリをクローン

```bash
git clone https://github.com/[your-username]/agent-blog.git
cd agent-blog
```

### 2. Claude Code のバージョン確認

```bash
claude --version
# v2.1.59 以上が必要（Auto Memory対応）
```

### 3. GitHub Personal Access Token を取得

1. https://github.com/settings/tokens にアクセス
2. 「Generate new token (fine-grained)」をクリック
3. 以下の権限を付与:
   - `Contents`: Read and Write
   - `Pages`: Read and Write
   - `Metadata`: Read
4. 発行されたトークンをコピー

### 4. 環境変数を設定

```bash
# .env ファイルを作成（gitignore済み）
echo "GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxx" > .env
```

### 5. MCPサーバーをセットアップ

```bash
# GitHub MCP
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \
  -H "Authorization: Bearer $(grep GITHUB_PERSONAL_ACCESS_TOKEN .env | cut -d= -f2)"

# Filesystem MCP
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem \
  ./ ./drafts ./posts ./sources ./docs

# Context7 MCP（APIキー不要）
claude mcp add context7 -- npx -y @upstash/context7-mcp
```

### 6. GitHub Pages を有効化

1. GitHubリポジトリの Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main` / Folder: `/docs`
4. Save

### 7. Claude Code を起動して動作確認

```bash
claude
# SessionStartフックが動いて、今日の日付と作業状況が表示されればOK
```

---

## 記事を書く（通常のワークフロー）

```bash
# 1. 最新情報を収集する
/collect

# 2. 下書きを生成する
/draft

# 3. 校正・チェック
/review

# 4. 公開する
/publish
```

### 週次まとめ記事を一括生成する場合

```bash
# researcher + writer を並列起動して複数記事を一括生産
@weekly-producer 今週のAIエージェント関連ニュースをまとめて
```

---

## ディレクトリ構成

```
agent-blog/
├── CLAUDE.md                  # Claude Codeへの永続指示（チーム共有）
├── CLAUDE.local.md            # 個人設定（.gitignore対象）
├── .claude/
│   ├── settings.json          # Hooks設定
│   ├── rules/                 # seo.md / tone.md / sources.md
│   ├── skills/                # /collect /draft /review /publish
│   ├── agents/                # researcher / writer / editor / weekly-producer
│   └── hooks/                 # 自動実行スクリプト
├── posts/                     # 公開済み記事（git管理）
├── drafts/                    # 下書き（.gitignore対象・各自のローカルのみ）
├── sources/collected.md       # 収集済みソース一覧（git管理）
├── docs/                      # GitHub Pages公開ルート
└── .mcp.json                  # MCPサーバー設定（チーム共有）
```

---

## Claude Code 機能マッピング

| 機能 | 役割 |
|------|------|
| CLAUDE.md | ブログ方針・文体・ルールの永続記憶 |
| .claude/rules/ | SEO・文体・情報源ルールをパス別に管理 |
| Skills | /collect /draft /review /publish のワークフロー化 |
| Hooks | force push防止・文字数チェック・起動時コンテキスト注入 |
| Subagents | researcher / writer / editor の専門分業 |
| Agent Teams | weekly-producer による並列記事生産 |
| GitHub MCP | リポジトリへのpush・Pages公開 |
| Filesystem MCP | プロジェクト内ファイルの安全な操作 |
| Context7 MCP | 最新ライブラリ仕様の参照 |
| Auto Memory | 学習内容の自動蓄積（よいソース・文体の改善点等） |
| Plugins | blog-suite として全設定をパッケージ配布 |

---

## トラブルシューティング

### Hooksが動かない場合

```bash
# スクリプトに実行権限を付与
chmod +x .claude/hooks/*.sh
```

### MCPサーバーが認識されない場合

```bash
# 設定済みサーバーの確認
claude mcp list

# セッション内での状態確認
/mcp
```

### Auto Memoryを確認・編集したい場合

```bash
# セッション内で実行
/memory
```

---

## ライセンス

記事コンテンツ: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ja)
設定ファイル（.claude/）: MIT
