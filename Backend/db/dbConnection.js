import pg from 'pg';

const pool = new pg.Pool({
	user: 'postgres',
	database: 'postgres',
	password: 'lol',
	host: 'localhost',
	port: 5432,
});

export default pool;
