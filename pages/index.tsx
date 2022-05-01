import { FormEvent, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

const Home: NextPage = () => {
	const onChange = (e: FormEvent<HTMLInputElement>) => {
		setInput(e.currentTarget.value);
		socket.emit('input-change', e.currentTarget.value);
	};

	const router = useRouter();

	const [input, setInput] = useState('');

	useEffect(() => {
		fetch('/api/socket').then(() => {
			socket = io();

			socket.on('connect', () => {
				console.log('connected');
			});

			socket.on('input-change', setInput);
		});
	}, []);

	useEffect(() => {
		const jwt = document.cookie
			.split('; ')
			.map((cookie) => cookie.split('='))
			.filter((cp) => cp[0] === 'token');
		if (jwt.length === 0) {
			router.replace('/auth');
		}
	}, [router]);

	return (
		<main>
			<form>
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
