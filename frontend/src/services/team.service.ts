import api from "./api";

export const createTeam = (name: string, description?: string) =>
    api.post("/teams", { name, description });

export const getMyTeams = () => api.get("/teams");

export const getTeamById = (id: string) => api.get(`/teams/${id}`);

export const addMember = (id: string, email: string, role: "editor" | "viewer") =>
    api.post(`/teams/${id}/members`, { email, role });

export const removeMember = (id: string, memberId: string) =>
    api.delete(`/teams/${id}/members/${memberId}`);

export const leaveTeam = (id: string) =>
    api.post(`/teams/${id}/leave`);

export const updateMemberRole = (
    id: string,
    memberId: string,
    role: "editor" | "viewer"
) => api.put(`/teams/${id}/members/${memberId}`, { role });
