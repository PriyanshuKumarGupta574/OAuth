import api from "./api";

export const getComments = (snippetId: string) =>
  api.get(`/snippet/${snippetId}/comments`);

export const addComment = (snippetId: string, text: string) =>
  api.post(`/snippet/${snippetId}/comments`, { text });
