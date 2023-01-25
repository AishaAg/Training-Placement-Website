import app from './server.js';
import { host, port } from './config.js';
import { makeDatabase } from './database.js';
import pg from 'pg';

const pool = new pg.Pool({
	user: 'postgres',
	database: 'postgres',
	password: 'lol',
	host: 'localhost',
	port: 5432,
});

app.listen(port, host, async () => {
	await makeDatabase(pool);
	console.log(`Database connected!\nrunning on http://${host}:${port}`);
});
