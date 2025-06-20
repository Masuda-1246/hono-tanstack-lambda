import { type Context, Hono } from "hono";
import { z } from "zod";

// Todoスキーマの定義
const TodoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "タイトルは必須です" }),
  completed: z.boolean().default(false),
});

// 新規作成用のスキーマ（idは自動生成するため不要）
const CreateTodoSchema = z.object({
  title: z.string().min(1, { message: "タイトルは必須です" }),
  completed: z.boolean().default(false),
});

// 更新用のスキーマ
const UpdateTodoSchema = z.object({
  title: z.string().min(1, { message: "タイトルは必須です" }).optional(),
  completed: z.boolean().optional(),
});

type Todo = z.infer<typeof TodoSchema>;

let todos: Todo[] = [];

// JSON 入力型としてスキーマを指定
type UpdateJsonIn = z.input<typeof UpdateTodoSchema>;

// Context に型パラメータをセット
type UpdateContext = Context<
  Record<string, never>,
  "/:id",
  {
    in: { json: UpdateJsonIn };
  }
>;

const todoApp = new Hono()

  .get("/", (c) => {
    return c.json(todos);
  })

  .post("/", async (c) => {
    try {
      const body = await c.req.json();
      const validatedData = CreateTodoSchema.parse(body);

      // 新しいIDを生成（実際のアプリではUUIDなどを使用するとよい）
      const newId = String(Date.now());

      const todo: Todo = {
        id: newId,
        ...validatedData,
      };

      todos.push(todo);
      return c.json(todo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ error: error.errors }, 400);
      }
      return c.json({ error: "不明なエラーが発生しました" }, 500);
    }
  })

  .put("/:id", async (c: UpdateContext) => {
    try {
      const body = await c.req.json();
      const { id } = c.req.param();

      const todo = todos.find((todo) => todo.id === id);
      if (!todo) {
        return c.json({ error: "Todo not found" }, 404);
      }
      const validatedData = UpdateTodoSchema.parse(body);
      // 更新するフィールドを適用
      Object.assign(todo, validatedData);

      return c.json(todo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ error: error.errors }, 400);
      }
      return c.json({ error: "不明なエラーが発生しました" }, 500);
    }
  })

  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    todos = todos.filter((todo) => todo.id !== id);
    return c.json({ message: "Todo deleted" });
  });

export { todoApp };
