import { FormEvent, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

const Home: NextPage = () => {
	const onChange = (e: FormEvent<HTMLInputElement>) => {
		setInput(e.currentTarget.value);
		socket.emit('input-change', e.currentTarget.value);
	};

	const [input, setInput] = useState('');

	useEffect(() => {
		(async () => {
			const fetchDecodeRes = await fetch('/api/users/decode', {
				headers: {
					authorization: `Bearer ${document.cookie
						.split(' ;')
						.filter((c) => c.startsWith('token'))
						.map((c) => c.split('='))[0][1]}`,
				},
			});
			const decoded = await fetchDecodeRes.json();
			for (const k in decoded) {
				window.localStorage.setItem(k, decoded[k]);
			}
			fetch('/api/socket').then(() => {
				socket = io();

				socket.on('connect', () => {
					console.log('connected');
				});

				socket.on('input-change', setInput);
			});
		})();
	}, []);

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
