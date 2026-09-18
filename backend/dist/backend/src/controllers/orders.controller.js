"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.track = track;
exports.listAll = listAll;
exports.listMine = listMine;
exports.updateStatus = updateStatus;
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const discount_1 = require("../lib/discount");
const shipping_1 = require("../lib/shipping");
const admin_log_1 = require("../lib/admin-log");
const email_1 = require("../lib/email");
async function create(req, res) {
    try {
        const currentUser = req.user;
        const { customerName, customerEmail, customerPhone, address, city, province, postalCode, items, paymentProof, } = req.body;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!customerName || !customerPhone || !customerEmail || !emailPattern.test(customerEmail) || !address || !city || !province) {
            return res.status(400).json({ error: "Missing required fields or invalid email" });
        }
        if (!paymentProof ||
            typeof paymentProof !== "string" ||
            !paymentProof.startsWith("data:image/")) {
            return res.status(400).json({ error: "Payment screenshot is required" });
        }
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }
        const requested = [];
        for (const raw of items) {
            const productId = Number(raw?.productId);
            const quantity = Number(raw?.quantity);
            if (!Number.isInteger(productId) || productId <= 0) {
                return res.status(400).json({ error: "Invalid product in cart" });
            }
            if (!Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({ error: "Quantity must be a positive whole number" });
            }
            requested.push({ productId, quantity });
        }
        const productIds = requested.map((r) => r.productId);
        const dbProducts = await db_1.db
            .select()
            .from(db_1.schema.products)
            .where((0, drizzle_orm_1.inArray)(db_1.schema.products.id, productIds));
        const productMap = new Map(dbProducts.map((p) => [p.id, p]));
        const orderItems = [];
        let subtotal = 0;
        for (const { productId, quantity } of requested) {
            const product = productMap.get(productId);
            if (!product) {
                return res.status(404).json({ error: "One or more products are no longer available" });
            }
            if (!product.published) {
                return res.status(400).json({ error: `${product.name} is currently unavailable` });
            }
            if (quantity > product.stock) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}.` });
            }
            const discountedUnitPrice = (0, discount_1.getDiscountedPrice)(product.price);
            subtotal += discountedUnitPrice * quantity;
            orderItems.push({
                productId: product.id,
                name: product.name,
                price: String(discountedUnitPrice),
                quantity,
                image: product.images?.[0] || "",
            });
        }
        const total = subtotal + shipping_1.SHIPPING_COST;
        const order = await db_1.db.transaction(async (tx) => {
            const [created] = await tx
                .insert(db_1.schema.orders)
                .values({
                customerName,
                customerEmail: customerEmail || null,
                customerPhone,
                address,
                city,
                province,
                postalCode: postalCode || null,
                items: orderItems,
                subtotal: String(subtotal),
                shipping: String(shipping_1.SHIPPING_COST),
                total: String(total),
                status: "pending",
                paymentMethod: "jazzcash",
                paymentProof,
                userId: currentUser?.id ?? null,
            })
                .returning();
            for (const { productId, quantity } of requested) {
                const product = productMap.get(productId);
                const updated = await tx
                    .update(db_1.schema.products)
                    .set({ stock: (0, drizzle_orm_1.sql) `${db_1.schema.products.stock} - ${quantity}` })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(db_1.schema.products.id, productId), (0, drizzle_orm_1.gte)(db_1.schema.products.stock, quantity)))
                    .returning({ id: db_1.schema.products.id });
                if (updated.length === 0) {
                    throw new Error(`Insufficient stock for ${product.name}.`);
                }
            }
            return created;
        });
        await (0, email_1.sendOrderConfirmationEmail)({
            id: order.id,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            address: order.address,
            city: order.city,
            province: order.province,
            postalCode: order.postalCode,
            items: orderItems,
            total: order.total,
            status: order.status,
            paymentMethod: order.paymentMethod,
        });
        return res.status(201).json({ id: order.id });
    }
    catch (err) {
        console.error("Order creation error:", err);
        const message = err instanceof Error ? err.message : "Failed to create order";
        const isStockError = message.startsWith("Insufficient stock");
        return res
            .status(isStockError ? 400 : 500)
            .json({ error: isStockError ? message : "Failed to create order" });
    }
}
/** Public: track an order by ID + phone (no auth required, phone acts as a shared secret) */
async function track(req, res) {
    const { id, phone } = req.query;
    const orderId = parseInt(id || "", 10);
    if (!Number.isInteger(orderId) || !phone) {
        return res.status(400).json({ error: "Order ID and phone number are required" });
    }
    const [order] = await db_1.db.select().from(db_1.schema.orders).where((0, drizzle_orm_1.eq)(db_1.schema.orders.id, orderId)).limit(1);
    if (!order || order.customerPhone.replace(/\s+/g, "") !== phone.replace(/\s+/g, "")) {
        return res.status(404).json({ error: "No order found with that ID and phone number" });
    }
    res.json(order);
}
/** Admin: all orders */
async function listAll(_req, res) {
    const result = await db_1.db.select().from(db_1.schema.orders).orderBy((0, drizzle_orm_1.desc)(db_1.schema.orders.createdAt));
    res.json(result);
}
/** Logged-in customer: their own orders */
async function listMine(req, res) {
    const userId = req.user.id;
    const result = await db_1.db
        .select()
        .from(db_1.schema.orders)
        .where((0, drizzle_orm_1.eq)(db_1.schema.orders.userId, userId))
        .orderBy((0, drizzle_orm_1.desc)(db_1.schema.orders.createdAt));
    res.json(result);
}
/** Admin: update order status */
async function updateStatus(req, res) {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    const [updated] = await db_1.db
        .update(db_1.schema.orders)
        .set({ status })
        .where((0, drizzle_orm_1.eq)(db_1.schema.orders.id, id))
        .returning();
    if (!updated)
        return res.status(404).json({ error: "Order not found" });
    res.json(updated);
    (0, admin_log_1.logAdminAction)("order.status_updated", "order", updated.id, `Order #${updated.id} status changed to "${status}"`);
}
