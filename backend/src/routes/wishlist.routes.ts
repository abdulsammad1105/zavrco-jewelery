import { Router } from "express";
import * as wishlistController from "../controllers/wishlist.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, wishlistController.list);
router.post("/", requireAuth, wishlistController.add);
router.delete("/:productId", requireAuth, wishlistController.remove);

export default router;
