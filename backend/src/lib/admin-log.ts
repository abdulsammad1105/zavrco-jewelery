import { db, schema } from "../db";

export async function logAdminAction(
  action: string,
  entityType: "product" | "order",
  entityId: number | null,
  description: string,
) {
  try {
    await db.insert(schema.adminLogs).values({ action, entityType, entityId, description });
  } catch (err) {
    // Logging failures should never break the actual admin action.
    console.error("Failed to write admin log:", err);
  }
}
