"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.add = add;
exports.remove = remove;
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
async function list(req, res) {
    const userId = req.user.id;
    const rows = await db_1.db
        .select({
        id: db_1.schema.wishlist.id,
        productId: db_1.schema.wishlist.productId,
        product: db_1.schema.products,
    })
        .from(db_1.schema.wishlist)
        .leftJoin(db_1.schema.products, (0, drizzle_orm_1.eq)(db_1.schema.wishlist.productId, db_1.schema.products.id))
        .where((0, drizzle_orm_1.eq)(db_1.schema.wishlist.userId, userId));
    const items = rows.filter((r) => r.product !== null);
    res.json({ items });
}
async function add(req, res) {
    const userId = req.user.id;
    const productId = Number(req.body?.productId);
    if (!Number.isInteger(productId) || productId <= 0) {
        return res.status(400).json({ error: "productId is required" });
    }
    const [product] = await db_1.db
        .select({ id: db_1.schema.products.id })
        .from(db_1.schema.products)
        .where((0, drizzle_orm_1.eq)(db_1.schema.products.id, productId))
        .limit(1);
    if (!product)
        return res.status(404).json({ error: "Product not found" });
    const [existing] = await db_1.db
        .select({ id: db_1.schema.wishlist.id })
        .from(db_1.schema.wishlist)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_1.schema.wishlist.userId, userId), (0, drizzle_orm_1.eq)(db_1.schema.wishlist.productId, productId)))
        .limit(1);
    if (existing)
        return res.json({ ok: true, alreadyExists: true });
    await db_1.db.insert(db_1.schema.wishlist).values({ userId, productId });
    return res.status(201).json({ ok: true });
}
async function remove(req, res) {
    const userId = req.user.id;
    const productId = parseInt(req.params.productId, 10);
    if (Number.isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product id" });
    }
    await db_1.db
        .delete(db_1.schema.wishlist)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_1.schema.wishlist.userId, userId), (0, drizzle_orm_1.eq)(db_1.schema.wishlist.productId, productId)));
    res.json({ ok: true });
}
