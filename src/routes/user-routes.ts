import { Elysia, t } from "elysia";
import { registerUser } from "../services/user-services";

export const userRoutes = new Elysia({ prefix: "/api/users" })
  .post("/", async ({ body, set }) => {
    try {
      await registerUser(body);
      set.status = 201;
      return { message: "User created successfully" };
    } catch (error: any) {
      set.status = 400;
      if (error.message === "email already exists") {
        return {
          message: "Failed to create user",
          error: {
            email: "email already exists"
          }
        };
      }
      return {
        message: "Failed to create user",
        error: {
          general: error.message
        }
      };
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String()
    })
  });
