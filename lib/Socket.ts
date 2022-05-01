import { Server } from 'socket.io';
import http from 'http';
import Chat from '../types/Chat';
import mongo from '../lib/mongo-client';

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
				socket.on('send-chat', async (chat: Chat) => {
					await mongo.connect();
					const db = mongo.db('socif');
					const chats = db.collection('chats');
					await chats.insertOne(chat);
					await mongo.close();
					socket.broadcast.emit('recv-chat', chat);
				});
			});
		}

		return Socket._io;
	}
}
