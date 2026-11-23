import { drizzle } from "drizzle-orm/bun-sql";
import { relations } from "./db/relations.ts";
import { authRelations } from "./db/auth-schema.ts";

export const db = drizzle(process.env.DATABASE_URL!, {
  relations: { ...relations, ...authRelations },
});
