import Comment, { IComment } from "../schema/comment.schema";
import mongoose from "mongoose";

export interface CommentWithReplies extends Omit<IComment, 'replies'> {
  replies: CommentWithReplies[];
}

export const createCommentService = async (
  snippetId: string,
  userId: string,
  text: string,
  parentCommentId?: string
) => {
  const commentData: Partial<IComment> = {
    snippet: new mongoose.Types.ObjectId(snippetId),
    author: new mongoose.Types.ObjectId(userId),
    text,
  };

  if (parentCommentId) {
    commentData.parentComment = new mongoose.Types.ObjectId(parentCommentId);
  }

  const comment = await Comment.create(commentData);
  return await comment.populate("author", "name email");
};

export const getCommentsBySnippetService = async (snippetId: string) => {
  const topLevelComments = await Comment.find({
    snippet: snippetId,
    parentComment: null,
  })
    .populate("author", "name email")
    .sort({ createdAt: 1 })
    .lean();

  const populateReplies = async (commentId: mongoose.Types.ObjectId | string): Promise<CommentWithReplies[]> => {
    const replies = await Comment.find({ parentComment: commentId })
      .populate("author", "name email")
      .sort({ createdAt: 1 })
      .lean();

    const repliesWithNested = await Promise.all(
      replies.map(async (reply) => ({
        ...reply,
        replies: await populateReplies(reply._id as mongoose.Types.ObjectId),
      }))
    );

    return repliesWithNested as unknown as CommentWithReplies[];
  };


  const commentsWithReplies = await Promise.all(
    topLevelComments.map(async (comment) => ({
      ...comment,
      replies: await populateReplies(comment._id as mongoose.Types.ObjectId),
    }))
  );

  return commentsWithReplies;
};

export const getRepliesByCommentService = async (commentId: string) => {
  return await Comment.find({ parentComment: commentId })
    .populate("author", "name email")
    .sort({ createdAt: 1 });
};
