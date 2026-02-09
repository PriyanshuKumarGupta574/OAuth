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
import { asyncHandler, handleError } from "../../common/utils/error.handler";
import { getUserId, getParamId } from "../../common/helper/request.helper";

export const createTeam = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Team name is required" });
    }

    const team = await createTeamService(getUserId(req), name, description);
    res.status(201).json(team);
}, (res, error) => handleError(res, error, "Failed to create team"));

export const getMyTeams = asyncHandler(async (req: Request, res: Response) => {
    const teams = await getTeamsForUserService(getUserId(req));
    res.json(teams);
}, (res, error) => handleError(res, error, "Failed to fetch teams"));

export const getTeamById = asyncHandler(async (req: Request, res: Response) => {
    const team = await getTeamByIdService(getParamId(req), getUserId(req));
    res.json(team);
}, (res, error) => handleError(res, error, "Access denied", 403));

export const addMember = asyncHandler(async (req: Request, res: Response) => {
    const { email, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found with this email" });
    }

    const team = await addMemberService(
        getParamId(req),
        getUserId(req),
        user._id.toString(),
        role || "viewer"
    );
    res.json(team);
}, (res, error) => handleError(res, error, "Failed to add member", 400));

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
    const team = await removeMemberService(
        getParamId(req),
        getUserId(req),
        req.params.memberId as string
    );
    res.json(team);
}, (res, error) => handleError(res, error, (error as Error).message, 400));

export const leaveTeam = asyncHandler(async (req: Request, res: Response) => {
    const userId = getUserId(req);

    await removeMemberService(getParamId(req), userId, userId);
    res.json({ message: "Left team successfully" });
}, (res, error) => handleError(res, error, (error as Error).message, 400));

export const updateMemberRole = asyncHandler(async (req: Request, res: Response) => {
    const { role } = req.body;

    const team = await updateMemberRoleService(
        getParamId(req),
        getUserId(req),
        req.params.memberId as string,
        role
    );
    res.json(team);
}, (res, error) => handleError(res, error, (error as Error).message, 400));

