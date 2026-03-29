// フロントエンドのAPI通信を専門に担当する 他から使用できるようにexportが記載されている。
export const ApiService = {
    /**
     * DBからハイスコアを取得する
     * @returns {Promise<number>} DBからハイスコアを取得
     */
    async getHighScore() {
        const response = await fetch('/api/get-high-score');
        const result = await response.json();
        if (!result.success) {                                                              //もし答えが「成功」でなかったら
            throw new Error(result.error || 'Failed to fetch high score');                  //エラーを出す
        }
        // 最初のデータのスコアを返す（存在しない場合は0）
        return result.data && result.data.length > 0 ? result.data[0].score : 0;
    },

    /**
     * スコアをDBに保存する
     * @param {number} score 保存するスコア
     * @returns {Promise<Object>} APIのレスポンス結果
     */
    async saveScore(score) {
        const response = await fetch('/api/save-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ score })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'Failed to save score');
        }
        return result;
    }
};
