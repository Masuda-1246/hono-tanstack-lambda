// src/interface/middleware/basicauth.ts
import type { MiddlewareHandler } from "hono";
import { basicAuth } from "hono/basic-auth";

/**
 * Basic認証ミドルウェアを生成する
 * @param options Basic認証の設定オプション
 * @returns Basic認証ミドルウェア
 */
export const createBasicAuthMiddleware = (
  options = {
    username: "admin",
    password: "password",
  },
): MiddlewareHandler => {
  return basicAuth(options);
};
