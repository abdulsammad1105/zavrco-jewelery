"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.list = list;
exports.updateStatus = updateStatus;
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
async function create(req, res) {
    const { name, email, phone, message } = req.body;
    if (!name || typeof name !== "string" || name.trim().length < 2) {
        return res.status(400).json({ error: "Please enter your name" });
    }
    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: "Please enter a valid email" });
    }
    if (!message || typeof message !== "string" || message.trim().length < 5) {
        return res.status(400).json({ error: "Please write a message" });
    }
    const [created] = await db_1.db
        .insert(db_1.schema.messages)
        .values({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone || null,
        message: message.trim(),
    })
        .returning();
    res.status(201).json(created);
}
/** Admin: inbox */
async function list(_req, res) {
    const result = await db_1.db.select().from(db_1.schema.messages).orderBy((0, drizzle_orm_1.desc)(db_1.schema.messages.createdAt));
    res.json(result);
}
async function updateStatus(req, res) {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    const [updated] = await db_1.db
        .update(db_1.schema.messages)
        .set({ status })
        .where((0, drizzle_orm_1.eq)(db_1.schema.messages.id, id))
        .returning();
    if (!updated)
        return res.status(404).json({ error: "Message not found" });
    res.json(updated);
}
