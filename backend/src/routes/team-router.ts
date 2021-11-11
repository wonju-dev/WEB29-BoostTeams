import express from 'express';
import TeamController from '../controllers/team-contorller';
import { authenticateToken } from '../middlewares/token';
const router = express.Router();

router.post('/create', authenticateToken, TeamController.create); // 팀 생성, [team, team-user]
router.delete('/', authenticateToken, TeamController.delete); // 팀 삭제, [team]
router.put('/', authenticateToken, TeamController.update); // 팀 수정 [team]
router.get('/', authenticateToken, TeamController.read); // 팀, 초대 목록 [team-user]

router.post('/invite', authenticateToken, TeamController.invite); // 초대 전송 [team-user]
router.post('/invite/response', authenticateToken, TeamController.acceptInvitation); // 초대 수락 [team-user]
router.delete('/invite/response', authenticateToken, TeamController.declineInvitation); // 초대 거절 [team-user]

export default router;