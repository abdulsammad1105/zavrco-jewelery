"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const envCandidates = [
    path_1.default.resolve(process.cwd(), ".env"),
    path_1.default.resolve(process.cwd(), "backend/.env"),
    path_1.default.resolve(process.cwd(), "../backend/.env"),
];
const selectedEnvPath = envCandidates.find((candidate) => fs_1.default.existsSync(candidate));
if (selectedEnvPath) {
    dotenv_1.default.config({ path: selectedEnvPath });
}
const auth_1 = require("./middleware/auth");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const products_routes_1 = __importDefault(require("./routes/products.routes"));
const categories_routes_1 = __importDefault(require("./routes/categories.routes"));
const collections_routes_1 = __importDefault(require("./routes/collections.routes"));
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const admin_products_routes_1 = __importDefault(require("./routes/admin-products.routes"));
const admin_logs_routes_1 = __importDefault(require("./routes/admin-logs.routes"));
const reviews_routes_1 = __importDefault(require("./routes/reviews.routes"));
const messages_routes_1 = __importDefault(require("./routes/messages.routes"));
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use((0, cors_1.default)({
    origin: FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "5mb" }));
app.use((0, cookie_parser_1.default)());
app.use(auth_1.attachUser);
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/products", products_routes_1.default);
app.use("/api/categories", categories_routes_1.default);
app.use("/api/collections", collections_routes_1.default);
app.use("/api/wishlist", wishlist_routes_1.default);
app.use("/api/orders", orders_routes_1.default);
app.use("/api/admin/products", admin_products_routes_1.default);
app.use("/api/admin/logs", admin_logs_routes_1.default);
app.use("/api/reviews", reviews_routes_1.default);
app.use("/api/messages", messages_routes_1.default);
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});
if (process.env.VERCEL !== "1") {
    app.listen(PORT, () => {
        console.log(`ZAVR.CO backend listening on http://localhost:${PORT}`);
    });
}
exports.default = app;
