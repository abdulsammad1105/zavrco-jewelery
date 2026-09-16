import { Router } from "express";
import * as adminLogsController from "../controllers/admin-logs.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.use(requireAdmin);
router.get("/", adminLogsController.list);

export default router;
