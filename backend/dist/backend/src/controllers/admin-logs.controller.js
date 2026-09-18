"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
async function list(_req, res) {
    const result = await db_1.db
        .select()
        .from(db_1.schema.adminLogs)
        .orderBy((0, drizzle_orm_1.desc)(db_1.schema.adminLogs.createdAt))
        .limit(200);
    res.json(result);
}
