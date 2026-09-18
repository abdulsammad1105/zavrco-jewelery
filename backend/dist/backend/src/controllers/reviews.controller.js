"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.create = create;
exports.listAll = listAll;
exports.setPublished = setPublished;
exports.remove = remove;
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const admin_log_1 = require("../lib/admin-log");
async function list(req, res) {
    const { productId } = req.query;
    const conditions = [(0, drizzle_orm_1.eq)(db_1.schema.reviews.published, true)];
    if (productId)
        conditions.push((0, drizzle_orm_1.eq)(db_1.schema.reviews.productId, parseInt(productId, 10)));
    const result = await db_1.db
        .select()
        .from(db_1.schema.reviews)
        .where((0, drizzle_orm_1.and)(...conditions))
        .orderBy((0, drizzle_orm_1.desc)(db_1.schema.reviews.createdAt));
    res.json(result);
}
async function create(req, res) {
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
    const [review] = await db_1.db
        .insert(db_1.schema.reviews)
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
async function listAll(_req, res) {
    const result = await db_1.db.select().from(db_1.schema.reviews).orderBy((0, drizzle_orm_1.desc)(db_1.schema.reviews.createdAt));
    res.json(result);
}
async function setPublished(req, res) {
    const id = parseInt(req.params.id, 10);
    const { published } = req.body;
    const [updated] = await db_1.db
        .update(db_1.schema.reviews)
        .set({ published: !!published })
        .where((0, drizzle_orm_1.eq)(db_1.schema.reviews.id, id))
        .returning();
    if (!updated)
        return res.status(404).json({ error: "Review not found" });
    res.json(updated);
    (0, admin_log_1.logAdminAction)("review.visibility_updated", "product", updated.id, `Review #${updated.id} ${published ? "published" : "hidden"}`);
}
async function remove(req, res) {
    const id = parseInt(req.params.id, 10);
    const [deleted] = await db_1.db
        .delete(db_1.schema.reviews)
        .where((0, drizzle_orm_1.eq)(db_1.schema.reviews.id, id))
        .returning({ id: db_1.schema.reviews.id });
    if (!deleted)
        return res.status(404).json({ error: "Review not found" });
    res.json({ ok: true });
}
