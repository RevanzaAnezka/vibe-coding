import { Elysia, t } from "elysia";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .group("/users", (app) =>
    app
      .get("/", async () => {
        try {
          return await db.select().from(users);
        } catch (error: any) {
          return { error: error.message };
        }
      })
      .get("/:id", async ({ params: { id }, error }) => {
        try {
          const result = await db.select().from(users).where(eq(users.id, Number(id)));
          if (result.length === 0) {
            return error(404, { message: "User not found" });
          }
          return result[0];
        } catch (err: any) {
          return error(500, { error: err.message });
        }
      })
      .post("/", async ({ body, error }) => {
        try {
          await db.insert(users).values(body);
          return { success: true };
        } catch (err: any) {
          return error(500, { error: err.message });
        }
      }, {
        body: t.Object({
          name: t.String(),
          email: t.String(),
        })
      })
      .delete("/:id", async ({ params: { id }, error }) => {
        try {
          await db.delete(users).where(eq(users.id, Number(id)));
          return { success: true };
        } catch (err: any) {
          return error(500, { error: err.message });
        }
      })
  )
  .listen(port);

console.log(`Server is running at http://${app.server?.hostname}:${app.server?.port}`);
