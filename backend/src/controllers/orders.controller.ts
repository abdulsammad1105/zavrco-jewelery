import type { Request, Response } from "express";
import { db, schema } from "../db";
import { desc, eq, inArray, and, gte, sql } from "drizzle-orm";
import { getDiscountedPrice } from "../lib/discount";
import { SHIPPING_COST } from "../lib/shipping";
import { logAdminAction } from "../lib/admin-log";
import type { OrderItemData } from "../../../database/schema";
import { sendOrderConfirmationEmail } from "../lib/email";

export async function create(req: Request, res: Response) {
  try {
    const currentUser = req.user;
    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      province,
      postalCode,
      items,
      paymentProof,
    } = req.body;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerName || !customerPhone || !customerEmail || !emailPattern.test(customerEmail) || !address || !city || !province) {
      return res.status(400).json({ error: "Missing required fields or invalid email" });
    }

    if (
      !paymentProof ||
      typeof paymentProof !== "string" ||
      !paymentProof.startsWith("data:image/")
    ) {
      return res.status(400).json({ error: "Payment screenshot is required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    type RequestedItem = { productId: number; quantity: number };
    const requested: RequestedItem[] = [];
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
    const dbProducts = await db
      .select()
      .from(schema.products)
      .where(inArray(schema.products.id, productIds));

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    const orderItems: OrderItemData[] = [];
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

      const discountedUnitPrice = getDiscountedPrice(product.price);
      subtotal += discountedUnitPrice * quantity;

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: String(discountedUnitPrice),
        quantity,
        image: (product.images as string[])?.[0] || "",
      });
    }

    const total = subtotal + SHIPPING_COST;

    const order = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(schema.orders)
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
          shipping: String(SHIPPING_COST),
          total: String(total),
          status: "pending",
          paymentMethod: "jazzcash",
          paymentProof,
          userId: currentUser?.id ?? null,
        })
        .returning();

      for (const { productId, quantity } of requested) {
        const product = productMap.get(productId)!;
        const updated = await tx
          .update(schema.products)
          .set({ stock: sql`${schema.products.stock} - ${quantity}` })
          .where(and(eq(schema.products.id, productId), gte(schema.products.stock, quantity)))
          .returning({ id: schema.products.id });

        if (updated.length === 0) {
          throw new Error(`Insufficient stock for ${product.name}.`);
        }
      }

      return created;
    });

    await sendOrderConfirmationEmail({
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
  } catch (err) {
    console.error("Order creation error:", err);
    const message = err instanceof Error ? err.message : "Failed to create order";
    const isStockError = message.startsWith("Insufficient stock");
    return res
      .status(isStockError ? 400 : 500)
      .json({ error: isStockError ? message : "Failed to create order" });
  }
}

/** Public: track an order by ID + phone (no auth required, phone acts as a shared secret) */
export async function track(req: Request, res: Response) {
  const { id, phone } = req.query as Record<string, string | undefined>;
  const orderId = parseInt(id || "", 10);

  if (!Number.isInteger(orderId) || !phone) {
    return res.status(400).json({ error: "Order ID and phone number are required" });
  }

  const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, orderId)).limit(1);

  if (!order || order.customerPhone.replace(/\s+/g, "") !== phone.replace(/\s+/g, "")) {
    return res.status(404).json({ error: "No order found with that ID and phone number" });
  }

  res.json(order);
}

/** Admin: all orders */
export async function listAll(_req: Request, res: Response) {
  const result = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
  res.json(result);
}

/** Logged-in customer: their own orders */
export async function listMine(req: Request, res: Response) {
  const userId = req.user!.id;
  const result = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.userId, userId))
    .orderBy(desc(schema.orders.createdAt));
  res.json(result);
}

/** Admin: update order status */
export async function updateStatus(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  const [updated] = await db
    .update(schema.orders)
    .set({ status })
    .where(eq(schema.orders.id, id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Order not found" });
  res.json(updated);
  logAdminAction(
    "order.status_updated",
    "order",
    updated.id,
    `Order #${updated.id} status changed to "${status}"`,
  );
}