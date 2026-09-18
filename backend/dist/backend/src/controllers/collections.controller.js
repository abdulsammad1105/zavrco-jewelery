"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
const db_1 = require("../db");
async function list(_req, res) {
    const result = await db_1.db.select().from(db_1.schema.collections);
    res.json(result);
}
