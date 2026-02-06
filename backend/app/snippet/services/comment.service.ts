import Comment from "../schema/comment.schema";

export const createCommentService = async (
  snippetId: string,
  userId: string,
  text: string
) => {
  return await Comment.create({
    snippet: snippetId,
    author: userId,
    text,
  });
};

export const getCommentsBySnippetService = async (snippetId: string) => {
  return await Comment.find({ snippet: snippetId })
    .populate("author", "name email")
    .sort({ createdAt: -1 });
};
