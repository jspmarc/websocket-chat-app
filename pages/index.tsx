import { FormEvent, useEffect, useState, useRef } from 'react';
import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import io, { Socket } from 'socket.io-client';
import Chat from '../types/Chat';
import ChatBubble from '../components/ChatBubble';
import mongo from '../lib/mongo-client';

const Home: NextPage = ({ chatsRes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const [input, setInput] = useState('');
	const [socket, setSocket] = useState<Socket | null>(null);
	const [chats, setChats] = useState<Chat[]>(chatsRes);
	const [newChat, setNewChat] = useState<Chat>();
	const dummyScrollerRef = useRef<HTMLDivElement>(null);

	//@ts-ignore
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

		fetch('/api/socket').then(() => {
			const newSocket = io();
			setSocket(newSocket);
			newSocket.on('recv-chat', (chat: Chat) => {
				setNewChat(chat);
			});
		});
		dummyScrollerRef.current?.scrollIntoView({ behavior: 'smooth' });

		return () => socket?.removeAllListeners();
	}, []);
	useEffect(() => newChat && setChats([...chats, newChat]), [newChat]);

	const onChange = (e: FormEvent<HTMLInputElement>) => {
		if (e.currentTarget.value.length <= 128)
			setInput(e.currentTarget.value);
	};

	const sendChat = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const chat = {
			content: input,
			senderName: localStorage.name,
			username: localStorage.user,
			createdAt: new Date().toUTCString(),
			uid: localStorage.id,
		};
		socket!.emit('send-chat', chat);
		setChats([...chats, chat]);
		setInput('');
		dummyScrollerRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<div className='flex flex-col gap-4 h-[80vh] items-center m-auto min-h-screen overflow-hidden p-12 w-[80vw]'>
			<div className='border-4 border-white flex-grow overflow-auto p-8 self-stretch'>
				{chats.map((chat, i) => <ChatBubble {...chat} fromSender={false} key={i} />)}
				<div className='invisible' ref={dummyScrollerRef} />
			</div>
			<form className='flex flex-col items-center justify-center mt-auto' onSubmit={sendChat}>
				<input
					className="border-black border-2 px-2 text-black"
					type='text'
					name="test"
					id="test"
					value={input}
					placeholder="Type your message (max 128 chars)"
					minLength={1}
					maxLength={128}
					size={140}
					onChange={onChange}
				/>
				<button type="submit">Send <span className='text-3xl -translate-y-8 relative'>&gt;</span></button>
			</form>
			<Link href='/logout' passHref={false}>
				<a className='bg-black rounded-xl px-8 py-2'>Logout</a>
			</Link>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => {
	await mongo.connect();
	const db = mongo.db('socif');
	const chats = db.collection('chats');
	const chatsRes = await chats.find().toArray();

	return {
		props: {
			chatsRes: chatsRes.map(c => {
				return { ...c, _id: c._id.toString() };
			}),
		}
	};
};

export default Home;
