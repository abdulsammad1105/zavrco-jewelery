// Automatic sitewide discount (no code required)
export const DISCOUNT_PERCENT = 10;

export function getDiscountedPrice(originalPrice: string | number): number {
  const price = typeof originalPrice === "string" ? parseFloat(originalPrice) : originalPrice;
  return Math.round(price * (1 - DISCOUNT_PERCENT / 100));
}

export function formatOriginalPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `Rs. ${num.toLocaleString("en-PK")}`;
}

export function formatDiscountedPrice(price: string | number): string {
  return `Rs. ${getDiscountedPrice(price).toLocaleString("en-PK")}`;
}
