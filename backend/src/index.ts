import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend/.env"),
  path.resolve(process.cwd(), "../backend/.env"),
];
const selectedEnvPath = envCandidates.find((candidate) => fs.existsSync(candidate));
if (selectedEnvPath) {
  dotenv.config({ path: selectedEnvPath });
}

import { attachUser } from "./middleware/auth";
import authRoutes from "./routes/auth.routes";
import productsRoutes from "./routes/products.routes";
import categoriesRoutes from "./routes/categories.routes";
import collectionsRoutes from "./routes/collections.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import ordersRoutes from "./routes/orders.routes";
import adminProductsRoutes from "./routes/admin-products.routes";
import adminLogsRoutes from "./routes/admin-logs.routes";
import reviewsRoutes from "./routes/reviews.routes";
import messagesRoutes from "./routes/messages.routes";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(attachUser);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api/admin/logs", adminLogsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/messages", messagesRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`ZAVR.CO backend listening on http://localhost:${PORT}`);
  });
}

export default app;
