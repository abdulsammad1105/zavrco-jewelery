import { Router } from "express";
import * as adminProductsController from "../controllers/admin-products.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.use(requireAdmin);
router.get("/", adminProductsController.list);
router.post("/", adminProductsController.create);
router.put("/:id", adminProductsController.update);
router.delete("/:id", adminProductsController.remove);

export default router;
