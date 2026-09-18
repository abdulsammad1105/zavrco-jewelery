"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.detail = detail;
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
async function list(req, res) {
    const { category, search, sort, featured, new: isNewParam, limit } = req.query;
    const conditions = [(0, drizzle_orm_1.eq)(db_1.schema.products.published, true)];
    if (category) {
        const [cat] = await db_1.db
            .select()
            .from(db_1.schema.categories)
            .where((0, drizzle_orm_1.eq)(db_1.schema.categories.slug, category))
            .limit(1);
        if (cat)
            conditions.push((0, drizzle_orm_1.eq)(db_1.schema.products.categoryId, cat.id));
    }
    if (search)
        conditions.push((0, drizzle_orm_1.ilike)(db_1.schema.products.name, `%${search}%`));
    if (featured === "true")
        conditions.push((0, drizzle_orm_1.eq)(db_1.schema.products.featured, true));
    if (isNewParam === "true")
        conditions.push((0, drizzle_orm_1.eq)(db_1.schema.products.isNew, true));
    let orderBy;
    switch (sort) {
        case "price-asc":
            orderBy = (0, drizzle_orm_1.asc)((0, drizzle_orm_1.sql) `CAST(${db_1.schema.products.price} AS NUMERIC)`);
            break;
        case "price-desc":
            orderBy = (0, drizzle_orm_1.desc)((0, drizzle_orm_1.sql) `CAST(${db_1.schema.products.price} AS NUMERIC)`);
            break;
        case "newest":
            orderBy = (0, drizzle_orm_1.desc)(db_1.schema.products.createdAt);
            break;
        default:
            orderBy = (0, drizzle_orm_1.desc)(db_1.schema.products.featured);
    }
    const result = await db_1.db
        .select()
        .from(db_1.schema.products)
        .where((0, drizzle_orm_1.and)(...conditions))
        .orderBy(orderBy)
        .limit(parseInt(limit || "50"));
    res.json(result);
}
async function detail(req, res) {
    const { slug } = req.params;
    const [product] = await db_1.db
        .select()
        .from(db_1.schema.products)
        .where((0, drizzle_orm_1.eq)(db_1.schema.products.slug, slug))
        .limit(1);
    if (!product || !product.published) {
        return res.status(404).json({ error: "Not found" });
    }
    let categoryName = null;
    if (product.categoryId) {
        const [cat] = await db_1.db
            .select()
            .from(db_1.schema.categories)
            .where((0, drizzle_orm_1.eq)(db_1.schema.categories.id, product.categoryId))
            .limit(1);
        categoryName = cat?.name || null;
    }
    const related = product.categoryId
        ? await db_1.db
            .select()
            .from(db_1.schema.products)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_1.schema.products.categoryId, product.categoryId), (0, drizzle_orm_1.ne)(db_1.schema.products.id, product.id), (0, drizzle_orm_1.eq)(db_1.schema.products.published, true)))
            .limit(4)
        : [];
    res.json({ product, categoryName, related });
}
