import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { usersTable } from "./schema";
import { db } from "./db";
import bcrypt, { hash } from "bcrypt";

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

//not working
export async function findUserByMail(email: string) {
  const data = await db
    .selectDistinct()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  const user = data[0];

  return user;
}
