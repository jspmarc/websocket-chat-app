import { NextApiRequest, NextApiResponse } from 'next';

const LoginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		return res.status(405).setHeader('Allow', 'GET').end();
	}
	if (!req.headers.authorization) {
		res.status(401).json({});
		return res.end();
	}
	console.log(req.headers.authorization);
};

export default LoginHandler;

