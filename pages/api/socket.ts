import { NextApiRequest, NextApiResponse } from 'next';
import Socket from '../../lib/Socket';

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
	// JS magic, babyyyyyyyyyyyyyyyyyyyyyyyyyy
	// @ts-ignore
	Socket.server = req.socket.server;
	const io = Socket.io!;
	io.on('connection', (socket) => {
		socket.on('send-chat', (msg) => {
			console.log(msg);
			socket.broadcast.emit('recv-chat', msg);
		});
	});
	res.end();
};

export default SocketHandler;
