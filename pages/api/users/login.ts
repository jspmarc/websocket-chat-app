import { NextApiRequest, NextApiResponse } from 'next';

const LoginHandler = (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(405).end();
	}
	console.log(req.body);
	res.redirect('/').end();
};

export default LoginHandler;

