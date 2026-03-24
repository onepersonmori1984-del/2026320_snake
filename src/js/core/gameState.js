// ゲームの状態を管理する。
// 流れからみるとわかるね。　カウントダウンからスタートする。　ゲームオーバーのメソッドもある。

export const GAME_STATE = {
    COUNTDOWN: 'COUNTDOWN',
    PLAYING: 'PLAYING',
    GAMEOVER: 'GAMEOVER'
};

export class GameState {
    constructor() {
        this.state = GAME_STATE.COUNTDOWN;
        this.countdownValue = 3;
    }

    startCountdown() {
        this.state = GAME_STATE.COUNTDOWN;
        this.countdownValue = 3;

        const interval = setInterval(() => {
            this.countdownValue--;
            if (this.countdownValue < 0) {
                clearInterval(interval);
                this.state = GAME_STATE.PLAYING;
            }
        }, 1000);
    }

    setGameOver() {
        this.state = GAME_STATE.GAMEOVER;
    }
}