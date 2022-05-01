import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import config from '../../../lib/config';

const LoginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		return res.status(405).setHeader('Allow', 'GET').end();
	}
	if (!req.headers.authorization) {
		res.status(401).json({});
		return res.end();
	}
	const token = req.headers.authorization.split(' ')[1];
	const verif = await jwtVerify(token, new TextEncoder().encode(config.TOKEN_SECRET));
	res.json({
		id: verif.payload.id,
		name: verif.payload.name,
		username: verif.payload.username,
	});
	res.end();
};

export default LoginHandler;

