import { Response } from 'express';
import TeamUserService from '../services/team-user-service';
import TeamService from '../services/team-service';
import UserService from '../services/user-service';

const TeamController = {
	async read(req: any, res: Response) {
		try {
			const userId = req.user_id;
			const teams = await TeamUserService.getInstance().read(userId);
			res.status(200).send(teams);
		} catch (err) {
			res.status(400).send(err);
		}
	},

	async create(req: any, res: Response) {
		try {
			const userId = req.user_id;
			const teamId = await TeamService.getInstance().create(req.body);
			await TeamUserService.getInstance().create(userId, teamId);
			res.sendStatus(200);
		} catch (err) {
			res.sendStatus(400);
		}
	},

	async delete(req: any, res: Response) {
		try {
			const teamId = req.body.team_id;
			await TeamService.getInstance().delete(teamId);
			res.sendStatus(200);
		} catch (err) {
			res.sendStatus(400);
		}
	},

	async update(req: any, res: Response) {
		try {
			await TeamService.getInstance().update(req.body);
			res.sendStatus(200);
		} catch (err) {
			res.sendStatus(400);
		}
	},

	async invite(req: any, res: Response) {
		try {
			const { userEmail, team_id } = req.body;
			const userInfo = await UserService.getInstance().getUserByEmail(userEmail);
			const userId = userInfo.user_id;
			await TeamUserService.getInstance().create(userId, team_id);
			res.sendStatus(200);
		} catch (err) {
			res.sendStatus(400);
		}
	},

	async acceptInvitation(req: any, res: Response) {
		try {
			const userId = req.user_id;
			const teamId = req.body.team_id;
			await TeamUserService.getInstance().update(userId, teamId);
			res.sendStatus(200);
		} catch (err) {
			res.sendStatus(400);
		}
	},

	async declineInvitation(req: any, res: Response) {
		try {
			const userId = req.user_id;
			const teamId = req.body.team_id;
			await TeamUserService.getInstance().delete(userId, teamId);
			res.sendStatus(200);
		} catch (err) {
			res.sendStatus(400);
		}
	}
};

export default TeamController;