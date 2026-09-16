import { Router } from "express";
import * as reviewsController from "../controllers/reviews.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", reviewsController.list);
router.post("/", reviewsController.create);
router.get("/admin/all", requireAdmin, reviewsController.listAll);
router.put("/admin/:id/publish", requireAdmin, reviewsController.setPublished);
router.delete("/admin/:id", requireAdmin, reviewsController.remove);

export default router;
