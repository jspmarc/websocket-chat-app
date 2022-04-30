import { Server } from 'socket.io';
import http from 'http';

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
		}

		return Socket._io;
	}
}
