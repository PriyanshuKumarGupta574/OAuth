import Team, { ITeam, PopulatedUser } from "../schema/team.schema";
import mongoose from "mongoose";

export const createTeamService = async (
    userId: string,
    name: string,
    description?: string
) => {
    const team = await Team.create({
        name,
        description,
        owner: new mongoose.Types.ObjectId(userId),
        members: [], // Owner is separate from members list for clarity, or implied as super-admin
    });
    return team;
};

export const getTeamsForUserService = async (userId: string) => {
    // Find teams where user is owner OR a member
    return await Team.find({
        $or: [{ owner: new mongoose.Types.ObjectId(userId) }, { "members.user": new mongoose.Types.ObjectId(userId) }],
    })
        .populate("owner", "name email")
        .populate("members.user", "name email")
        .sort({ createdAt: -1 });
};

export const getTeamByIdService = async (teamId: string, userId: string) => {
    const team = await Team.findById(teamId)
        .populate("owner", "name email")
        .populate("members.user", "name email");

    if (!team) throw new Error("Team not found");

    // Check if user has access
    const isOwner = team.owner._id.toString() === userId;
    const isMember = team.members.some(
        (m) => (m.user as PopulatedUser)._id.toString() === userId
    );

    if (!isOwner && !isMember) {
        throw new Error("Unauthorized access to team");
    }

    return team;
};

export const addMemberService = async (
    teamId: string,
    requesterId: string,
    newMemberId: string,
    role: "editor" | "viewer"
) => {
    const team = await Team.findById(teamId);
    if (!team) throw new Error("Team not found");

    // Only owner can add members
    if (team.owner.toString() !== requesterId) {
        throw new Error("Only team owner can add members");
    }

    // Check if already a member
    const exists = team.members.some(
        (m) => m.user.toString() === newMemberId
    );
    if (exists) throw new Error("User is already a member");

    if (team.owner.toString() === newMemberId) {
        throw new Error("User is the owner of the team");
    }

    team.members.push({ user: new mongoose.Types.ObjectId(newMemberId), role });
    await team.save();

    return await team.populate("members.user", "name email");
};

export const removeMemberService = async (
    teamId: string,
    requesterId: string,
    memberIdToRemove: string
) => {
    const team = await Team.findById(teamId);
    if (!team) throw new Error("Team not found");

    // Only owner can remove members, or member removing themselves (leave team)
    if (
        team.owner.toString() !== requesterId &&
        requesterId !== memberIdToRemove
    ) {
        throw new Error("Unauthorized to remove member");
    }

    team.members = team.members.filter(
        (m) => m.user.toString() !== memberIdToRemove
    );

    await team.save();
    return team;
};

export const updateMemberRoleService = async (
    teamId: string,
    requesterId: string,
    memberId: string,
    newRole: "editor" | "viewer"
) => {
    const team = await Team.findById(teamId);
    if (!team) throw new Error("Team not found");

    if (team.owner.toString() !== requesterId) {
        throw new Error("Only owner can update roles");
    }

    const member = team.members.find(
        (m) => m.user.toString() === memberId
    );

    if (!member) throw new Error("Member not found");

    member.role = newRole;
    await team.save();
    return team;
};
