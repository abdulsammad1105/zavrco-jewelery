import type { Request, Response } from "express";
import { db, schema } from "../db";

export async function list(_req: Request, res: Response) {
  const result = await db.select().from(schema.collections);
  res.json(result);
}
