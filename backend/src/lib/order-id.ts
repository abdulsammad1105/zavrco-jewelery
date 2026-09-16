export function formatOrderId(id: number): string {
  return `ZAV${String(id).padStart(3, "0")}`;
}