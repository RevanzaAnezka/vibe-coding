import { Elysia, t } from "elysia";
import { registerUser, loginUser } from "../services/user-services";

export const userRoutes = new Elysia()
  .post("/api/users", async ({ body, set }) => {
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
  })
  .post("/api/login", async ({ body, set }) => {
    try {
      await loginUser(body.email, body.password);
      set.status = 201;
      return { message: "login successfully" };
    } catch (error: any) {
      set.status = 401;
      return {
        message: "Invalid email or password",
        error: {
          email: "invalid credentials"
        }
      };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    })
  });

