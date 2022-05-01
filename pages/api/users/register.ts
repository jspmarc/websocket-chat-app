import { NextApiRequest, NextApiResponse } from 'next';
import mongo from '../../../lib/mongo-client';
import hash from '../../../lib/hash';
import jwt from '../../../lib/jwt';

const RegisterHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(405).setHeader('Allow', 'POST').end();
	}
	try {
		await mongo.connect();
		const db = mongo.db('socif');
		const users = db.collection('users');
		const newUser = {
			...req.body,
			password: hash.hash(req.body.password),
		};
		const existingUser = await users.findOne({ username: newUser.username });
		if (existingUser) {
			res.status(409).json({});
			return res.end();
		}

		const user = await users.insertOne(newUser);
		if (!user.acknowledged) {
			res.status(500).json({});
			return res.end();
		}

		const token = await jwt.generate(
			user.insertedId.toString(),
			req.body.name,
			req.body.username,
		);
		token ? res.status(201).json({ token }) : res.status(500).json({});
		return res.end();
	} catch (e) {
		console.error(e);
	} finally {
		mongo.close();
	}
};

export default RegisterHandler;
