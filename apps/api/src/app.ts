import { Hono } from 'hono/quick';
import { createBasicAuthMiddleware } from "./middleware/basicAuth";
import { staticMiddleware } from "./middleware/static";
import { todoApp } from "./todo";
import { s3App } from "./s3";

const app = new Hono();

// Basic認証の適用
const basicAuthMiddleware = createBasicAuthMiddleware();
app.use("*", basicAuthMiddleware);

// APIのルーティング
const api = new Hono().basePath("/api").route("/todo", todoApp).route("/s3", s3App);

// APIのルーティングを適用
app.route("", api);

// フロントの配信
const { assets, fallback } = staticMiddleware("./public");
app.use("/assets/*", assets);
app.use("/*", fallback);

// APIの型を定義
type AppType = typeof api;

export { app, type AppType };
