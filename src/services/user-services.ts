import bcrypt from "bcrypt";
import { db } from "../db";
import { users } from "../db/schema";
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
