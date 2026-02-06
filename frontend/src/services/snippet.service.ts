import api from "./api";

export const createSnippet = (data: any) =>
  api.post("/snippets", data);



export const getSnippets = (
  tag?: string,
  language?: string,
  page: number = 1,
  search?: string,
  author?: string,
  startDate?: string,
  endDate?: string,
  teamId?: string
) => {
  return api.get("/snippets", {
    params: {
      tag,
      language,
      page,
      limit: 6,
      search,
      author,
      startDate,
      endDate,
      teamId,
    },
  });
};




export const getSnippetById = (id: string) =>
  api.get(`/snippets/${id}`);

export const getPublicSnippet = (id: string) =>
  api.get(`/snippets/public/${id}`);

export const getSnippetHistory = (id: string) =>
  api.get(`/snippets/${id}/history`);

export const restoreSnippetVersion = (versionId: string) =>
  api.post(`/snippets/restore/${versionId}`);

export const getSnippetsByFolder = (folderId: string) =>
  api.get(`/snippets/folder/${folderId}`);



export const forkSnippet = (id: string) =>
  api.post(`/snippets/${id}/fork`);


export const updateSnippet = (id: string, data: any) =>
  api.put(`/snippets/${id}`, data);

export const deleteSnippet = (id: string) => {
  return api.delete(`/snippets/${id}`);
};


