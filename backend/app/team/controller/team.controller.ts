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
import { getUserId, getParamId } from "../../common/helper/request.helper";
import { catchError } from "../../common/middleware/catch-error.middleware";

export const createTeam = catchError(async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
        res.status(400);
        throw new Error("Team name is required");
    }

    const team = await createTeamService(getUserId(req), name, description);
    res.status(201).json(team);
});

export const getMyTeams = catchError(async (req: Request, res: Response) => {
    const teams = await getTeamsForUserService(getUserId(req));
    res.json(teams);
});

export const getTeamById = catchError(async (req: Request, res: Response) => {
    const team = await getTeamByIdService(getParamId(req), getUserId(req));
    res.json(team);
});

export const addMember = catchError(async (req: Request, res: Response) => {
    const { email, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User not found with this email");
    }

    const team = await addMemberService(
        getParamId(req),
        getUserId(req),
        user._id.toString(),
        role || "viewer"
    );
    res.json(team);
});

export const removeMember = catchError(async (req: Request, res: Response) => {
    const team = await removeMemberService(
        getParamId(req),
        getUserId(req),
        req.params.memberId as string
    );
    res.json(team);
});

export const leaveTeam = catchError(async (req: Request, res: Response) => {
    const userId = getUserId(req);

    await removeMemberService(getParamId(req), userId, userId);
    res.json({ message: "Left team successfully" });
});

export const updateMemberRole = catchError(async (req: Request, res: Response) => {
    const { role } = req.body;

    const team = await updateMemberRoleService(
        getParamId(req),
        getUserId(req),
        req.params.memberId as string,
        role
    );
    res.json(team);
});


