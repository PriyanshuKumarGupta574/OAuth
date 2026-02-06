
import { Router } from "express";
import { listGists, importGist, exportGist } from "../controller/github.controller";
import { authMiddleware } from "../../common/middleware/auth.middleware";

const router = Router();

router.get("/gists", authMiddleware, listGists);
router.post("/import", authMiddleware, importGist);
router.post("/export/:id", authMiddleware, exportGist);

export default router;
