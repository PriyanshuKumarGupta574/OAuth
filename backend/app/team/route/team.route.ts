import { Router } from "express";
import {
    createTeam,
    getMyTeams,
    getTeamById,
    addMember,
    removeMember,
    leaveTeam,
    updateMemberRole,
} from "../controller/team.controller";
import { authMiddleware } from "../../common/middleware/auth.middleware";

const router = Router();

// Apply auth middleware to all team routes
router.use(authMiddleware);

router.post("/", createTeam);
router.get("/", getMyTeams);
router.get("/:id", getTeamById);

// Member management
router.post("/:id/members", addMember);
router.delete("/:id/members/:memberId", removeMember); // Remove other
router.post("/:id/leave", leaveTeam); // Leave team
router.put("/:id/members/:memberId", updateMemberRole);

export default router;
