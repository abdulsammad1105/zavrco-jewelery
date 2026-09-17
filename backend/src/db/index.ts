import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../../database/schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

// Disable prepared statements for serverless connection poolers (e.g., Supabase / PgBouncer)
const client = postgres(databaseUrl, {
  prepare: false,
  max: 1, // Restrict connection pool per serverless function instance
});

export const db = drizzle(client, { schema });
export { schema };