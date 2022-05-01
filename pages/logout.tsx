import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout: NextPage = () => {
	const router = useRouter();
	useEffect(() => {
		document.cookie = 'token=; Max-Age=0';
		window.localStorage.removeItem('username');
		window.localStorage.removeItem('id');
		window.localStorage.removeItem('name');
		router.push('/auth');
	}, [router]);
	return <span>Logging out...</span>;
};

export default Logout;
