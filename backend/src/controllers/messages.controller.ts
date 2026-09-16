import type { Request, Response } from "express";
import { db, schema } from "../db";
import { eq, desc } from "drizzle-orm";

export async function create(req: Request, res: Response) {
  const { name, email, phone, message } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Please enter your name" });
  }
  if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email" });
  }
  if (!message || typeof message !== "string" || message.trim().length < 5) {
    return res.status(400).json({ error: "Please write a message" });
  }

  const [created] = await db
    .insert(schema.messages)
    .values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || null,
      message: message.trim(),
    })
    .returning();

  res.status(201).json(created);
}

/** Admin: inbox */
export async function list(_req: Request, res: Response) {
  const result = await db.select().from(schema.messages).orderBy(desc(schema.messages.createdAt));
  res.json(result);
}

export async function updateStatus(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  const [updated] = await db
    .update(schema.messages)
    .set({ status })
    .where(eq(schema.messages.id, id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Message not found" });
  res.json(updated);
}
