import pg from 'pg';

const pool = new pg.Pool({
	user: 'postgres',
	database: 'postgres',
	password: 'lol',
	host: 'localhost',
	port: 5432,
});
console.log('pool here');

export default pool;
