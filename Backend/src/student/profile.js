import pool from '../../db/dbConnection';
import queries from '../../db/queries';

// Get students details
// GET /:enrollment_number?
export const getStudentDetails = async (req, res) => {
	try {
		const enrollNo = req.det.admin
			? req.params.enrollment_number
			: req.det.user;
		const studentDetails = await pool.query(queries.getStudentDetails, [
			enrollNo,
		]);
		let user;
		if (req.det.admin) {
			user = await pool.query(queries.getAdminVerifiedAndBlocked, [
				req.params.enrollment_number,
			]);
		}
		res.status(200).json({
			studentDetails: Object.assign(studentDetails.rows[0] ?? {}, {
				admin_verified: req.det.admin
					? user.rows[0].admin_verified
					: req.det.admin_verified,
				blocked: req.det.admin ? user.rows[0].blocked : req.det.blocked,
			}),
		});
	} catch (e) {
		console.log(e); // TODO
		res.status(500).json({ message: 'Server error.' });
	}
};

// POST /:enrollment_number?
export const setStudentDetails = async (req, res) => {
	try {
		const enrollNo = req.det.admin
			? req.params.enrollment_number
			: req.det.user;
		if (!req.det.admin && req.det.admin_verified)
			return res
				.status(403)
				.json({ message: 'Details cannot be changed once verified by TPO.' });
		const studDet = await pool.query(
			...queries.setStudentDetails(enrollNo, req.body.studDet)
		);
		res.status(201).json({
			studentDetails: studDet.rows[0],
		}); // TODO : change queries
	} catch (e) {
		console.log(e); // TODO
		res.status(500).json({ message: 'Some error occured.' });
	}
};
