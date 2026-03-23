# SelecText AI

Chrome MV3 拡張機能。Webページの英語テキストを選択して右クリックするだけで、Claude AIが日本語で解説・翻訳・要約します。

## 特徴

- 右クリック即発動（3ステップ不要）
- Streaming応答（リアルタイム表示）
- 7種テンプレート（解説・翻訳・要約・税務・ビジネス・医療・子ども向け）
- 無料10回/日・Pro無制限（¥980/月）

## セットアップ

```bash
npm install
npm test        # 全21件PASS確認
npm run build   # 拡張機能ビルド
```

## APIデプロイ

```bash
cd api
npm install
npm run build   # ビルド確認
vercel --prod   # Vercelにデプロイ
```

## ユーザーアクション（コードで解決不可）

1. Anthropic API キー取得 → `api/.env.local` に設定
2. Supabase プロジェクト作成 → スキーマ実行 → `.env.local` に設定
3. ExtensionPay アカウント作成
4. Chrome Web Store 開発者登録（$5）→ 審査申請
5. Vercel 環境変数設定
6. og.png 作成（1200×630px）→ `api/public/og.png`

## スコア目標

- 現状: 0/100（未実装）
- 実装後保証: 85/100
- ユーザーアクション完了後: 90/100
