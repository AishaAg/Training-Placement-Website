import pool from '../../db/dbConnection';
import queries from '../../db/queries';

// GET /company/role/:role_id?
export const getRoleDetails = async (req, res) => {
	try {
		const roleDet = await pool.query(queries.getRoleDetails, [
			req.params.role_id,
		]);
		if (roleDet.rowCount === 0)
			return res.status(404).json({ message: 'Role ID not found.' });
		delete roleDet.rows[0]['id'];
		res.status(200).json({
			roleDetails: roleDet.rows[0],
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};

// PATCH /company/role/:role_id?
export const setRoleDetails = async (req, res) => {
	try {
		const roleDet = await pool.query(
			...queries.setRoleDetails(req.params.role_id, req.body.roleDet)
		);

		if (roleDet.rowCount === 0)
			return res.status(404).json({ message: 'Role ID not found.' });
		const eligibleBranches = await pool.query(
			...queries.setEligibleBranches(
				req.params.role_id,
				req.body.eligibleBranches
			)
		);
		delete eligibleBranches.rows[0]['role_id'];
		res.status(201).json({
			roleDetails: { ...roleDet.rows[0], ...eligibleBranches.rows[0] },
		});
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
		await pool.query(
			...queries.addEligibleBranches(
				roleId.rows[0].id,
				req.body.eligibleBranches
			)
		);
		res.status(201).json({ roleId: roleId.rows[0].id });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};

export const deleteRole = async (req, res) => {
	try {
		const roleId = await pool.query(queries.deleteRole, [req.params.role_id]);
		if (roleId.rowCount === 0) {
			return res.status(404).json({ message: 'Role ID not found' });
		}
		res.sendStatus(201);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};
