import pool from '../../db/dbConnection';
import queries from '../../db/queries';

export const getApplications = async (req, res) => {
	try {
		const applications = await pool.query(queries.getApplications);
		res.status(200).json({ applications: applications.rows });
	} catch (e) {
		console.log(e);
		res.status(500).json('Server error.');
	}
};
