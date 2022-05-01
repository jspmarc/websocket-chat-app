import { SHA3 } from 'sha3';

const hash = (value: string): string => {
	const sha3 = new SHA3(256);
	return sha3.update(value).digest('hex');
};

const compare = (value: string, hash: string): boolean => {
	const sha3 = new SHA3(256);
	const newHash = sha3.update(value).digest('hex');
	return newHash === hash;
};

const Hash = { hash, compare };
export default Hash;
