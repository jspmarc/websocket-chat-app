import { Server } from 'socket.io';
import http from 'http';
import Chat from '../types/Chat';

export default class Socket {
	private static _io: Server | null = null;
	private static _server: http.Server | null = null;

	public static set server(server: http.Server) {
		this._server = server;
	}

	public static get io() {
		if (!Socket._io) {
			if (!this._server) throw new Error('Server is not initialized');
			Socket._io = new Server(this._server);
			Socket._io.on('connection', (socket) => {
				socket.on('send-chat', (chat: Chat) => {
					console.log('broadcasting-chat', chat.content);
					socket.broadcast.emit('recv-chat', chat);
				});
			});
		}

		return Socket._io;
	}
}
