import { Elysia } from "elysia";
import { userRoutes } from "./routes/user-routes";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .use(userRoutes)
  .listen(port);

console.log(`Server is running at http://${app.server?.hostname}:${app.server?.port}`);
