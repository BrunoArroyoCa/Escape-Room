import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { db } from "../../src/";
import * as schema from "../db/auth-schema.ts";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
		provider: 'pg', 
		schema, 
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "player", 
        input: false
      },
    },
  },

  advanced: {
    database: {
      generateId: "uuid", 
    },
  },

  trustedOrigins: ["http://localhost:5173"], // URL del front
});
