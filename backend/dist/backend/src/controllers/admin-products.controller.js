"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.create = create;
exports.update = update;
exports.remove = remove;
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const admin_log_1 = require("../lib/admin-log");
async function list(req, res) {
    const { search, category } = req.query;
    const conditions = [];
    if (search)
        conditions.push((0, drizzle_orm_1.ilike)(db_1.schema.products.name, `%${search}%`));
    if (category) {
        const [cat] = await db_1.db
            .select({ id: db_1.schema.categories.id })
            .from(db_1.schema.categories)
            .where((0, drizzle_orm_1.eq)(db_1.schema.categories.slug, category))
            .limit(1);
        if (cat)
            conditions.push((0, drizzle_orm_1.eq)(db_1.schema.products.categoryId, cat.id));
    }
    const where = conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined;
    const result = await db_1.db
        .select()
        .from(db_1.schema.products)
        .where(where)
        .orderBy((0, drizzle_orm_1.desc)(db_1.schema.products.createdAt));
    res.json(result);
}
async function create(req, res) {
    try {
        const body = req.body;
        const slug = body.slug ||
            body.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        const [product] = await db_1.db
            .insert(db_1.schema.products)
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
        (0, admin_log_1.logAdminAction)("product.created", "product", product.id, `Created product "${product.name}"`);
    }
    catch (err) {
        console.error("Product creation error:", err);
        res.status(500).json({ error: "Failed to create product" });
    }
}
async function update(req, res) {
    const id = parseInt(req.params.id, 10);
    try {
        const body = req.body;
        const values = {};
        if (body.name !== undefined)
            values.name = body.name;
        if (body.slug !== undefined)
            values.slug = body.slug;
        if (body.description !== undefined)
            values.description = body.description;
        if (body.price !== undefined)
            values.price = String(body.price);
        if (body.images !== undefined)
            values.images = body.images;
        if (body.categoryId !== undefined)
            values.categoryId = body.categoryId ? parseInt(body.categoryId) : null;
        if (body.collectionId !== undefined)
            values.collectionId = body.collectionId ? parseInt(body.collectionId) : null;
        if (body.stock !== undefined)
            values.stock = parseInt(body.stock);
        if (body.featured !== undefined)
            values.featured = body.featured;
        if (body.isNew !== undefined)
            values.isNew = body.isNew;
        if (body.published !== undefined)
            values.published = body.published;
        if (body.material !== undefined)
            values.material = body.material;
        if (body.dimensions !== undefined)
            values.dimensions = body.dimensions;
        if (body.care !== undefined)
            values.care = body.care;
        const [updated] = await db_1.db
            .update(db_1.schema.products)
            .set(values)
            .where((0, drizzle_orm_1.eq)(db_1.schema.products.id, id))
            .returning();
        if (!updated)
            return res.status(404).json({ error: "Product not found" });
        res.json(updated);
        const changedFields = Object.keys(values).join(", ");
        (0, admin_log_1.logAdminAction)("product.updated", "product", updated.id, `Updated product "${updated.name}" (${changedFields})`);
    }
    catch (err) {
        console.error("Product update error:", err);
        res.status(500).json({ error: "Failed to update product" });
    }
}
async function remove(req, res) {
    const id = parseInt(req.params.id, 10);
    const [deleted] = await db_1.db
        .delete(db_1.schema.products)
        .where((0, drizzle_orm_1.eq)(db_1.schema.products.id, id))
        .returning({ id: db_1.schema.products.id, name: db_1.schema.products.name });
    if (!deleted)
        return res.status(404).json({ error: "Product not found" });
    res.json({ ok: true });
    (0, admin_log_1.logAdminAction)("product.deleted", "product", deleted.id, `Deleted product "${deleted.name}"`);
}
