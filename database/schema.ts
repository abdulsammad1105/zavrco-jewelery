import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  decimal,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  categoryId: integer("category_id").references(() => categories.id),
  collectionId: integer("collection_id").references(() => collections.id),
  stock: integer("stock").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(),
  material: varchar("material", { length: 255 }),
  dimensions: varchar("dimensions", { length: 255 }),
  care: text("care"),
  isNew: boolean("is_new").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  province: varchar("province", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }),
  items: jsonb("items").$type<OrderItemData[]>().notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).default("0").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).default("jazzcash").notNull(),
  paymentProof: text("payment_proof"), // base64 image data URI, required at checkout
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wishlist = pgTable(
  "wishlist",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    productId: integer("product_id")
      .references(() => products.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("wishlist_user_product_idx").on(table.userId, table.productId)],
);

export const adminLogs = pgTable("admin_logs", {
  id: serial("id").primaryKey(),
  action: varchar("action", { length: 50 }).notNull(), // e.g. "product.created", "order.status_updated"
  entityType: varchar("entity_type", { length: 50 }).notNull(), // "product" | "order"
  entityId: integer("entity_id"),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment").notNull(),
  productId: integer("product_id").references(() => products.id),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).default("new").notNull(), // "new" | "handled"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type OrderItemData = {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
};

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Collection = typeof collections.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type User = typeof users.$inferSelect;
export type WishlistItem = typeof wishlist.$inferSelect;
export type AdminLog = typeof adminLogs.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Message = typeof messages.$inferSelect;
