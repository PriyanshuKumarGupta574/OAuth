export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface Folder {
    _id: string;
    name: string;
    user: string | User;
}

export interface TeamMember {
    user: User;
    role: "editor" | "viewer";
    joinedAt: string;
}

export interface Team {
    _id: string;
    name: string;
    description?: string;
    owner: string | User;
    members: TeamMember[];
    snippets: string[];
    createdAt: string;
}

export interface Snippet {
    _id: string;
    title: string;
    code: string;
    language: string;
    tags: string[];
    visibility: "public" | "private" | "team";
    author: string | User;
    folder?: string | Folder | null;
    team?: string | Team | null;
    createdAt: string;
    updatedAt: string;
}

export interface SnippetData {
    title: string;
    code: string;
    language: string;
    tags: string[];
    visibility: "public" | "private" | "team";
    folder?: string | null;
    team?: string | null;
}

export interface UserStats {
    totalSnippets: number;
    totalViews: number;
    totalForks: number;
    totalComments: number;
    mostViewed: {
        id: string;
        title: string;
        views: number;
    } | null;
}

export interface SnippetFilters {
    tag?: string;
    language?: string;
    search?: string;
    author?: string;
    startDate?: string;
    endDate?: string;
    teamId?: string;
    page?: number;
}
