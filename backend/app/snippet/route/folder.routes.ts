import express from "express";
import { createFolder, getFolders, moveSnippetToFolder, deleteFolder } from "../controller/folder.controller";
import { authMiddleware } from "../../common/middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createFolder);
router.get("/", authMiddleware, getFolders);
router.put("/move-snippet", authMiddleware, moveSnippetToFolder);
router.delete("/:id", authMiddleware, deleteFolder);


export default router;


// import { Router } from "express";
// import { createFolder, getFolders } from "../controller/folder.controller";
// import { authMiddleware } from "../../common/middleware/auth.middleware";

// const router = Router();

// router.post("/", authMiddleware, createFolder);
// router.get("/", authMiddleware, getFolders);

// export default router;
