const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const {Pool} = require("pg"); // CORSミドルウェアをインポート

// CORSを有効にする (全てのオリジンからのアクセスを許可する例。本番環境では制限を検討してください)
app.use(cors());

// JSONボディを解析するためのミドルウェア
app.use(express.json());

// PostgreSQL接続設定
const pool = new Pool({
    user: 'motoki',      // あなたのPostgreSQLユーザー名
    host: 'localhost',          // PostgreSQLホスト
    database: 'my-portfolio',    // 作成したデータベース名
    password: '0626',  // あなたのPostgreSQLパスワード
    port: 5432,                 // PostgreSQLポート (デフォルトは5432)
});

// データベース接続テスト
pool.connect((err, client, done) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Successfully connected to the database.');
    done(); // クライアントをプールに戻す
});

// 全てのアイテムを取得するAPIエンドポイント
app.get('/api/items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM t_test ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// ビルドされたVueのファイルを静的配信
app.use(express.static(path.join(__dirname, '../client/dist')));

// Vue Router (historyモード) 対応: その他のリクエストはindex.htmlを返す
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
