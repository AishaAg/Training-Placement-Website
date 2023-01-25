import pool from '../../db/dbConnection';
import queries from '../../db/queries';

// GET /company/:company_id/role/:role_id?
export const getRoleDetails = async (req, res) => {
	try {
		const roleDet = await pool.query(queries.getRoleDetails, [
			req.params.role_id,
		]);
		if (roleDet.rowCount === 0)
			return res.status(404).json({ message: 'Role ID not found.' });
		res.status(200).json({ roleDetails: roleDet.rows[0] });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};

// PATCH /company/:company_id/role/:role_id?
export const setRoleDetails = async (req, res) => {
	try {
		const roleDet = await pool.query(
			...queries.setRoleDetails(
				req.params.role_id,
				req.params.company_id,
				req.body.roleDet
			)
		);
		if (roleDet.rowCount === 0)
			return res.status(404).json({ message: 'Role ID not found.' });
		res.status(201).json({ roleDetails: roleDet.rows[0] });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};

// POST /company/:company_id/role
export const addRoleDetails = async (req, res) => {
	try {
		const roleId = await pool.query(
			...queries.addRoleDetails(req.params.company_id, req.body.roleDet)
		);
		res.status(201).json({ roleId: roleId.rows[0].id });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};
