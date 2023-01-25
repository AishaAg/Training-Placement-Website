import pool from '../../db/dbConnection';
import queries from '../../db/queries';

// Get students details
// GET /:enrollment_number?
export const getStudentDetails = async (req, res) => {
	try {
		const enrollNo = req.det.admin
			? req.params.enrollment_number
			: req.det.user;
		const adminVerified = await pool.query(queries.getAdminVerified, [
			enrollNo,
		]);
		if (adminVerified.rowCount === 0)
			return res.status(404).json({ message: 'Enrollment number not found.' });
		const studentDetails = await pool.query(queries.getStudentDetails, [
			enrollNo,
		]);
		res.status(200).json({
			studentDetails: Object.assign(
				studentDetails.rows[0] ?? {},
				adminVerified.rows[0]
			),
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
		const adminVerified = (
			await pool.query(queries.getAdminVerified, [enrollNo])
		).rows[0]?.admin_verified;
		if (adminVerified === undefined)
			return res.status(404).json({ message: 'Enrollment number not found.' });
		if (!req.det.admin && adminVerified)
			return res
				.status(403)
				.json({ mesage: 'Details cannot be changed once verified by TPO.' });
		const studDet = await pool.query(
			...queries.setStudentDetails(enrollNo, req.body.studDet)
		);
		res.status(201).json({ studentDetails: studDet.rows[0] }); // TODO : change queries
	} catch (e) {
		console.log(e); // TODO
		res.status(500).json({ message: 'Some error occured.' });
	}
};
