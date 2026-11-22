//Conecction with data base and the CRUD

import { drizzle } from 'drizzle-orm/bun-sql';

export const db = drizzle(process.env.DATABASE_URL!);
