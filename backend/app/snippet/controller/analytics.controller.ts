import { Request, Response } from "express";
import {
    trackViewService,
    getTrendingSnippetsService,
    getUserAnalyticsService,
} from "../services/analytics.service";
import { catchError } from "../../common/middleware/catch-error.middleware";

export const trackView = catchError(async (req: Request, res: Response) => {
    const snippetId = req.params.id as string;
    const snippet = await trackViewService(snippetId);

    if (!snippet) {
        res.status(404);
        throw new Error("Snippet not found");
    }

    res.json({ message: "View tracked", views: snippet.views });
});

export const getTrendingSnippets = catchError(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const snippets = await getTrendingSnippetsService(limit);

    res.json(snippets);
});

export const getUserAnalytics = catchError(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const analytics = await getUserAnalyticsService(userId as string);

    res.json(analytics);
});

