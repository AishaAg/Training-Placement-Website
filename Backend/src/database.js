import fs from 'fs';
import path from 'path';
export const makeDatabase = async (pool) => {
	var myQuery = fs
		.readFileSync(path.join(path.resolve(), '/tempDB/database.sql'))
		.toString();

	await pool.query(myQuery, (err, result) => {
		if (err) {
			console.log('error: ', err);
			process.exit(1);
		}
	});
	return pool;
};
