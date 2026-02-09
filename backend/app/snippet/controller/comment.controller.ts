import { Request, Response } from "express";
import {
  createCommentService,
  getCommentsBySnippetService,
} from "../services/comment.service";
import Comment from "../schema/comment.schema";
import { updateCommentCountService } from "../services/analytics.service";
import { asyncHandler, handleError } from "../../common/utils/error.handler";
import { getUserId, getParamId } from "../../common/helper/request.helper";


export const createComment = asyncHandler(async (req: Request, res: Response) => {
  const snippetId = getParamId(req);
  const { text, parentCommentId } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  
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
    getUserId(req),
    text,
    parentCommentId
  );

 
  await updateCommentCountService(snippetId);

  res.status(201).json(comment);
}, (res, error) => handleError(res, error, "Failed to create comment"));


export const getCommentsBySnippet = asyncHandler(async (req: Request, res: Response) => {
  const comments = await getCommentsBySnippetService(getParamId(req));
  res.json(comments);
}, (res, error) => handleError(res, error, "Failed to fetch comments"));

