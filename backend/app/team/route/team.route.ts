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


router.use(authMiddleware);

router.post("/", createTeam);
router.get("/", getMyTeams);
router.get("/:id", getTeamById);


router.post("/:id/members", addMember);
router.delete("/:id/members/:memberId", removeMember);
router.post("/:id/leave", leaveTeam); 
router.put("/:id/members/:memberId", updateMemberRole);

export default router;
