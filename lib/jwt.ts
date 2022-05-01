import { SignJWT } from 'jose';
import config from './config';

const generate = async (id: string, name: string, username: string) => {
	if (!config.TOKEN_SECRET) throw new Error('TOKEN_SECRET is not defined');
	const jwt = await new SignJWT({ id, name, username, })
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime('1d')
		.sign(new TextEncoder().encode(config.TOKEN_SECRET));
	return jwt;
};

const Jwt = {
	generate,
};

export default Jwt;
