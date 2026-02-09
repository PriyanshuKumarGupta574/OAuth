import axios from "axios";

export const getGists = async (accessToken: string) => {
    const response = await axios.get("https://api.github.com/gists", {
        headers: {
            Authorization: `token ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
        },
    });
    return response.data;
};

export const getGistById = async (gistId: string, accessToken: string) => {
    const response = await axios.get(`https://api.github.com/gists/${gistId}`, {
        headers: {
            Authorization: `token ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
        },
    });
    return response.data;
};

export interface GistSnippet {
    title: string;
    language: string;
    code: string;
}

export const createGist = async (accessToken: string, snippet: GistSnippet) => {
    const files: { [key: string]: { content: string } } = {};
    const filename = `${snippet.title || 'snippet'}.${snippet.language === "javascript" ? "js" : snippet.language}`;
    files[filename] = { content: snippet.code };

    const response = await axios.post(
        "https://api.github.com/gists",
        {
            description: snippet.title,
            public: false, 
            files
        },
        {
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        }
    );
    return response.data;
};
