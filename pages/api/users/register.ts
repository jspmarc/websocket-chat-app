import { NextApiRequest, NextApiResponse } from 'next';
import mongo from '../../../lib/mongo-client';
import hash from '../../../lib/hash';
import jwt from '../../../lib/jwt';

const RegisterHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(405).end();
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
		if (existingUser)
			return res.status(409).end();

		const user = await users.insertOne(newUser);
		if (!user.acknowledged)
			return res.status(500).end();

		const token = jwt.generate(user.insertedId.toString(), req.body.name, req.body.username);
		token ? res.status(201).json({ token }) : res.status(500);
		res.end();
	} catch (e) {
		console.error(e);
	} finally {
		mongo.close();
	}
};

export default RegisterHandler;
