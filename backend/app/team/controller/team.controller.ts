import { Request, Response } from "express";
import {
    createTeamService,
    getTeamsForUserService,
    getTeamByIdService,
    addMemberService,
    removeMemberService,
    updateMemberRoleService,
} from "../services/team.service";
import User from "../../auth/schemas/user.schema";

export const createTeam = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const userId = (req as any).user._id;

        if (!name) {
            return res.status(400).json({ message: "Team name is required" });
        }

        const team = await createTeamService(userId, name, description);
        res.status(201).json(team);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyTeams = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const teams = await getTeamsForUserService(userId);
        res.json(teams);
    } catch (error: any) {
        res.status(500).json({ message: "Failed to fetch teams" });
    }
};

export const getTeamById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user._id;
        const team = await getTeamByIdService(id, userId);
        res.json(team);
    } catch (error: any) {
        res.status(403).json({ message: error.message });
    }
};

export const addMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { email, role } = req.body;
        const requesterId = (req as any).user._id;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }

        const team = await addMemberService(id, requesterId, user._id.toString(), role || "viewer");
        res.json(team);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const removeMember = async (req: Request, res: Response) => {
    try {
        const { id, memberId } = req.params;
        const requesterId = (req as any).user._id;

        const team = await removeMemberService(id, requesterId, memberId);
        res.json(team);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const leaveTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const requesterId = (req as any).user._id;

        // Member removing themselves
        const team = await removeMemberService(id, requesterId, requesterId);
        res.json({ message: "Left team successfully" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateMemberRole = async (req: Request, res: Response) => {
    try {
        const { id, memberId } = req.params;
        const { role } = req.body;
        const requesterId = (req as any).user._id;

        const team = await updateMemberRoleService(id, requesterId, memberId, role);
        res.json(team);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
