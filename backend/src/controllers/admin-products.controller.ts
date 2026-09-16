import type { Request, Response } from "express";
import { db, schema } from "../db";
import { eq, ilike, and, desc } from "drizzle-orm";
import { logAdminAction } from "../lib/admin-log";

export async function list(req: Request, res: Response) {
  const { search, category } = req.query as Record<string, string | undefined>;

  const conditions = [];
  if (search) conditions.push(ilike(schema.products.name, `%${search}%`));
  if (category) {
    const [cat] = await db
      .select({ id: schema.categories.id })
      .from(schema.categories)
      .where(eq(schema.categories.slug, category))
      .limit(1);
    if (cat) conditions.push(eq(schema.products.categoryId, cat.id));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const result = await db
    .select()
    .from(schema.products)
    .where(where)
    .orderBy(desc(schema.products.createdAt));

  res.json(result);
}

export async function create(req: Request, res: Response) {
  try {
    const body = req.body;
    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const [product] = await db
      .insert(schema.products)
      .values({
        name: body.name,
        slug,
        description: body.description || null,
        price: String(body.price),
        images: body.images || [],
        categoryId: body.categoryId ? parseInt(body.categoryId) : null,
        collectionId: body.collectionId ? parseInt(body.collectionId) : null,
        stock: parseInt(body.stock) || 0,
        featured: body.featured || false,
        isNew: body.isNew || false,
        published: body.published !== undefined ? body.published : true,
        material: body.material || null,
        dimensions: body.dimensions || null,
        care: body.care || null,
      })
      .returning();

    res.status(201).json(product);
    logAdminAction("product.created", "product", product.id, `Created product "${product.name}"`);
  } catch (err) {
    console.error("Product creation error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
}

export async function update(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);
  try {
    const body = req.body;
    const values: Record<string, unknown> = {};
    if (body.name !== undefined) values.name = body.name;
    if (body.slug !== undefined) values.slug = body.slug;
    if (body.description !== undefined) values.description = body.description;
    if (body.price !== undefined) values.price = String(body.price);
    if (body.images !== undefined) values.images = body.images;
    if (body.categoryId !== undefined)
      values.categoryId = body.categoryId ? parseInt(body.categoryId) : null;
    if (body.collectionId !== undefined)
      values.collectionId = body.collectionId ? parseInt(body.collectionId) : null;
    if (body.stock !== undefined) values.stock = parseInt(body.stock);
    if (body.featured !== undefined) values.featured = body.featured;
    if (body.isNew !== undefined) values.isNew = body.isNew;
    if (body.published !== undefined) values.published = body.published;
    if (body.material !== undefined) values.material = body.material;
    if (body.dimensions !== undefined) values.dimensions = body.dimensions;
    if (body.care !== undefined) values.care = body.care;

    const [updated] = await db
      .update(schema.products)
      .set(values)
      .where(eq(schema.products.id, id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);

    const changedFields = Object.keys(values).join(", ");
    logAdminAction(
      "product.updated",
      "product",
      updated.id,
      `Updated product "${updated.name}" (${changedFields})`,
    );
  } catch (err) {
    console.error("Product update error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
}

export async function remove(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);
  const [deleted] = await db
    .delete(schema.products)
    .where(eq(schema.products.id, id))
    .returning({ id: schema.products.id, name: schema.products.name });

  if (!deleted) return res.status(404).json({ error: "Product not found" });
  res.json({ ok: true });
  logAdminAction("product.deleted", "product", deleted.id, `Deleted product "${deleted.name}"`);
}
