---
paths:
  - "sources/**"
---

# 信頼できる情報源リスト

自動収集（`/collect`）時の動作を3段階に分ける。

---

## Tier 1: 必須チェック（毎回 WebFetch で確認）

更新頻度が高く、記事化候補になりやすい公式ソース。
**自動収集では必ずこの4サイトをフェッチする。**

| サイト | URL |
|--------|-----|
| Anthropic 公式ニュース | https://www.anthropic.com/news |
| OpenAI 公式ブログ | https://openai.com/blog |
| HuggingFace ブログ | https://huggingface.co/blog |
| Google DeepMind ブログ | https://deepmind.google/discover/blog/ |

---

## Tier 2: 補助チェック（WebSearch でキーワード収集）

Tier 1 で件数が不足した場合、または特定トピックを深掘りする場合に使う。

### 推奨キーワード（英語）
- `AI agent framework 2026`
- `LLM tool use automation`
- `Claude Code OR MCP site:github.com OR site:arxiv.org`
- `agentic AI enterprise 2026`

### 推奨キーワード（日本語）
- `AIエージェント 活用事例 2026`
- `LLM ワークフロー 自動化`

### 参考サイト（ヒットした場合のみ使用）
- https://the-decoder.com
- https://techcrunch.com/tag/artificial-intelligence/
- https://arxiv.org （cs.AI / cs.LG セクション）
- https://dev.classmethod.jp
- https://zenn.dev

---

## Tier 3: 除外（自動収集では使わない）

ノイズが多い、または信頼性の確認に手間がかかるため除外。
良い記事を見つけた場合は手動で `sources/collected.md` に追記する。

- https://venturebeat.com/ai/ — プレスリリース転載が多く内容が薄い
- https://www.reddit.com/r/MachineLearning/ — 情報の質がばらつく
- https://news.ycombinator.com — コミュニティ向け。手動チェック推奨
- https://note.com — 個人記事が多く一次情報確認が必要
- https://mistral.ai/news/ — 更新頻度が低い
- https://ai.meta.com/blog/ — 更新頻度が低い

---

## 収集ルール

- 公開から **30日以内** の記事を優先する
- 著者が明記されている記事を優先する
- Tier 1 で3件以上候補が出たら Tier 2 はスキップしてよい
- 収集した情報は `sources/collected.md` にまとめる
- 個人ブログは内容を必ず一次情報と照合してから引用する

---

## 収集フォーマット（sources/collected.md への記載形式）

```markdown
## YYYY-MM-DD 収集分

### [記事タイトル](URL)
- **情報源**: サイト名
- **公開日**: YYYY-MM-DD
- **要点**: 2〜3文で内容をまとめる
- **記事化候補**: Yes / No
```
