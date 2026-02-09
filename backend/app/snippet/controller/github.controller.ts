import { Request, Response } from "express";
import { getGists, getGistById, createGist, GistSnippet } from "../../common/services/github.service";
import { createSnippetService, getSnippetByIdService } from "../services/snippet.service";
import { getGitHubToken } from "../../common/utils/github.helper";
import { handleError } from "../../common/utils/error.handler";

interface GithubGist {
    id: string;
    description: string | null;
    html_url: string;
    files: { [key: string]: { filename: string; language: string; raw_url: string; content?: string } };
    created_at: string;
}

export const listGists = async (req: Request, res: Response) => {
    try {
        const tokenResult = await getGitHubToken(req.user!._id, res);
        if (!tokenResult) return;

        const gists = await getGists(tokenResult.token) as GithubGist[];

        const simplified = gists.map((g) => ({
            id: g.id,
            description: g.description || "No description",
            html_url: g.html_url,
            files: Object.keys(g.files),
            created_at: g.created_at
        }));

        res.json(simplified);
    } catch (error: unknown) {
        handleError(res, error, "Failed to fetch gists");
    }
};

export const importGist = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const { gistId } = req.body;

        const tokenResult = await getGitHubToken(userId, res);
        if (!tokenResult) return;

        const gist = await getGistById(gistId, tokenResult.token);

        const filename = Object.keys(gist.files)[0];
        const file = gist.files[filename];
        const language = file.language ? file.language.toLowerCase() : "text";

        const snippet = await createSnippetService({
            title: gist.description || filename,
            code: file.content,
            language: language,
            tags: ["imported-from-gist"],
            visibility: "private",
            author: userId as string,
        });

        res.status(201).json(snippet);
    } catch (error: unknown) {
        handleError(res, error, "Failed to import gist");
    }
};

export const exportGist = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const id = req.params.id as string;

        const tokenResult = await getGitHubToken(userId, res);
        if (!tokenResult) return;

        const snippet = await getSnippetByIdService(id, userId as string);

        const gistData: GistSnippet = {
            title: snippet.title,
            language: snippet.language,
            code: snippet.code
        };

        const gist = await createGist(tokenResult.token, gistData);

        res.json({ message: "Exported successfully", html_url: gist.html_url });
    } catch (error: unknown) {
        handleError(res, error, "Failed to export gist");
    }
};
