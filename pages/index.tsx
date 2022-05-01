import { FormEvent, useEffect, useState, useRef } from 'react';
import type { NextPage } from 'next';
import io, { Socket } from 'socket.io-client';
import Chat from '../types/Chat';
import ChatBubble from '../components/ChatBubble';

const Home: NextPage = () => {
	const [input, setInput] = useState('');
	const [socket, setSocket] = useState<Socket | null>(null);
	const [chats, setChats] = useState<Chat[]>([]);
	const [newChat, setNewChat] = useState<Chat>();

	useEffect(() => {
		fetch('/api/users/decode', {
			headers: {
				authorization: `Bearer ${document.cookie
					.split(' ;')
					.filter((c) => c.startsWith('token'))
					.map((c) => c.split('='))[0][1]}`,
			},
		})
			.then(e => e.json())
			.then(decoded => {
				for (const k in decoded)
					window.localStorage.setItem(k, decoded[k]);
			});

		fetch('/api/socket');
	}, []);
	useEffect(() => {
		if (!socket) {
			setSocket(io());
		}

		if (socket) {
			socket.on('recv-chat', (chat: Chat) => {
				setNewChat(chat);
			});
		}
	}, [socket]);
	useEffect(() => newChat && setChats([...chats, newChat]), [newChat]);

	const onChange = (e: FormEvent<HTMLInputElement>) => {
		setInput(e.currentTarget.value);
	};

	const sendChat = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const chat = {
			content: input,
			senderName: window.localStorage.name,
			username: window.localStorage.user,
			createdAt: new Date(),
		};
		socket!.emit('send-chat', chat);
		setChats([...chats, chat]);
		setInput('');
	};

	return (
		<main>
			<div>
				{chats.map((chat, i) => <ChatBubble {...chat} key={i} />)}
			</div>
			<form onSubmit={sendChat}>
				<input
					className="border-black border-2 px-2"
					type="text"
					name="test"
					id="test"
					value={input}
					placeholder="Type something"
					onChange={onChange}
				/>
				<button type="submit">Submit</button>
			</form>
		</main>
	);
};

export default Home;
