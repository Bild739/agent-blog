# 収集済みソース一覧

このファイルは `/collect` スキルによって自動更新されます。
新しい収集分は先頭に追記されます。

---

<!-- 収集データはここから下に追記されます -->

## 2026-05-07 収集分

### [NotebookLM 公式サイト](https://notebooklm.google.com)
- **情報源**: Google
- **公開日**: 2023-07-12（初回リリース）
- **要点**: GoogleのNotebookLMは、ユーザーがアップロードしたPDF・Googleドキュメント・YouTube URL等の資料のみを参照してAIが回答するRAGベースのツール。回答には必ず引用元が付与される。2024年にGemini 1.5 Proをバックエンドに採用し、最大100万トークンの資料処理が可能になった。Audio Overview（資料を対話形式の音声に変換する機能）が特徴。
- **記事化候補**: Yes（NotebookLM入門記事として記事化済み）

## 2026-04-27 収集分

### [Claude Design by Anthropic Labs](https://www.anthropic.com/news/claude-design-anthropic-labs)
- **情報源**: Anthropic 公式ニュース
- **公開日**: 2026-04-17
- **要点**: AnthropicがAnthropicLabsブランドで「Claude Design」をリリースした。デザイン・プロトタイプ・スライド・ワンページャーなどのビジュアル成果物をClaudeと協働して作成できるツールで、静的デザインをインタラクティブなプロトタイプに変換する機能が目玉。CanvaやFigmaとの連携も対応しており、デザイナー以外のビジネスユーザーもビジュアルコンテンツを制作できる。
- **記事化候補**: Yes（エージェント支援ツール・AI活用の観点として）

### [AI and the Future of Cybersecurity: Why Openness Matters](https://huggingface.co/blog/cybersecurity-openness)
- **情報源**: Hugging Face Blog
- **公開日**: 2026-04-21
- **要点**: Hugging FaceがAIとサイバーセキュリティの関係を分析したレポートを公開した。AIのサイバーセキュリティ能力はモデルサイズや汎用ベンチマーク性能と単純には比例しない「ジャグド（凸凹）」な特性を持つと指摘し、オープンソースモデルが防御側のイノベーションを加速する重要性を論じている。サイバーセキュリティの未来は単一モデルよりもそれを取り巻くエコシステムによって決まると結論付けている。
- **記事化候補**: Yes（AIセキュリティ・オープンソース観点の記事として）

### [Building long-horizon SWE environments on Hugging Face: Frontier SWE × OpenEnv](https://huggingface.co/blog/rycerzes/building-long-horizon-swe-environments-on-openenv)
- **情報源**: Hugging Face Blog
- **公開日**: 2026-04-26
- **要点**: ソフトウェアエンジニアリング（SWE）エージェントを長期タスク（45〜90分/エピソード）で訓練・評価するためのオープン環境「Frontier SWE × OpenEnv」を構築した事例。HTTP制御・MCPツール・多段階ルーブリックを組み合わせた均一な環境コントラクトを提供し、エージェントが計画・実行・前進を繰り返す長期タスクに対応する。オフラインRLを使ったトレーニングループもHugging Face Spaces上で公開されている。
- **記事化候補**: Yes（エージェント学習環境・長期タスク実行の実践例として）

### [Ecom-RLVE: Adaptive Verifiable Environments for E-Commerce Conversational Agents](https://huggingface.co/blog/ecom-rlve)
- **情報源**: Hugging Face Blog
- **公開日**: 2026-04-16
- **要点**: Eコマース向けの強化学習可能な検証環境「EcomRLVE-GYM」を発表。商品検索・代替品提案・カート構築・返品・注文追跡など8種類のマルチターン・ツール利用エージェント環境を提供し、難易度の12軸カリキュラムとアルゴリズム的に検証可能な報酬関数を備える。従来の単一ターン推論パズルからエージェント的ドメインへRLVR（強化学習による検証可能な報酬）を拡張した点が新しい。
- **記事化候補**: Yes（エージェント訓練・RLVR手法の実践例として）

### [Build Korean Agents with Nemotron-Personas](https://huggingface.co/blog/nvidia/build-korean-agents-with-nemotron-personas)
- **情報源**: Hugging Face Blog（NVIDIA）
- **公開日**: 2026-04-21
- **要点**: NVIDIAが韓国語・韓国文化コンテキストに特化したペルソナデータセット「Nemotron-Personas-Korea」を公開した。合成ペルソナをホストAPIとHugging Face Spacesを使って約20分でデプロイ可能な韓国語エージェントに変換するチュートリアルを提供している。金融・教育・公共サービスなど分野別エージェントの構築が可能で、多言語・文化特化エージェント開発の事例となる。
- **記事化候補**: Yes（多言語エージェント構築・ペルソナデータ活用の観点として）

---

## 2026-04-26 収集分

### [Introducing Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4-7)
- **情報源**: Anthropic 公式ニュース
- **公開日**: 2026-04-16
- **要点**: AnthropicがClaude Opus 4.7を正式リリースした。高度なソフトウェアエンジニアリングタスクでOpus 4.6を大幅に上回り、特に難易度の高いコーディング作業を監督なしで完遂できる。画像認識の解像度も向上し、プロフェッショナルな成果物（UI・スライド・ドキュメント）の品質が改善された。また、セキュリティ能力の制御実験としてサイバー攻撃関連のリクエストを自動検出・ブロックする安全機構が初めて搭載された。
- **記事化候補**: Yes

### [Introducing GPT-5.5](https://openai.com/index/introducing-gpt-5-5)
- **情報源**: OpenAI 公式ブログ
- **公開日**: 2026-04-23
- **要点**: OpenAIがGPT-5.5をリリースした。Terminal-Bench 2.0で82.7%、OSWorld-Verifiedで78.7%と複数のエージェントベンチマークで最高水準を記録し、GPT-5.4比でトークン効率も向上した。コーディング・コンピュータ操作・知識業務に強みがあり、Codex上でも85%以上のOpenAI社員が週次利用しているという。APIも近日公開予定。
- **記事化候補**: Yes

### [Introducing workspace agents in ChatGPT](https://openai.com/index/workspace-agents-in-chatgpt)
- **情報源**: OpenAI 公式ブログ
- **公開日**: 2026-04-22
- **要点**: OpenAIがChatGPTにワークスペースエージェント機能を追加した。ユーザーのワークスペース内のツール・データ・ファイルに接続したエージェントを作成・共有でき、チーム全体でAIエージェントを活用するための基盤となる。企業での自動化ワークフロー構築を大幅に簡略化する。
- **記事化候補**: Yes

### [DeepSeek-V4: a million-token context that agents can actually use](https://huggingface.co/blog/deepseekv4)
- **情報源**: Hugging Face Blog
- **公開日**: 2026-04-24
- **要点**: DeepSeekが1Mトークンコンテキストを持つDeepSeek-V4（Pro: 1.6Tパラメータ/49Bアクティブ、Flash: 284B/13Bアクティブ）をリリースした。CSA・HCAという2種の注意機構を組み合わせてKVキャッシュをGQA比で約2%まで削減し、長時間エージェントタスクに対応した。ツール呼び出しをまたいだ推論継続や専用トークンによるツール呼び出しスキーマも導入され、エージェントワークフロー向けの設計となっている。
- **記事化候補**: Yes

### [Inside VAKRA: Reasoning, Tool Use, and Failure Modes of Agents](https://huggingface.co/blog/vakra-benchmark-analysis)
- **情報源**: Hugging Face Blog
- **公開日**: 2026-04-15
- **要点**: VAKRAは、LLMエージェントの推論・ツール使用・失敗パターンを詳細に分析するベンチマーク。現行のフロンティアモデルにおけるエージェント的失敗モード（ツール選択ミス・ループ・コンテキスト飽和）を体系的に分類し、今後のエージェント改善指針を示している。
- **記事化候補**: Yes（エージェント評価・研究観点の記事として）

---

## 2026-04-15 収集分

### [Claude CodeにRoutines機能が追加 — バグ修正とコードレビューを自動化](https://the-decoder.com/claude-code-routines-let-ai-fix-bugs-and-review-code-on-autopilot/)
- **情報源**: The Decoder
- **公開日**: 2026-04-14
- **要点**: AnthropicがClaude Codeに「Routines（ルーティン）」機能を追加した。スケジュール・GitHub Events・API呼び出しをトリガーにして、バグ修正やPRレビューをユーザーのローカル環境なしにAnthropicのインフラ上で自動実行できる。利用回数はプランによって1日5〜25回の制限がある。
- **記事化候補**: Yes

### [ALTK-Evolve: AIエージェントが経験から学ぶ長期記憶フレームワーク](https://huggingface.co/blog/ibm-research/altk-evolve)
- **情報源**: Hugging Face Blog（IBM Research）
- **公開日**: 2026-04-08
- **要点**: IBM Researchが発表したALTK-Evolveは、エージェントの過去の行動ログを再利用可能なガイドライン（方針）へ変換する長期記憶システムである。AppWorldベンチマークで50.0%→58.9%（+8.9%）の性能向上を達成し、特に難易度の高いタスクで+14.2%の改善を示した。Claude Code・OpenAI Codex・IBM Bobなどとノーコードで統合でき、MCPを通じた接続も対応している。
- **記事化候補**: Yes

### [Holo3: 10Bパラメータでコンピュータ操作最前線を更新](https://huggingface.co/blog/Hcompany/holo3)
- **情報源**: Hugging Face Blog（HCompany）
- **公開日**: 2026-04-01
- **要点**: HCompanyが公開したHolo3は、OSWorld-Verifiedベンチマークで78.85%を達成しながら、有効パラメータ数を10Bに抑えた効率的なコンピュータ操作モデルである。合成ナビゲーションデータ・強化学習・ドメイン外データ拡張を組み合わせた「エージェント学習フライホイール」で訓練されている。
- **記事化候補**: Yes

### [Gemma 4リリース：エージェント用途に特化したGoogleのオープンウェイトモデル群](https://huggingface.co/blog/gemma4)
- **情報源**: Hugging Face Blog（Google DeepMind）
- **公開日**: 2026-04-02
- **要点**: Google DeepMindがApache 2.0ライセンスのオープンウェイトモデル「Gemma 4」を4サイズでリリースした。ネイティブの関数呼び出し・構造化JSON出力・マルチモーダル入力（画像・音声・動画）に対応しており、複数ステップのエージェントワークフローを実行できる設計になっている。31Bモデルはオープンモデルのリーダーボードで世界第3位を記録している。
- **記事化候補**: Yes

### [OpenAI GPT-5.4リリース：コンピュータ操作とマルチステップ自律実行が標準搭載](https://fortune.com/2026/03/05/openai-new-model-gpt5-4-enterprise-agentic-anthropic/)
- **情報源**: Fortune
- **公開日**: 2026-03-05
- **要点**: OpenAIがGPT-5.4をリリースし、PCを自律操作して複雑なワークフローを実行する「コンピュータ使用」機能を汎用モデルとして初めて標準搭載した。コンテキストウィンドウは最大100万トークンに対応し、ツール検索機能によって大規模なツールエコシステムから適切なツールを自動選択できる。
- **記事化候補**: Yes

### [AIエージェントワークフローへの分散トレーシング導入（OpenTelemetry活用）](https://developers.redhat.com/articles/2026/04/06/distributed-tracing-agentic-workflows-opentelemetry)
- **情報源**: Red Hat Developer
- **公開日**: 2026-04-06
- **要点**: マルチエージェント構成（ルーティングエージェント・専門エージェント・MCP Server・外部API）のデバッグには分散トレーシングが不可欠だという実践ガイドである。OpenTelemetryを使ったコンテキスト伝播・FastAPIの自動計装・MCPサーバーの手動計装の方法を具体的に解説している。
- **記事化候補**: Yes

### [Claude MythosはAIによる企業ネットワーク侵害を初めてエンドツーエンドで実証](https://the-decoder.com/claude-mythos-can-autonomously-compromise-weakly-defended-enterprise-networks-end-to-end/)
- **情報源**: The Decoder
- **公開日**: 2026-04-14
- **要点**: 英国AIセーフティ研究所がAnthropicのモデルを評価した結果、AIが防御の弱い企業ネットワークに対してエンドツーエンドの攻撃シミュレーションを初めて完遂したことが明らかになった。AIエージェントが持つ自律サイバー攻撃能力を示す初事例として、セキュリティリスク評価の重要性を改めて示す結果となった。
- **記事化候補**: Yes（安全性・リスク観点の記事として）
