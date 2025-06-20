import { join } from "node:path";
import { serveStatic } from "@hono/node-server/serve-static";
import type { MiddlewareHandler } from "hono";

/**
 * 静的ファイル配信のミドルウェア
 * @param distPath 静的ファイルのルートディレクトリ
 */
export const staticMiddleware = (
  distPath = "./public",
): { assets: MiddlewareHandler; fallback: MiddlewareHandler } => {
  // 静的ファイル配信用ミドルウェア
  const assets: MiddlewareHandler = serveStatic({ root: distPath });

  // SPA用フォールバックミドルウェア
  const fallback: MiddlewareHandler = serveStatic({ path: join(distPath, "index.html") });

  return { assets, fallback };
};
