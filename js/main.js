// エントリーポイント
window.addEventListener('load', () => {
    // 依存関係が読み込まれているかチェック（簡易ホワイトボックステスト）
    if (!window.SnakeGameConfig || !window.Snake || !window.Food || !window.Game) {
        console.error("Critical error: Some game scripts failed to load in order.");
        alert("一部のスクリプトが読み込めませんでした。ブラウザのコンソールを確認してください。");
        return;
    }

    const canvas = document.getElementById('gameCanvas');
    const scoreElement = document.getElementById('score');
    
    // オブジェクトのインスタンス化
    window.game = new window.Game(canvas, scoreElement, window.SnakeGameConfig);
    
    // 入力イベントのリスニング
    document.addEventListener('keydown', (e) => {
        window.game.handleInput(e.key);
    });

    // ゲーム開始
    window.game.loop();
    console.log("Game started successfully.");
});
