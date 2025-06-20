import { Hono } from "hono";
import { createBasicAuthMiddleware } from "./middleware/basicAuth";
import { staticMiddleware } from "./middleware/static";
import { todoApp } from "./todo";

const app = new Hono();

// Basic認証の適用
const basicAuthMiddleware = createBasicAuthMiddleware();
app.use("*", basicAuthMiddleware);

// APIのルーティング
const api = new Hono().route("/todo", todoApp).get("/users", (c) => {
  return c.json([{ name: "John Doe" }, { name: "Jane Hoge" }]);
});

// APIのルーティングを適用
app.route("/api", api);

// フロントの配信
const { assets, fallback } = staticMiddleware("./public");
app.use("/assets/*", assets);
app.use("/*", fallback);

// APIの型を定義
type AppType = typeof api;

export { app, type AppType };
