import { MongoClient } from 'mongodb';
import config from './config';

if (!config.MONGO_URI) {
	throw new Error('You must provide a MongoLab URI');
}

const mongo = new MongoClient(config.MONGO_URI);

export default mongo;
