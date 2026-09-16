import type { Request, Response } from "express";
import { db, schema } from "../db";
import { eq, and } from "drizzle-orm";

export async function list(req: Request, res: Response) {
  const userId = req.user!.id;

  const rows = await db
    .select({
      id: schema.wishlist.id,
      productId: schema.wishlist.productId,
      product: schema.products,
    })
    .from(schema.wishlist)
    .leftJoin(schema.products, eq(schema.wishlist.productId, schema.products.id))
    .where(eq(schema.wishlist.userId, userId));

  const items = rows.filter((r) => r.product !== null);
  res.json({ items });
}

export async function add(req: Request, res: Response) {
  const userId = req.user!.id;
  const productId = Number(req.body?.productId);

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ error: "productId is required" });
  }

  const [product] = await db
    .select({ id: schema.products.id })
    .from(schema.products)
    .where(eq(schema.products.id, productId))
    .limit(1);

  if (!product) return res.status(404).json({ error: "Product not found" });

  const [existing] = await db
    .select({ id: schema.wishlist.id })
    .from(schema.wishlist)
    .where(and(eq(schema.wishlist.userId, userId), eq(schema.wishlist.productId, productId)))
    .limit(1);

  if (existing) return res.json({ ok: true, alreadyExists: true });

  await db.insert(schema.wishlist).values({ userId, productId });
  return res.status(201).json({ ok: true });
}

export async function remove(req: Request, res: Response) {
  const userId = req.user!.id;
  const productId = parseInt(req.params.productId, 10);

  if (Number.isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product id" });
  }

  await db
    .delete(schema.wishlist)
    .where(and(eq(schema.wishlist.userId, userId), eq(schema.wishlist.productId, productId)));

  res.json({ ok: true });
}
