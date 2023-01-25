import jwt from 'jsonwebtoken';
import { key } from '../config.js';
import bcrypt from 'bcrypt';
import pool from '../../db/dbConnection.js';
import queries from '../../db/queries.js';

export const createToken = (payload, timeOut = '15m') => {
	const jwtToken = jwt.sign(payload, key, {
		expiresIn: '2h',
	});
	return jwtToken;
};

export const verifyToken = (req, res, next) => {
	try {
		req.det = jwt.verify(req.cookies.token, key);
		req.det.admin = req.det.user === 'admin';

		next();
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			res.status(401).json({ message: 'Unauthorized access.' });
		} else if (e instanceof jwt.TokenExpiredError) {
			res.status(498).json({ message: 'Token expired. Please login again.' });
		} else {
			res.status(417).json({ message: 'Token generation error.' });
			console.log(e);
		}
	}
};
export const verifyAdmin = (req, res, next) => {
	if (req.det.user !== 'admin')
		return res.status(401).json({ message: 'Unauthorized access.' });
	next();
};
export const isValidLT = (req, res, next) => {
	if (req.det.type !== 'lt') {
		res.status(401).json({ message: 'Invalid token.' });
		return;
	}
	next();
};
export const isValidOTU = async (req, res, next) => {
	try {
		req.det = jwt.verify(req.headers.token, key);
		req.det.admin = req.det.user === 'admin';

		const OTUStatus = await pool.query(queries.getOTU, [req.det.user]);
		// since token is verified, we can assume enrollment number is correct and row count will be 1
		if (OTUStatus.rows[0].otu) {
			await pool.query(queries.setOTU, [false, req.det.user]);
			if (req.det.type !== 'otu') {
				res.status(400).json({ message: 'Invalid request.' });
				return;
			}
			next();
		} else {
			res.status(410).json({ message: 'Link expired. Retry.' });
		}
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			res.status(401).json({ message: 'Unauthorized access.' });
		} else if (e instanceof jwt.TokenExpiredError) {
			res.status(498).json({ message: 'Token expired. Please login again.' });
		} else {
			res.status(417).json({ message: 'Token generation error.' });
			console.log(e);
		}
	}
};

export const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPass = await bcrypt.hash(password, salt);
	return hashedPass;
};

export const verifyPassword = async (inputPass, correctPass) => {
	return await bcrypt.compare(inputPass, correctPass);
};
