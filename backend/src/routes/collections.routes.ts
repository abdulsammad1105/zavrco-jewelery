import { Router } from "express";
import * as collectionsController from "../controllers/collections.controller";

const router = Router();
router.get("/", collectionsController.list);

export default router;
