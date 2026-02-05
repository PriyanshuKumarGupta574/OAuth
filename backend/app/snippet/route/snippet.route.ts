import { Router } from "express";
import {
  createSnippet,
  getAllSnippets,
  getSnippetById,
  deleteSnippet,
  updateSnippet,
  getPublicSnippet,
  forkSnippet,
  getSnippetHistory,
  restoreSnippetVersion,
  getSnippetsByFolder,
  moveSnippetToFolder,
} from "../controller/snippet.controller";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import folderRoutes from "./folder.routes";


const router = Router();

router.use("/folders", folderRoutes);
router.post("/", authMiddleware, createSnippet);


router.get("/", authMiddleware, getAllSnippets);

router.get("/public/:id", getPublicSnippet);
router.get("/:id", authMiddleware, getSnippetById);

router.get("/:id/history", authMiddleware, getSnippetHistory);
router.post("/restore/:versionId", restoreSnippetVersion);

router.get("/folder/:folderId", authMiddleware, getSnippetsByFolder);
//router.patch("/:id/move", authMiddleware, moveSnippetToFolder);
router.put("/move/:id", authMiddleware, moveSnippetToFolder);






router.post("/:id/fork", authMiddleware, forkSnippet);


router.put("/:id", authMiddleware, updateSnippet);


router.delete("/:id", authMiddleware, deleteSnippet);

export default router;

