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
import { createComment, getCommentsBySnippet } from "../controller/comment.controller";
import {
  trackView,
  getTrendingSnippets,
  getUserAnalytics,
} from "../controller/analytics.controller";

const router = Router();

/* ================= FOLDER ROUTES ================= */
router.use("/folders", folderRoutes);

/* ================= SNIPPET ROUTES ================= */
router.post("/", authMiddleware, createSnippet);
router.get("/", authMiddleware, getAllSnippets);

router.get("/public/:id", getPublicSnippet);
router.get("/:id", authMiddleware, getSnippetById);

router.get("/:id/history", authMiddleware, getSnippetHistory);
router.post("/restore/:versionId", authMiddleware, restoreSnippetVersion);

router.get("/folder/:folderId", authMiddleware, getSnippetsByFolder);
router.put("/move/:id", authMiddleware, moveSnippetToFolder);

router.post("/:id/fork", authMiddleware, forkSnippet);

router.put("/:id", authMiddleware, updateSnippet);
router.delete("/:id", authMiddleware, deleteSnippet);

/* ================= COMMENT ROUTES ================= */
router.post("/:id/comments", authMiddleware, createComment);
router.get("/:id/comments", authMiddleware, getCommentsBySnippet);

/* ================= ANALYTICS ROUTES ================= */
router.post("/:id/view", trackView); // Public endpoint for tracking views
router.get("/trending/list", getTrendingSnippets); // Public endpoint
router.get("/analytics/user", authMiddleware, getUserAnalytics);

export default router;



