import type { Request, Response } from "express";
import { db, schema } from "../db";
import { eq, ilike, desc, asc, and, ne, sql } from "drizzle-orm";

export async function list(req: Request, res: Response) {
  const { category, search, sort, featured, new: isNewParam, limit } = req.query as Record<
    string,
    string | undefined
  >;

  const conditions = [eq(schema.products.published, true)];

  if (category) {
    const [cat] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.slug, category))
      .limit(1);
    if (cat) conditions.push(eq(schema.products.categoryId, cat.id));
  }

  if (search) conditions.push(ilike(schema.products.name, `%${search}%`));
  if (featured === "true") conditions.push(eq(schema.products.featured, true));
  if (isNewParam === "true") conditions.push(eq(schema.products.isNew, true));

  let orderBy;
  switch (sort) {
    case "price-asc":
      orderBy = asc(sql`CAST(${schema.products.price} AS NUMERIC)`);
      break;
    case "price-desc":
      orderBy = desc(sql`CAST(${schema.products.price} AS NUMERIC)`);
      break;
    case "newest":
      orderBy = desc(schema.products.createdAt);
      break;
    default:
      orderBy = desc(schema.products.featured);
  }

  const result = await db
    .select()
    .from(schema.products)
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(parseInt(limit || "50"));

  res.json(result);
}

export async function detail(req: Request, res: Response) {
  const { slug } = req.params;

  const [product] = await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.slug, slug))
    .limit(1);

  if (!product || !product.published) {
    return res.status(404).json({ error: "Not found" });
  }

  let categoryName: string | null = null;
  if (product.categoryId) {
    const [cat] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, product.categoryId))
      .limit(1);
    categoryName = cat?.name || null;
  }

  const related = product.categoryId
    ? await db
        .select()
        .from(schema.products)
        .where(
          and(
            eq(schema.products.categoryId, product.categoryId),
            ne(schema.products.id, product.id),
            eq(schema.products.published, true),
          ),
        )
        .limit(4)
    : [];

  res.json({ product, categoryName, related });
}
