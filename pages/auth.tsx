import { FC, FormEvent, ReactNode, useState, useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const FormField: FC<{ name: string; children: ReactNode }> = ({
	name,
	children,
}) => {
	return (
		<>
			<label htmlFor={name}>{children}</label>
			<input className='px-2 text-black' type="text" name={name} id={name} />
		</>
	);
};

const Auth: NextPage = () => {
	const [currentTabLogin, setCurrentTabLogin] = useState(true);
	const errorRef = useRef<HTMLSpanElement>(null);
	const router = useRouter();
	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const isLogin = (e.currentTarget.querySelector('#type') as HTMLInputElement).value === 'login';
		const fd = new FormData(e.currentTarget);
		const body: {[key: string]: string} = { };
		fd.forEach((v, k) => k !== 'type' && (body[k] = v.toString()));
		const url = isLogin ?
			'/api/users/login' :
			'/api/users/register';
		const fetchResults = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (!fetchResults.ok) {
			const errorText = isLogin ?
				'User tidak ditemukan atau password salah.' :
				'User gagal didaftarkan.';
			if (errorRef.current) {
				errorRef.current.innerText = errorText;
			} else {
				alert(errorText);

			}
			return;
		}
		if (errorRef.current)
			errorRef.current.innerText = '';
		const results = await fetchResults.json();
		document.cookie = `token=${results.token}`;
		router.push('/');
	};
	return (
		<div className='flex justify-between min-h-screen w-[100vw]'>
			<div className='bg-gray-500 flex flex-col items-center justify-center m-auto pb-12 px-12 rounded-xl w-96'>
				<div className='grid grid-cols-2 mb-8 w-full'>
					<button className={`${currentTabLogin ? 'bg-black' : ''} rounded-b-xl`} onClick={() => setCurrentTabLogin(true)}>Login</button>
					<button className={`${currentTabLogin ? '' : 'bg-black'} rounded-b-xl`} onClick={() => setCurrentTabLogin(false)}>Register</button>
				</div>
				{(currentTabLogin && (
					<form className='auth-form' onSubmit={submitHandler} action="/api/users/login" method="POST">
						<FormField name="username">username</FormField>
						<FormField name="password">password</FormField>
						<button className='bg-black py-2 rounded-xl' type="submit">Login</button>
						<input type="hidden" id="type" name="type" value="login" />
					</form>
				)) || (
					<form className='auth-form' onSubmit={submitHandler} action="/api/users/register" method="POST">
						<FormField name="name">name</FormField>
						<FormField name="username">username</FormField>
						<FormField name="password">password</FormField>
						<button className='bg-black py-2 rounded-xl' type="submit">Register</button>
						<input type="hidden" id="type" name="type" value="register" />
					</form>
				)}
				<span ref={errorRef} />
			</div>
		</div>
	);
};

export default Auth;
