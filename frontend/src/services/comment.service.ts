import api from "./api";

export interface Comment {
  _id: string;
  snippet: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  text: string;
  parentComment?: string;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export const getComments = (snippetId: string) =>
  api.get<Comment[]>(`/snippets/${snippetId}/comments`);

export const addComment = (
  snippetId: string,
  text: string,
  parentCommentId?: string
) =>
  api.post(`/snippets/${snippetId}/comments`, { text, parentCommentId });

