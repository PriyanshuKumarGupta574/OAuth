import Snippet, { ISnippet } from "../schema/snippet.schema";

/**
 * Track a view for a snippet
 */
export const trackViewService = async (snippetId: string) => {
    const snippet = await Snippet.findByIdAndUpdate(
        snippetId,
        {
            $inc: { views: 1 },
            lastViewedAt: new Date(),
        },
        { new: true }
    );

    if (snippet) {
        // Recalculate trending score
        await calculateAndUpdateTrendingScore(snippet._id.toString());
    }

    return snippet;
};

/**
 * Calculate trending score for a snippet
 * Formula: (views * 0.5 + forks * 2 + commentCount * 1.5) / daysSinceCreation
 */
export const calculateTrendingScore = (snippet: ISnippet): number => {
    const now = Date.now();
    const createdAt = new Date(snippet.createdAt).getTime();
    const daysSinceCreation = Math.max(
        (now - createdAt) / (1000 * 60 * 60 * 24),
        1
    );

    const views = snippet.views || 0;
    const forks = snippet.forks || 0;
    const commentCount = snippet.commentCount || 0;

    const score =
        (views * 0.5 + forks * 2 + commentCount * 1.5) / daysSinceCreation;

    return Math.round(score * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate and update trending score for a snippet
 */
export const calculateAndUpdateTrendingScore = async (snippetId: string) => {
    const snippet = await Snippet.findById(snippetId);
    if (!snippet) return null;

    const score = calculateTrendingScore(snippet);

    return await Snippet.findByIdAndUpdate(
        snippetId,
        { trendingScore: score },
        { new: true }
    );
};

/**
 * Get trending snippets
 */
export const getTrendingSnippetsService = async (limit: number = 10) => {
    return await Snippet.find({ visibility: "public" })
        .sort({ trendingScore: -1 })
        .limit(limit)
        .populate("author", "name email")
        .select("title language tags views forks commentCount trendingScore createdAt");
};

/**
 * Get user's snippet analytics
 */
export const getUserAnalyticsService = async (userId: string) => {
    const snippets = await Snippet.find({ author: userId });

    const totalViews = snippets.reduce((sum, s) => sum + (s.views || 0), 0);
    const totalForks = snippets.reduce((sum, s) => sum + (s.forks || 0), 0);
    const totalComments = snippets.reduce(
        (sum, s) => sum + (s.commentCount || 0),
        0
    );

    const mostViewed = snippets.sort((a, b) => (b.views || 0) - (a.views || 0))[0];

    return {
        totalSnippets: snippets.length,
        totalViews,
        totalForks,
        totalComments,
        mostViewed: mostViewed
            ? {
                id: mostViewed._id,
                title: mostViewed.title,
                views: mostViewed.views,
            }
            : null,
    };
};

/**
 * Increment fork count
 */
export const incrementForkCountService = async (snippetId: string) => {
    const snippet = await Snippet.findByIdAndUpdate(
        snippetId,
        { $inc: { forks: 1 } },
        { new: true }
    );

    if (snippet) {
        await calculateAndUpdateTrendingScore(snippet._id.toString());
    }

    return snippet;
};

/**
 * Update comment count
 */
export const updateCommentCountService = async (snippetId: string) => {
    // Dynamically require to avoid circular dependency
    const Comment = require("../schema/comment.schema").default;
    const count = await Comment.countDocuments({ snippet: snippetId });

    const snippet = await Snippet.findByIdAndUpdate(
        snippetId,
        { commentCount: count },
        { new: true }
    );

    if (snippet) {
        await calculateAndUpdateTrendingScore(snippet._id.toString());
    }

    return snippet;
};
