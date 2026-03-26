import 'dotenv/config'; // .envファイルを読み込む
import { Client } from 'pg'; // PostgreSQLに接続するためのライブラリ

//envにある情報のDBに接続する。
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

//DB接続テストする関数。
//非同期処理 = 待機する処理
async function testDB() {
  try {
    await client.connect(); //DBに接続する
    console.log('✅ 接続成功');

    const result = await client.query('SELECT * FROM scores');  //DBからデータを取得する
    console.log('📊 データ:', result.rows);

    await client.end(); //DBから切断する
  } catch (error) {
    console.error('❌ エラー:', error.message);
  }
}

//DB接続テストを実行する
testDB();