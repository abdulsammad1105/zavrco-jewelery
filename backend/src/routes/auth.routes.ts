import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authController.me);

router.post("/admin-login", authController.adminLogin);
router.post("/admin-logout", authController.adminLogout);
router.get("/admin-me", authController.adminMe);

export default router;
