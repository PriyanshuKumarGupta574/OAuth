import { Request, Response } from "express";
import User from "../../auth/schemas/user.schema";
import { getGists, getGistById, createGist } from "../../common/services/github.service";
import { createSnippetService, getSnippetByIdService } from "../services/snippet.service";

export const listGists = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        // We need to fetch the user with githubAccessToken selected
        const user = await User.findById(userId).select("+githubAccessToken");

        if (!user || !user.githubAccessToken) {
            return res.status(400).json({ message: "GitHub not connected" });
        }

        const gists = await getGists(user.githubAccessToken);
        // Transform to simplified format
        const simplified = gists.map((g: any) => ({
            id: g.id,
            description: g.description || "No description",
            html_url: g.html_url,
            files: Object.keys(g.files),
            created_at: g.created_at
        }));

        res.json(simplified);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const importGist = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
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
            author: userId,
        });

        res.status(201).json(snippet);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const exportGist = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const id = req.params.id as string; // snippet id
        const user = await User.findById(userId).select("+githubAccessToken");

        if (!user || !user.githubAccessToken) {
            return res.status(400).json({ message: "GitHub not connected" });
        }

        const snippet = await getSnippetByIdService(id, userId);

        const gist = await createGist(user.githubAccessToken, snippet);

        res.json({ message: "Exported successfully", html_url: gist.html_url });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
