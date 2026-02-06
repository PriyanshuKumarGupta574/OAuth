import api from "./api";

export const trackSnippetView = (snippetId: string) =>
    api.post(`/snippets/${snippetId}/view`);

export const getTrendingSnippets = (limit: number = 10) =>
    api.get(`/snippets/trending/list?limit=${limit}`);

export const getUserAnalytics = () =>
    api.get(`/snippets/analytics/user`);
