import Comment from "../schema/comment.schema";

export const createCommentService = async (
  snippetId: string,
  userId: string,
  text: string,
  parentCommentId?: string
) => {
  const commentData: any = {
    snippet: snippetId,
    author: userId,
    text,
  };

  if (parentCommentId) {
    commentData.parentComment = parentCommentId;
  }

  const comment = await Comment.create(commentData);
  return await comment.populate("author", "name email");
};

export const getCommentsBySnippetService = async (snippetId: string) => {
  // Get all top-level comments (no parent)
  const topLevelComments = await Comment.find({
    snippet: snippetId,
    parentComment: null,
  })
    .populate("author", "name email")
    .sort({ createdAt: 1 })
    .lean();

  // Recursively populate replies for each comment
  const populateReplies = async (comment: any): Promise<any> => {
    const replies = await Comment.find({ parentComment: comment._id })
      .populate("author", "name email")
      .sort({ createdAt: 1 })
      .lean();

    const repliesWithNested = await Promise.all(
      replies.map(async (reply) => ({
        ...reply,
        replies: await populateReplies(reply),
      }))
    );

    return repliesWithNested;
  };

  // Add replies to each top-level comment
  const commentsWithReplies = await Promise.all(
    topLevelComments.map(async (comment) => ({
      ...comment,
      replies: await populateReplies(comment),
    }))
  );

  return commentsWithReplies;
};

export const getRepliesByCommentService = async (commentId: string) => {
  return await Comment.find({ parentComment: commentId })
    .populate("author", "name email")
    .sort({ createdAt: 1 });
};

