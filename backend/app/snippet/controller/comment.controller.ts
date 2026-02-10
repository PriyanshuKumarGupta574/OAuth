import { Request, Response } from "express";
import {
  createCommentService,
  getCommentsBySnippetService,
} from "../services/comment.service";
import Comment from "../schema/comment.schema";
import { updateCommentCountService } from "../services/analytics.service";
import { getUserId, getParamId } from "../../common/helper/request.helper";
import { catchError } from "../../common/middleware/catch-error.middleware";

export const createComment = catchError(async (req: Request, res: Response) => {
  const snippetId = getParamId(req);
  const { text, parentCommentId } = req.body;

  if (!text || !text.trim()) {
    res.status(400);
    throw new Error("Comment text is required");
  }

  if (parentCommentId) {
    const parentComment = await Comment.findById(parentCommentId);

    if (!parentComment) {
      res.status(404);
      throw new Error("Parent comment not found");
    }

    if (parentComment.snippet.toString() !== snippetId) {
      res.status(400);
      throw new Error("Parent comment does not belong to this snippet");
    }
  }

  const comment = await createCommentService(
    snippetId,
    getUserId(req),
    text,
    parentCommentId
  );

  await updateCommentCountService(snippetId);

  res.status(201).json(comment);
});

export const getCommentsBySnippet = catchError(async (req: Request, res: Response) => {
  const comments = await getCommentsBySnippetService(getParamId(req));
  res.json(comments);
});


