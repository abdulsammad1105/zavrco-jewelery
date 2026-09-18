"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAdminAction = logAdminAction;
const db_1 = require("../db");
async function logAdminAction(action, entityType, entityId, description) {
    try {
        await db_1.db.insert(db_1.schema.adminLogs).values({ action, entityType, entityId, description });
    }
    catch (err) {
        // Logging failures should never break the actual admin action.
        console.error("Failed to write admin log:", err);
    }
}
