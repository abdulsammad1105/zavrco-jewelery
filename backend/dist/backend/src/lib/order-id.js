"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOrderId = formatOrderId;
function formatOrderId(id) {
    return `ZAV${String(id).padStart(3, "0")}`;
}
