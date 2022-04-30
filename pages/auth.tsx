import { FC, ReactNode, useState } from 'react';
import type { NextPage } from 'next';

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
	return (
		<>
			<div>
				<button onClick={() => setCurrentTabLogin(true)}>Login</button>
				<button onClick={() => setCurrentTabLogin(false)}>Register</button>
			</div>
			{(currentTabLogin && (
				<form action="/api/users/login" method="POST">
					<FormField name="username">username</FormField>
					<FormField name="password">password</FormField>
					<button type="submit">Login</button>
				</form>
			)) || (
				<form action="/api/users/register" method="POST">
					<FormField name="name">name</FormField>
					<FormField name="username">username</FormField>
					<FormField name="password">password</FormField>
					<button type="submit">Register</button>
				</form>
			)}
		</>
	);
};

export default Auth;
