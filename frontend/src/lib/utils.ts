export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `Rs. ${num.toLocaleString("en-PK")}`;
}
 
export function formatOrderId(id: number): string {
  return `ZAV${String(id).padStart(3, "0")}`;
}
 
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
 