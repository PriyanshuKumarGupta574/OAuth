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
        const userId = req.user!._id;

        if (!name) {
            return res.status(400).json({ message: "Team name is required" });
        }

        const team = await createTeamService(userId.toString(), name, description);
        res.status(201).json(team);
    } catch (error: unknown) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

export const getMyTeams = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const teams = await getTeamsForUserService(userId.toString());
        res.json(teams);
    } catch (error: unknown) {
        res.status(500).json({ message: "Failed to fetch teams" });
    }
};

export const getTeamById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const userId = req.user!._id;
        const team = await getTeamByIdService(id, userId.toString());
        res.json(team);
    } catch (error: unknown) {
        const err = error as Error;
        res.status(403).json({ message: err.message });
    }
};

export const addMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { email, role } = req.body;
        const requesterId = req.user!._id;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }

        const team = await addMemberService(id, requesterId.toString(), user._id.toString(), role || "viewer");
        res.json(team);
    } catch (error: unknown) {
        const err = error as Error;
        res.status(400).json({ message: err.message });
    }
};

export const removeMember = async (req: Request, res: Response) => {
    try {
        const { id, memberId } = req.params as { id: string; memberId: string };
        const requesterId = req.user!._id;

        const team = await removeMemberService(id, requesterId.toString(), memberId);
        res.json(team);
    } catch (error: unknown) {
        const err = error as Error;
        res.status(400).json({ message: err.message });
    }
};

export const leaveTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const requesterId = req.user!._id;

        await removeMemberService(id, requesterId.toString(), requesterId.toString());
        res.json({ message: "Left team successfully" });
    } catch (error: unknown) {
        const err = error as Error;
        res.status(400).json({ message: err.message });
    }
};

export const updateMemberRole = async (req: Request, res: Response) => {
    try {
        const { id, memberId } = req.params as { id: string; memberId: string };
        const { role } = req.body;
        const requesterId = req.user!._id;

        const team = await updateMemberRoleService(id, requesterId.toString(), memberId, role);
        res.json(team);
    } catch (error: unknown) {
        const err = error as Error;
        res.status(400).json({ message: err.message });
    }
};
