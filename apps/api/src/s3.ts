import { Hono } from "hono/quick";
import { DuckDBInstance } from "@duckdb/node-api";

// グローバルなDuckDBインスタンス管理
let globalDuckDB: {
  instance: DuckDBInstance;
  connection: any;
  initialized: boolean;
} | null = null;

async function getDuckDBConnection() {
  if (!globalDuckDB || !globalDuckDB.initialized) {
    try {
      const instance = await DuckDBInstance.create();
      const connection = await instance.connect();
      // 初期設定を一括実行（一度だけ）
      await connection.run(`
        SET home_directory='${process.env.HOME || process.env.USERPROFILE || '/tmp'}';
        INSTALL httpfs;
        LOAD httpfs;
      `);
      globalDuckDB = {
        instance,
        connection,
        initialized: true
      };
    } catch (error) {
      console.error("DuckDB初期化エラー:", error);
      throw error;
    }
  }
  return globalDuckDB.connection;
}

const s3App = new Hono()

  .get("/", (c) => {
    console.log("S3 API ルートエンドポイントがアクセスされました");
    return c.json({ message: "S3 CSV API with DuckDB httpfs is running" });
  })

  .get("/sample", async (c) => {
    const bucketName = process.env.S3_BUCKET_NAME;

    if (!bucketName) {
      return c.json({ error: "S3バケット名が設定されていません" }, 500);
    }

    try {
      // 初期化済みの接続を取得（初回のみ初期化）
      const con = await getDuckDBConnection();
      const s3Path = `s3://${bucketName}/sample.csv`;

      // データ取得クエリを実行
      const result = await con.run(`SELECT s.name, s.email, s.department FROM '${s3Path}' s LIMIT 2 OFFSET 3;`);

      // 直接JSONオブジェクトとして構築（メモリ効率重視）
      const headers = result.columnNames();
      const rawRows = await result.getRows();

      // 1回のループで最終形式に変換
      const data = rawRows.map((row: any) => {
        const jsonRow: Record<string, any> = {};
        headers.forEach((header: string, index: number) => {
          const value = row[index];
          // BigInt のみ文字列に変換、その他はそのまま
          jsonRow[header] = typeof value === 'bigint' ? value.toString() : value;
        });
        return jsonRow;
      });

      return c.json({
        s3Path,
        data,
        count: data.length,
      });

    } catch (error) {
      return c.json({
        error: "CSVファイルの読み取りに失敗しました",
        details: error instanceof Error ? error.message : "不明なエラー"
      }, 500);
    }
  });

export { s3App };
