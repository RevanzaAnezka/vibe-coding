import bcrypt from "bcrypt";
import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import type { NewUser } from "../db/schema";

export async function checkEmailExists(email: string): Promise<boolean> {
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return existing.length > 0;
}

export async function registerUser(data: Omit<NewUser, "id" | "createdAt">) {
  const emailExists = await checkEmailExists(data.email);
  if (emailExists) {
    throw new Error("email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  await db.insert(users).values({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });
}

export async function loginUser(email: string, password: string) {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (result.length === 0) {
    throw new Error("invalid credentials");
  }

  const user = result[0];
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("invalid credentials");
  }

  const token = crypto.randomUUID();
  await db.insert(sessions).values({
    token,
    userId: user.id,
  });

  return { token };
}

