import type { Request, Response } from "express";
import { db, schema } from "../db";
import { eq, desc, and } from "drizzle-orm";
import { logAdminAction } from "../lib/admin-log";

export async function list(req: Request, res: Response) {
  const { productId } = req.query as Record<string, string | undefined>;
  const conditions = [eq(schema.reviews.published, true)];
  if (productId) conditions.push(eq(schema.reviews.productId, parseInt(productId, 10)));

  const result = await db
    .select()
    .from(schema.reviews)
    .where(and(...conditions))
    .orderBy(desc(schema.reviews.createdAt));

  res.json(result);
}

export async function create(req: Request, res: Response) {
  const { name, rating, comment, productId } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Please enter your name" });
  }
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }
  if (!comment || typeof comment !== "string" || comment.trim().length < 5) {
    return res.status(400).json({ error: "Please write a short review" });
  }

  const [review] = await db
    .insert(schema.reviews)
    .values({
      name: name.trim(),
      rating: ratingNum,
      comment: comment.trim(),
      productId: productId ? parseInt(productId, 10) : null,
    })
    .returning();

  res.status(201).json(review);
}

/** Admin: all reviews including unpublished */
export async function listAll(_req: Request, res: Response) {
  const result = await db.select().from(schema.reviews).orderBy(desc(schema.reviews.createdAt));
  res.json(result);
}

export async function setPublished(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);
  const { published } = req.body;

  const [updated] = await db
    .update(schema.reviews)
    .set({ published: !!published })
    .where(eq(schema.reviews.id, id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Review not found" });
  res.json(updated);
  logAdminAction(
    "review.visibility_updated",
    "product",
    updated.id,
    `Review #${updated.id} ${published ? "published" : "hidden"}`,
  );
}

export async function remove(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);
  const [deleted] = await db
    .delete(schema.reviews)
    .where(eq(schema.reviews.id, id))
    .returning({ id: schema.reviews.id });

  if (!deleted) return res.status(404).json({ error: "Review not found" });
  res.json({ ok: true });
}
