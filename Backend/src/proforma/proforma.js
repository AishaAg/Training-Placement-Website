import pool from '../../db/dbConnection';
import queries from '../../db/queries';

export const getProforma = async (req, res) => {
	try {
		const proforma = await pool.query(queries.getProforma);
		res.status(200).json({ proforma: proforma.rows });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};
