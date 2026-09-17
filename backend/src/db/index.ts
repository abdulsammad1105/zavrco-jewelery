import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../../../database/schema";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend/.env"),
  path.resolve(process.cwd(), "../backend/.env"),
];

const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));

if (envPath) {
  dotenv.config({ path: envPath });
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

// Supabase transaction pooler / PgBouncer
// Prepared statements are disabled for compatibility with port 6543.
const client = postgres(databaseUrl, {
  prepare: false,
  max: 1,
});

export const db = drizzle(client, { schema });

export { schema };
