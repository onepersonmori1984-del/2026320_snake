import { Client } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // ID=1のハイスコアのみ取得する
    // 型を指定することで、結果がどのような構造か安全に扱えます
    const result = await client.query('SELECT * FROM scores WHERE id = 1');

    await client.end();

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
