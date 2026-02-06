import { Request, Response } from "express";
import {
  createCommentService,
  getCommentsBySnippetService,
} from "../services/comment.service";

/* ================= CREATE COMMENT ================= */
export const createComment = async (req: Request, res: Response) => {
  try {
    const snippetId = req.params.id as string;
    const text = req.body.text;
    const userId = (req as any).user.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const comment = await createCommentService(snippetId, userId, text);
    res.status(201).json(comment);
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ message: "Failed to create comment" });
  }
};

/* ================= GET COMMENTS ================= */
export const getCommentsBySnippet = async (req: Request, res: Response) => {
  try {
    const snippetId = req.params.id as string;

    const comments = await getCommentsBySnippetService(snippetId);
    res.json(comments);
  } catch (error) {
    console.error("Fetch comments error:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};


// import { Request, Response } from "express";
// import {
//   createCommentService,
//   getCommentsBySnippetService,
// } from "../services/comment.service";

// export const createComment = async (req: Request, res: Response) => {
//   const snippetId = req.body.snippetId as string;
//   const text = req.body.text;
//   const userId = (req as any).user.id;

//   const comment = await createCommentService(snippetId, userId, text);
//   res.json(comment);
// };

// export const createComment = async (req: Request, res: Response) => {
//   const snippetId = req.params.id;
//   const text = req.body.text;
//   const userId = (req as any).user.id;

//   const comment = await createCommentService(snippetId, userId, text);
//   res.json(comment);
// };


// export const getCommentsBySnippet = async (req: Request, res: Response) => {
//   const snippetId = req.params.id as string;

//   const comments = await getCommentsBySnippetService(snippetId);
//   res.json(comments);
// };
