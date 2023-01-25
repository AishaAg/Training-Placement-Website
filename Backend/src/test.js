import express from 'express';
import pool from '../db/dbConnection.js';
import queries from '../db/queries.js';
import { verifyToken } from './helpers/helper.js';
const testRouter = express.Router();
testRouter.use(verifyToken);
testRouter.get('/', async (req, res) => {
	const roles = await pool.query(queries.getApplicationsTest);
	console.log(roles.rows);
	return res.sendStatus(200);
});

export default testRouter;
