import { Request, Response } from "express";
import {
    trackViewService,
    getTrendingSnippetsService,
    getUserAnalyticsService,
} from "../services/analytics.service";
import { handleError } from "../../common/utils/error.handler";

export const trackView = async (req: Request, res: Response) => {
    try {
        const snippetId = req.params.id as string;
        const snippet = await trackViewService(snippetId);

        if (!snippet) {
            return res.status(404).json({ message: "Snippet not found" });
        }

        res.json({ message: "View tracked", views: snippet.views });
    } catch (error: unknown) {
        handleError(res, error, "Failed to track view");
    }
};


export const getTrendingSnippets = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const snippets = await getTrendingSnippetsService(limit);

        res.json(snippets);
    } catch (error: unknown) {
        handleError(res, error, "Failed to get trending snippets");
    }
};


export const getUserAnalytics = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const analytics = await getUserAnalyticsService(userId as string);

        res.json(analytics);
    } catch (error: unknown) {
        handleError(res, error, "Failed to get analytics");
    }
};
