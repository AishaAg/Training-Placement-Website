import pool from '../../db/dbConnection';
import queries from '../../db/queries';

const getAdminVerifiedAndBlocked = async (req, res, next) => {
	try {
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

export const setAdminVerified = async (req, res) => {
	try {
		const admin_verified = await pool.query(queries.setAdminVerified, [
			req.body.admin_verified,
			req.params.enrollment_number,
		]);

		if (admin_verified.rowCount === 0) {
			return res.status(404).json({ message: 'Invalid enrollment number.' });
		}
		return res
			.status(201)
			.json({ admin_verified: admin_verified.rows[0].admin_verified });
	} catch (e) {
		console.log(e); // TODO
		res.status(500).json({ message: 'Some error occured.' });
	}
};

export const setBlocked = async (req, res) => {
	try {
		const blocked = await pool.query(queries.setBlocked, [
			req.body.blocked,
			req.params.enrollment_number,
		]);

		if (blocked.rowCount === 0) {
			return res.status(404).json({ message: 'Invalid enrollment number.' });
		}
		return res.status(201).json({ blocked: blocked.rows[0].blocked });
	} catch (e) {
		console.log(e); // TODO
		res.status(500).json({ message: 'Some error occured.' });
	}
};
