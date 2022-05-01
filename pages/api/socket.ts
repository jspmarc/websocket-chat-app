import { NextApiRequest, NextApiResponse } from 'next';
import Socket from '../../lib/Socket';
import Chat from '../../types/Chat';

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
	// JS magic, babyyyyyyyyyyyyyyyyyyyyyyyyyy
	// @ts-ignore
	Socket.server = req.socket.server;
	Socket.io;
	res.end();
};

export default SocketHandler;
