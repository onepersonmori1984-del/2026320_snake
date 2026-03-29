# プロジェクト概要

本プロジェクトは、ブラウザ上で動作するシンプルなスネークゲーム（Snake
Game）です。 フロントエンドはVanilla
JavaScriptで構築されており、バックエンドはVercelのServerless
Functions（API）を使用しています。
データベースにはPostgreSQL（Neon）を利用しています。

------------------------------------------------------------------------

# 技術スタック

-   Frontend: HTML / CSS / Vanilla JS
-   Backend: Vercel Serverless Functions (/api)
-   DB: PostgreSQL (Neon)
-   ライブラリ:
    -   pg
    -   dotenv（ローカルのみ）
-   テスト:
    -   Playwright（導入済み）

------------------------------------------------------------------------

# ディレクトリ構成

PS C:\Users\xdays\OneDrive\Desktop\Study_Antigravity\test\src> tree /f
フォルダー パスの一覧:  ボリューム Windows-SSD
ボリューム シリアル番号は 746E-0C0A です
C:.
│  index.html
│
├─css
│      style.css
│
├─js
│  │  config.js
│  │  main.js
│  │  renderer.js
│  │
│  ├─core
│  │      game.js
│  │      gameLogic.js
│  │      gameState.js
│  │      inputHandler.js
│  │
│  └─entities
│          food.js
│          snake.js
│
└─tests
    │  test_specification.md
    │
    ├─e2e
    │      game.spec.js
    │
    ├─evidence
    │      snake_game_pass.png
    │      tc01_initial.png
    │      tc02_moving.png
    │      tc03_gameover.png
    │      tc04_restart.png
    │
    └─unit
            food.spec.js
            gameLogic.spec.js
            snake.spec.js

------------------------------------------------------------------------

# 現在の実装状況

## 完了済み

-   スネークゲーム基本機能
-   DB接続成功（Neon）
-   API (/api/test-db) 動作確認済み
-   Vercelデプロイ成功

------------------------------------------------------------------------

# 現在の課題

1.  スコア保存API未実装
2.  フロントとAPI未連携
3.  ハイスコア管理未実装

------------------------------------------------------------------------

# 今後の実装方針

つまり　現状
https://2026320-snake.vercel.app/api/test-db　で、

{"success":true,"data":[{"id":1,"score":20,"created_at":"2026-03-26T15:01:48.368Z"}]}

が出力されるので最高スコアが更新されたら、その値を"score":20,　で更新してほしい。

## Step1

-   /api/save-score 作成（POST）
-   スコアをDBに保存



## Step2

-   ゲーム開始時にハイスコア取得
-   ゲーム終了時にスコア送信

## Step3

-   UIにスコア表示

<!-- ## Step4（将来）

-   ログイン機能
-   ユーザーごとのスコア管理 -->

------------------------------------------------------------------------

# DB設計

scores テーブル

-   id
-   score
-   created_at

<!-- ------------------------------------------------------------------------

# 現在のゴール

ログインなしで以下を実現：

-   ハイスコア取得
-   スコア更新
-   DB保存 -->

ッシュする前に、ローカル環境（自分のパソコン内）でクラウド上のDBに接続し、APIが正しく動くかテストする方法があります。

  以下の手順で確認することをお勧めします。

  ---

  1. vercel dev を使ったローカルテスト
  Vercelには、ローカル環境で本番（Vercel）と全く同じ挙動（APIの動作など）を再現するツールがあります。これを使えば、Pushする前に自分のパソコンでAPIを動かしてテ 
  ストできます。

  実行方法:
  ターミナル（PowerShellなど）で以下のコマンドを打ってみてください。
   1 npx vercel dev
  ※初回実行時はVercelへのログインやプロジェクトの連携を聞かれる場合があります。

  これが起動すると、http://localhost:3000 などでゲームが立ち上がります。この状態であれば、ローカルで動かしていても /api/save-score が正しく動作します。
npm i -g vercel
 1. ログイン（初回のみ）
   1     vercel login
   2. プロジェクトの連携
   1     vercel link
   3. 環境変数の取り込み（DB接続用）

   1     vercel env pull .env.local
   4. ローカルサーバー起動
   1     npx vercel dev