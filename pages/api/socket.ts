import { NextApiRequest, NextApiResponse } from 'next';
import Socket from '../../lib/Socket';
import Chat from '../../types/Chat';

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
	// JS magic, babyyyyyyyyyyyyyyyyyyyyyyyyyy
	// @ts-ignore
	Socket.server = req.socket.server;
	const io = Socket.io!;
	io.on('connection', (socket) => {
		socket.on('send-chat', (chat: Chat) => {
			socket.broadcast.emit('recv-chat', chat);
		});
	});
	res.end();
};

export default SocketHandler;
