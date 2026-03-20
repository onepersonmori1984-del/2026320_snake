// 設定値をグローバルに定義
window.SnakeGameConfig = {
    GRID_SIZE: 20,
    TILE_COUNT: 20,
    INITIAL_SNAKE: [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ],
    SPEED: 100,
    COLORS: {
        BACKGROUND: '#000000',
        SNAKE_HEAD: '#2ecc71',
        SNAKE_BODY: '#27ae60',
        FOOD: '#e74c3c',
        OVERLAY: 'rgba(0, 0, 0, 0.7)'
    }
};
console.log("Config loaded.");
