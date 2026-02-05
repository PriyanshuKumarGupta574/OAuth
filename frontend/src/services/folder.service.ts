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

// import api from "./api";

// export const getFolders = () => api.get("/folders");

// export const createFolder = (name: string) =>
//   api.post("/folders", { name });
