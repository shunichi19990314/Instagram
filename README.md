# Instagram oEmbed API Viewer

Instagramの公式oEmbed APIを使用して、投稿をサイト内に表示するWebアプリケーションです。

## 機能

- Instagram投稿URLからoEmbed APIで埋め込みHTMLを取得
- 埋め込みオプション（maxwidth、hidecaption、omitscript）のカスタマイズ
- 取得結果の保存・管理（LocalStorage）
- APIレスポンスのJSON確認
- Instagram embed.jsによるリアルタイムレンダリング

## API仕様

- **エンドポイント**: `https://graph.facebook.com/v26.0/instagram_oembed`
- **認証**: トークン不要（2026年6月15日以降）
- **レート制限**: 1時間あたり1,000リクエスト
- **対応形式**: /p/（投稿）、/reel/（リール）、/tv/（IGTV）

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## Renderへのデプロイ

### 方法1: Blueprintを使用（推奨）

1. このリポジトリをGitHubにプッシュ
2. [Render Dashboard](https://dashboard.render.com/)にログイン
3. 「New」→「Blueprint」をクリック
4. GitHubリポジトリを選択
5. `render.yaml`が自動検出され、設定が適用されます
6. 「Create Resources」をクリック

### 方法2: 手動デプロイ

1. [Render Dashboard](https://dashboard.render.com/)にログイン
2. 「New」→「Static Site」をクリック
3. GitHubリポジトリを接続
4. 以下の設定を入力:
   - **Name**: `instagram-viewer`（任意）
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. 「Create Static Site」をクリック

### 環境変数（オプション）

Renderの環境変数セクションで以下を設定できます:

- `NODE_VERSION`: `18.18.0`（Node.jsバージョン）

## 技術スタック

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **API**: Instagram oEmbed API (Graph API v26.0)
- **Deployment**: Render (Static Site)

## CORS対応

Instagram Graph APIはCORSをブロックするため、以下のプロキシサーバーを経由してアクセスします:

1. `https://api.allorigins.win/raw?url=`
2. `https://corsproxy.io/?`
3. `https://api.codetabs.com/v1/proxy?quest=`

本番環境では、独自のCORSプロキシサーバーを立てることを推奨します。

## ライセンス

MIT

## 注意事項

- InstagramはMeta Platforms, Inc.の商標です
- このアプリはInstagramの公式oEmbed APIを使用しています
- 非公開投稿は埋め込みできません
- APIのレート制限（1時間あたり1,000リクエスト）に注意してください
