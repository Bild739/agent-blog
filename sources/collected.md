# 収集済みソース一覧

このファイルは `/collect` スキルによって自動更新されます。
新しい収集分は先頭に追記されます。

---

<!-- 収集データはここから下に追記されます -->

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
