import api from "./api";

export const createFolder = (data: { name: string }) =>
  api.post("/folders", data);

export const getFolders = () =>
  api.get("/folders");

export const moveSnippetToFolder = (
  snippetId: string,
  folderId: string
) =>
  api.put(`/folders/move/${snippetId}/${folderId}`);

export const deleteFolder = (id: string) =>
  api.delete(`/folders/${id}`);


export const getFolderById = (id: string) =>
  api.get(`/folders/${id}`);

export const getFolderWithSnippets = (folderId: string) =>
  api.get(`/snippets/folder/${folderId}`);


