import dotenv from 'dotenv';

dotenv.config();

const config = {
	MONGO_URI: process.env.MONGO_URI,
	TOKEN_SECRET: process.env.TOKEN_SECRET,
};

export default config;
