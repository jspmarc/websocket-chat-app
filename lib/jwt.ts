import jwt from 'jsonwebtoken';
import config from './config';

const generate = (id: string, name: string, username: string) => {
	if (!config.TOKEN_SECRET) throw new Error('TOKEN_SECRET is not defined');
	return jwt.sign({ id, name, username }, config.TOKEN_SECRET, { expiresIn: '1d' });
};

const Jwt = {
	generate,
};

export default Jwt;
