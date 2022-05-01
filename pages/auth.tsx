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
			<input type="text" name={name} id={name} />
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
		<>
			<div>
				<button onClick={() => setCurrentTabLogin(true)}>Login</button>
				<button onClick={() => setCurrentTabLogin(false)}>Register</button>
			</div>
			{(currentTabLogin && (
				<form onSubmit={submitHandler} action="/api/users/login" method="POST">
					<FormField name="username">username</FormField>
					<FormField name="password">password</FormField>
					<button type="submit">Login</button>
					<input type="hidden" id="type" name="type" value="login" />
				</form>
			)) || (
				<form onSubmit={submitHandler} action="/api/users/register" method="POST">
					<FormField name="name">name</FormField>
					<FormField name="username">username</FormField>
					<FormField name="password">password</FormField>
					<button type="submit">Register</button>
					<input type="hidden" id="type" name="type" value="register" />
				</form>
			)}
			<span ref={errorRef} />
		</>
	);
};

export default Auth;
