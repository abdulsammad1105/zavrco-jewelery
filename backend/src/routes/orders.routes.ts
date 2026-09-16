import { Router } from "express";
import * as ordersController from "../controllers/orders.controller";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.post("/", ordersController.create);
router.get("/", requireAdmin, ordersController.listAll);
router.get("/mine", requireAuth, ordersController.listMine);
router.get("/track", ordersController.track);
router.patch("/:id", requireAdmin, ordersController.updateStatus);

export default router;
