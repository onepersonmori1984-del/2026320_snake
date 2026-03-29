import { Client } from 'pg';

// APIの本体（エントリーポイント）
// req = リクエスト（フロントから来たデータ）「スコア100を保存して！」というお願い
// res = レスポンス（フロントに返すデータ）　お願いに答えたもの。
export default async function handler(req, res) {
  // POSTメソッド以外は受け付けない
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed',
    });
  }

  // リクエストボディからスコアを取得
  const { score } = req.body;

  // スコアが数値であることを確認
  if (typeof score !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Score is required and must be a number',
    });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // ID=1のデータを挿入。もし既に存在（衝突）していれば、スコアを更新する（UPSERT）
    await client.query(`
      INSERT INTO scores (id, score) 
      VALUES (1, $1) 
      ON CONFLICT (id) 
      DO UPDATE SET score = $1, created_at = NOW()
    `, [score]);

    await client.end();

    res.status(200).json({
      success: true,
      message: 'Score saved successfully',
      score: score
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
