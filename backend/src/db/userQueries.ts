import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { usersTable } from "./schema";
import { db } from "./db";
import bcrypt from "bcrypt";

async function main() {
  console.log("New user created");

  const users = await db.select().from(usersTable);
  console.log("Getting all users", users);
}

export async function addUser(name: string, email: string, password: string) {
  const hashedpassword = await bcrypt.hash(password, 10);

  const user: typeof usersTable.$inferInsert = {
    fullName: name,
    email: email,
    password: hashedpassword,
  };

  await db.insert(usersTable).values(user);
}

export async function getUsers() {
  return await db.select().from(usersTable);
}

export async function findUsers(name: string, password: string) {
  return await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.fullName, name));
}
