import { Request, Response } from "express";
import {
  createCommentService,
  getCommentsBySnippetService,
} from "../services/comment.service";
import Comment from "../schema/comment.schema";
import { updateCommentCountService } from "../services/analytics.service";

/* ================= CREATE COMMENT ================= */
export const createComment = async (req: Request, res: Response) => {
  try {
    const snippetId = req.params.id as string;
    const { text, parentCommentId } = req.body;
    const userId = req.user!._id;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // If parentCommentId is provided, validate it exists and belongs to the same snippet
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);

      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }

      if (parentComment.snippet.toString() !== snippetId) {
        return res.status(400).json({
          message: "Parent comment does not belong to this snippet"
        });
      }
    }

    const comment = await createCommentService(
      snippetId,
      userId as string,
      text,
      parentCommentId
    );

    // Update comment count for analytics
    await updateCommentCountService(snippetId);

    res.status(201).json(comment);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Create comment error:", err.message);
    res.status(500).json({ message: "Failed to create comment" });
  }
};

/* ================= GET COMMENTS ================= */
export const getCommentsBySnippet = async (req: Request, res: Response) => {
  try {
    const snippetId = req.params.id as string;

    const comments = await getCommentsBySnippetService(snippetId);
    res.json(comments);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Fetch comments error:", err.message);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};
