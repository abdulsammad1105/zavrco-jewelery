import { Router } from "express";
import * as productsController from "../controllers/products.controller";

const router = Router();

router.get("/", productsController.list);
router.get("/:slug", productsController.detail);

export default router;
