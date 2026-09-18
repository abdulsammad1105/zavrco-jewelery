"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISCOUNT_PERCENT = void 0;
exports.getDiscountedPrice = getDiscountedPrice;
exports.formatOriginalPrice = formatOriginalPrice;
exports.formatDiscountedPrice = formatDiscountedPrice;
// Automatic sitewide discount (no code required)
exports.DISCOUNT_PERCENT = 10;
function getDiscountedPrice(originalPrice) {
    const price = typeof originalPrice === "string" ? parseFloat(originalPrice) : originalPrice;
    return Math.round(price * (1 - exports.DISCOUNT_PERCENT / 100));
}
function formatOriginalPrice(price) {
    const num = typeof price === "string" ? parseFloat(price) : price;
    return `Rs. ${num.toLocaleString("en-PK")}`;
}
function formatDiscountedPrice(price) {
    return `Rs. ${getDiscountedPrice(price).toLocaleString("en-PK")}`;
}
