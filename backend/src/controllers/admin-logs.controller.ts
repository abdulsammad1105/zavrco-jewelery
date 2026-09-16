import type { Request, Response } from "express";
import { db, schema } from "../db";
import { desc } from "drizzle-orm";

export async function list(_req: Request, res: Response) {
  const result = await db
    .select()
    .from(schema.adminLogs)
    .orderBy(desc(schema.adminLogs.createdAt))
    .limit(200);

  res.json(result);
}
