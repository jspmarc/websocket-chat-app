import { NextApiRequest, NextApiResponse } from 'next';
import mongo from '../../../lib/mongo-client';
import hash from '../../../lib/hash';
import jwt from '../../../lib/jwt';

const LoginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(405).setHeader('Allow', 'POST').end();
	}
	try {
		await mongo.connect();
		const db = mongo.db('socif');
		const users = db.collection('users');
		const user = await users.findOne({
			username: req.body.username,
			password: hash.hash(req.body.password),
		});
		console.log(user);
		console.log(req.body.username);
		console.log(hash.hash(req.body.password));
		if (!user) {
			res.status(404).json({});
			return res.end();
		}
		const token = jwt.generate(user._id.toString(), user.name, user.username);
		token ? res.json({ token }) : res.status(500);
	} catch (e) {
		console.error(e);
	} finally {
		res.end();
		mongo.close();
	}
};

export default LoginHandler;
