# Instagram Viewer

Render上でInstagram（https://www.instagram.com/?hl=ja）を表示するWebアプリケーションです。

## 仕組み

Node.jsサーバーがInstagramへのリバースプロキシとして動作し、`X-Frame-Options`や`Content-Security-Policy`などの埋め込み制限ヘッダーを除去することで、iframe内での表示を可能にします。

```
[ブラウザ] → [Renderサーバー (server.js)] → [www.instagram.com]
                ↓
         セキュリティヘッダー除去
         frame-buster スクリプト除去
```

## ローカル開発

```bash
# 依存関係のインストール
npm install

# フロントエンドのビルド
npm run build

# サーバーの起動
node server.js
# → http://localhost:3000 でアクセス可能
```

## Renderへのデプロイ

### 方法1: Blueprint（推奨）

1. このリポジトリをGitHubにプッシュ
2. [Render Dashboard](https://dashboard.render.com/)にログイン
3. 「New」→「Blueprint」をクリック
4. GitHubリポジトリを選択
5. `render.yaml`が自動検出されます
6. 「Create Resources」をクリック

### 方法2: 手動デプロイ

1. [Render Dashboard](https://dashboard.render.com/)にログイン
2. 「New」→「Web Service」をクリック
3. GitHubリポジトリを接続
4. 以下の設定を入力:
   - **Name**: `instagram-viewer`（任意）
   - **Runtime**: `Node`
   - **Build Command**: `rm -rf node_modules package-lock.json && npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Plan**: Free
5. 環境変数を追加:
   - `NODE_VERSION`: `20.11.0`
6. 「Create Web Service」をクリック

### トラブルシューティング

**ビルドエラー: Cannot find native binding**

Tailwind CSS v4はネイティブバインディング（@tailwindcss/oxide）を使用します。Node.js 18.xでは互換性がないため、必ずNode.js 20.x以上を使用してください。

解決策:
- `render.yaml`で`NODE_VERSION: 20.11.0`を指定済み
- ビルドコマンドで`rm -rf node_modules package-lock.json`を実行してクリーンインストール

## 構成

```
.
├── server.js          # Node.jsプロキシサーバー
├── src/
│   ├── App.tsx        # フロントエンド（iframe表示UI）
│   ├── main.tsx       # エントリーポイント
│   └── index.css      # スタイル
├── dist/              # ビルド出力（Vite）
├── render.yaml        # Render Blueprint設定
├── package.json
└── vite.config.js
```

## 技術スタック

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js (http/https標準モジュールのみ)
- **Deployment**: Render (Web Service)

## 機能

- プロキシモード: サーバー経由でInstagramを表示
- ダイレクトモード: 直接iframeで表示を試行
- 全画面表示切り替え
- 再読み込み機能
- 新規タブで開くリンク

## 注意事項

- Instagramは公式にiframe埋め込みを許可していません
- プロキシ経由でも、ログインや一部の機能が正常に動作しない場合があります
- Instagramの利用規約に従って使用してください
- 過度なリクエストは避けてください
