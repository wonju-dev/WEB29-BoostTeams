import { Request, Response } from 'express';
import ChatRoomService from '@src/services/chat-room-service';

const ChatController = {
	async createChatRoom(req: Request, res: Response) {
		try {
			const chatRoomInfo = req.body;
			const newChatRoomInfo = await ChatRoomService.getInstance().createChatRoom(chatRoomInfo);
			res.json(newChatRoomInfo);
		} catch (err) {
			res.sendStatus(409);
		}
	}
};

export default ChatController;
