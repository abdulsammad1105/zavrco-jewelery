"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.reviews = exports.adminLogs = exports.wishlist = exports.orders = exports.products = exports.collections = exports.categories = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    passwordHash: (0, pg_core_1.text)("password_hash").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.categories = (0, pg_core_1.pgTable)("categories", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    slug: (0, pg_core_1.varchar)("slug", { length: 100 }).notNull().unique(),
    image: (0, pg_core_1.text)("image"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.collections = (0, pg_core_1.pgTable)("collections", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    slug: (0, pg_core_1.varchar)("slug", { length: 100 }).notNull().unique(),
    description: (0, pg_core_1.text)("description"),
    image: (0, pg_core_1.text)("image"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.products = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)("slug", { length: 255 }).notNull().unique(),
    description: (0, pg_core_1.text)("description"),
    price: (0, pg_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    images: (0, pg_core_1.jsonb)("images").$type().default([]),
    categoryId: (0, pg_core_1.integer)("category_id").references(() => exports.categories.id),
    collectionId: (0, pg_core_1.integer)("collection_id").references(() => exports.collections.id),
    stock: (0, pg_core_1.integer)("stock").default(0).notNull(),
    featured: (0, pg_core_1.boolean)("featured").default(false).notNull(),
    material: (0, pg_core_1.varchar)("material", { length: 255 }),
    dimensions: (0, pg_core_1.varchar)("dimensions", { length: 255 }),
    care: (0, pg_core_1.text)("care"),
    isNew: (0, pg_core_1.boolean)("is_new").default(false).notNull(),
    published: (0, pg_core_1.boolean)("published").default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.orders = (0, pg_core_1.pgTable)("orders", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    customerName: (0, pg_core_1.varchar)("customer_name", { length: 255 }).notNull(),
    customerEmail: (0, pg_core_1.varchar)("customer_email", { length: 255 }),
    customerPhone: (0, pg_core_1.varchar)("customer_phone", { length: 50 }).notNull(),
    address: (0, pg_core_1.text)("address").notNull(),
    city: (0, pg_core_1.varchar)("city", { length: 100 }).notNull(),
    province: (0, pg_core_1.varchar)("province", { length: 100 }).notNull(),
    postalCode: (0, pg_core_1.varchar)("postal_code", { length: 20 }),
    items: (0, pg_core_1.jsonb)("items").$type().notNull(),
    subtotal: (0, pg_core_1.decimal)("subtotal", { precision: 10, scale: 2 }).notNull(),
    shipping: (0, pg_core_1.decimal)("shipping", { precision: 10, scale: 2 }).default("0").notNull(),
    total: (0, pg_core_1.decimal)("total", { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("pending").notNull(),
    paymentMethod: (0, pg_core_1.varchar)("payment_method", { length: 50 }).default("jazzcash").notNull(),
    paymentProof: (0, pg_core_1.text)("payment_proof"), // base64 image data URI, required at checkout
    userId: (0, pg_core_1.integer)("user_id").references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.wishlist = (0, pg_core_1.pgTable)("wishlist", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id")
        .references(() => exports.users.id)
        .notNull(),
    productId: (0, pg_core_1.integer)("product_id")
        .references(() => exports.products.id)
        .notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => [(0, pg_core_1.uniqueIndex)("wishlist_user_product_idx").on(table.userId, table.productId)]);
exports.adminLogs = (0, pg_core_1.pgTable)("admin_logs", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    action: (0, pg_core_1.varchar)("action", { length: 50 }).notNull(), // e.g. "product.created", "order.status_updated"
    entityType: (0, pg_core_1.varchar)("entity_type", { length: 50 }).notNull(), // "product" | "order"
    entityId: (0, pg_core_1.integer)("entity_id"),
    description: (0, pg_core_1.text)("description").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.reviews = (0, pg_core_1.pgTable)("reviews", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    rating: (0, pg_core_1.integer)("rating").notNull(), // 1-5
    comment: (0, pg_core_1.text)("comment").notNull(),
    productId: (0, pg_core_1.integer)("product_id").references(() => exports.products.id),
    published: (0, pg_core_1.boolean)("published").default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.messages = (0, pg_core_1.pgTable)("messages", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 50 }),
    message: (0, pg_core_1.text)("message").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 20 }).default("new").notNull(), // "new" | "handled"
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
