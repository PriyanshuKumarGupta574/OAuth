import { Request, Response } from "express";
import User from "../../auth/schemas/user.schema";
import { getGists, getGistById, createGist, GistSnippet } from "../../common/services/github.service";
import { createSnippetService, getSnippetByIdService } from "../services/snippet.service";

interface GithubGist {
    id: string;
    description: string | null;
    html_url: string;
    files: { [key: string]: { filename: string; language: string; raw_url: string; content?: string } };
    created_at: string;
}

export const listGists = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        // We need to fetch the user with githubAccessToken selected
        const user = await User.findById(userId).select("+githubAccessToken");

        if (!user || !user.githubAccessToken) {
            return res.status(400).json({ message: "GitHub not connected" });
        }

        const gists = await getGists(user.githubAccessToken) as GithubGist[];
        // Transform to simplified format
        const simplified = gists.map((g) => ({
            id: g.id,
            description: g.description || "No description",
            html_url: g.html_url,
            files: Object.keys(g.files),
            created_at: g.created_at
        }));

        res.json(simplified);
    } catch (error: unknown) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

export const importGist = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const { gistId } = req.body;
        const user = await User.findById(userId).select("+githubAccessToken");

        if (!user || !user.githubAccessToken) {
            return res.status(400).json({ message: "GitHub not connected" });
        }

        const gist = await getGistById(gistId, user.githubAccessToken);

        // Take the first file
        const filename = Object.keys(gist.files)[0];
        const file = gist.files[filename];
        const language = file.language ? file.language.toLowerCase() : "text";

        // Create snippet
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
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

export const exportGist = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const id = req.params.id as string; // snippet id
        const user = await User.findById(userId).select("+githubAccessToken");

        if (!user || !user.githubAccessToken) {
            return res.status(400).json({ message: "GitHub not connected" });
        }

        const snippet = await getSnippetByIdService(id, userId as string);

        const gistData: GistSnippet = {
            title: snippet.title,
            language: snippet.language,
            code: snippet.code
        };

        const gist = await createGist(user.githubAccessToken, gistData);

        res.json({ message: "Exported successfully", html_url: gist.html_url });
    } catch (error: unknown) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};
