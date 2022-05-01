import { FormEvent, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import io, { Socket } from 'socket.io-client';

const Home: NextPage = () => {
	const [input, setInput] = useState('');
	const [socket, setSocket] = useState<Socket | null>(null);

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

		let newSocket: Socket;
		fetch('/api/socket').then(() => {
			newSocket = io();
			setSocket(newSocket);

			newSocket.on('connect', () => {
				console.log('connected');
			});

			newSocket.on('recv-chat', (msg) => {
				console.log(msg);
			});
		});
	}, []);

	const onChange = (e: FormEvent<HTMLInputElement>) => {
		setInput(e.currentTarget.value);
	};

	const sendChat = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		socket!.emit('send-chat', {
			uid: window.localStorage.id,
			createdAt: new Date(),
			text: input,
		});
		setInput('');
	};

	return (
		<main>
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
			<span>Blah is typing</span>
		</main>
	);
};

export default Home;
