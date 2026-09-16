import { Router } from "express";
import * as messagesController from "../controllers/messages.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.post("/", messagesController.create);
router.get("/", requireAdmin, messagesController.list);
router.patch("/:id", requireAdmin, messagesController.updateStatus);

export default router;
