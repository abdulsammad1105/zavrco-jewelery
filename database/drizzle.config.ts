import "dotenv/config";
import path from "path";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required (set it in backend/.env)");
}

export default defineConfig({
  dialect: "postgresql",
  schema: path.join(__dirname, "schema.ts").split(path.sep).join("/"),
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
