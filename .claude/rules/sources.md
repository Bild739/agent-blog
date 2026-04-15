---
paths:
  - "sources/**"
---

# 信頼できる情報源リスト

## 優先度：高（必ず確認する）

### 公式・一次情報
- https://www.anthropic.com/news — Anthropic公式ニュース
- https://openai.com/blog — OpenAI公式ブログ
- https://deepmind.google/discover/blog/ — Google DeepMind
- https://ai.meta.com/blog/ — Meta AI
- https://mistral.ai/news/ — Mistral AI

### 技術メディア
- https://arxiv.org — 論文（cs.AI / cs.LG セクション）
- https://huggingface.co/blog — HuggingFace公式ブログ
- https://lilianweng.github.io — Lilian Weng（OpenAI研究員のブログ）

## 優先度：中（参考として使う）

### ニュース・解説メディア
- https://techcrunch.com/tag/artificial-intelligence/
- https://venturebeat.com/ai/
- https://the-decoder.com
- https://www.technologyreview.com/topic/artificial-intelligence/

### コミュニティ
- https://news.ycombinator.com — Hacker News（AIタグ）
- https://www.reddit.com/r/MachineLearning/

### 日本語メディア
- https://zenn.dev — Zenn（AI・LLMタグ）
- https://note.com — note（AIエージェントタグ）
- https://dev.classmethod.jp — DevelopersIO

## 収集ルール

- 公開から**30日以内**の記事を優先する
- 著者が明記されている記事を優先する
- 個人ブログは内容を必ず一次情報と照合してから引用する
- 収集した情報は `sources/collected.md` にまとめる

## 収集フォーマット（sources/collected.md への記載形式）

```markdown
## YYYY-MM-DD 収集分

### [記事タイトル](URL)
- **情報源**: サイト名
- **公開日**: YYYY-MM-DD
- **要点**: 2〜3文で内容をまとめる
- **記事化候補**: Yes / No
```
