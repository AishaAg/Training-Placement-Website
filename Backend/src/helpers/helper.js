import jwt from 'jsonwebtoken';
import { key } from '../config.js';
import bcrypt from 'bcrypt';
import pool from '../../db/dbConnection.js';
import queries from '../../db/queries.js';
import { seed } from '../server.js';

export const createToken = (payload, timeOut = '15m') => {
	const jwtToken = jwt.sign(Object.assign(payload, { seed: seed }), key, {
		expiresIn: '2h',
	});
	return jwtToken;
};

export const verifyToken = (req, res, next) => {
	try {
		req.det = jwt.verify(req.cookies.token, key);
		// TODO
		// if (req.det.seed !== seed) {
		// 	return res
		// 		.status(401)
		// 		.json({ message: 'Some internal error occured. Please login again.' });
		// }
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

export const getAdminVerifiedAndBlocked = async (req, res, next) => {
	try {
		const user = await pool.query(queries.getAdminVerifiedAndBlocked, [
			req.det.user,
		]);
		if (user.rowCount === 0)
			return res.status(404).json({ message: 'Enrollment number not found.' });
		Object.assign(req.det, user.rows[0]);
		if (req.det.blocked) {
			return res.status(403).json({
				message: 'User blocked. Please contact the TPO.',
				link: '/login',
			});
		}
		next();
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
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

// export const getBranchId = (branch) => {
// const branches = [
// 'Applied Chemistry',
// 'Applied Mathematics',
// 'Applied Physics',
// 'Artificial Intelligence Engineering',
// 'Civil Engineering',
// 'Computer Science & Engineering',
// 'Electrical Engineering',
// 'Electronics and Telecommunication Engineering',
// 'Industrial and Production Engineering',
// 'Information Technology Engineering',
// 'Mechanical Engineering',
// 'Mechatronics Engineering',
// ];
// return branches.indexOf()
// };
