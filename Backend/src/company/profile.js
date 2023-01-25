import pool from '../../db/dbConnection';
import queries from '../../db/queries';

// Registered on
// '/company-names/:company_name?'
export const getCompanyNames = async (req, res) => {
	try {
		console.log(req.params.company_name);
		const companies = await pool.query(queries.getCompanyNames, [
			`%${req.params.company_name ?? ''}%`,
		]);
		res.status(200).json({
			companies: companies.rows,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};

export const getRoleNames = async (req, res) => {
	try {
		const roles = await pool.query(
			...(req.query.company_id
				? queries.getRoleNamesByCompany(
						req.query.company_id,
						`%${req.query.role ?? ''}%`
				  )
				: queries.getRoleNames(`%${req.query.role ?? ''}%`))
		);
		console.log(roles.rows);
		res.status(200).json({
			roles: roles.rows,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};

// GET /:company_id?
export const getCompanyDetails = async (req, res) => {
	try {
		const compDet = await pool.query(queries.getCompanyDetails, [
			req.params.company_id,
		]);
		if (compDet.rowCount === 0)
			return res.status(404).json({ message: 'Company ID not found.' });
		res.status(200).json({ companyDetails: compDet.rows[0] });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};

// PATCH /:company_id?
export const setCompanyDetails = async (req, res) => {
	try {
		const compDet = await pool.query(queries.setCompanyDetails, [
			req.body.compDet.name,
			req.body.compDet.company_description,
			req.params.company_id,
		]);
		if (compDet.rowCount === 0)
			return res.status(404).json({ message: 'Company ID not found.' });
		res.status(201).json({ companyDetails: compDet.rows[0] });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};

// POST /profile
export const addCompanyDetails = async (req, res) => {
	try {
		const companyId = await pool.query(queries.addCompanyDetails, [
			req.body.name,
			req.body.company_description,
		]);
		res.status(201).json({ companyId: companyId.rows[0].id });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};
