import { Request, Response } from "express";
import {
    trackViewService,
    getTrendingSnippetsService,
    getUserAnalyticsService,
} from "../services/analytics.service";

/**
 * Track a view for a snippet
 */
export const trackView = async (req: Request, res: Response) => {
    try {
        const snippetId = req.params.id as string;
        const snippet = await trackViewService(snippetId);

        if (!snippet) {
            return res.status(404).json({ message: "Snippet not found" });
        }

        res.json({ message: "View tracked", views: snippet.views });
    } catch (error: unknown) {
        const err = error as Error;
        console.error("Track view error:", err.message);
        res.status(500).json({ message: "Failed to track view" });
    }
};

/**
 * Get trending snippets
 */
export const getTrendingSnippets = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const snippets = await getTrendingSnippetsService(limit);

        res.json(snippets);
    } catch (error: unknown) {
        const err = error as Error;
        console.error("Get trending snippets error:", err.message);
        res.status(500).json({ message: "Failed to get trending snippets" });
    }
};

/**
 * Get user's snippet analytics
 */
export const getUserAnalytics = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const analytics = await getUserAnalyticsService(userId as string);

        res.json(analytics);
    } catch (error: unknown) {
        const err = error as Error;
        console.error("Get user analytics error:", err.message);
        res.status(500).json({ message: "Failed to get analytics" });
    }
};
