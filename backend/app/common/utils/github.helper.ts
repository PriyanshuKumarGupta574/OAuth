import { Response } from "express";
import User, { IUser } from "../../auth/schemas/user.schema";
import { Types } from "mongoose";

interface GitHubTokenResult {
    token: string;
    user: IUser;
}


export const getGitHubToken = async (
    userId: string | Types.ObjectId,
    res: Response
): Promise<GitHubTokenResult | null> => {
    const user = await User.findById(userId).select("+githubAccessToken");

    if (!user || !user.githubAccessToken) {
        res.status(400).json({ message: "GitHub not connected" });
        return null;
    }

    return {
        token: user.githubAccessToken,
        user
    };
};
