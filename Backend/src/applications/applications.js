import pool from '../../db/dbConnection';
import queries from '../../db/queries';
import studentRouter from '../student/student';

export const getStudentApplications = async (req, res) => {
	try {
		const studApplications = await pool.query(queries.getStudentApplications, [
			req.det.user,
		]);
		res.status(200).json({ studentApplications: studApplications.rows });
	} catch (e) {
		console.log(e);
		res.status(500).json('Server error.');
	}
};

export const getApplications = async (req, res) => {
	try {
		const studDet = await pool.query(queries.getStudentEligibilityDetails, [
			req.det.user,
		]);
		if (studDet.rowCount === 0)
			return res.status(404).json({ message: 'User not found.' });
		const applications = await pool.query(
			...queries.getApplications(
				studDet.rows[0].branch,
				studDet.rows[0].cgpa,
				studDet.rows[0].active_backlogs,
				studDet.rows[0].experience
			)
		);
		res.status(200).json({ applications: applications.rows });
	} catch (e) {
		console.log(e);
		res.status(500).json('Server error.');
	}
};

export const getDocumentIds = async (req, res) => {
	try {
		const documentIds = await pool.query(queries.getDocumentIds, [
			req.det.user,
			req.params.document_type,
		]);
		res.status(200).json({ document_ids: documentIds.rows });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};

export const getApplication = async (req, res) => {
	try {
		const application = await pool.query(queries.getApplication, [
			req.det.user,
			req.params.role_id,
		]);
		if (application.rowCount === 0) {
			return res.status(404).json({ message: 'Application not found.' });
		}
		if (application.rows[0].resume_id === null) {
			const resumeIds = await pool.query(queries.getDocumentIds, [
				req.det.user,
				'resume',
			]);
			res
				.status(200)
				.json({ application: application.rows[0], resume_ids: resumeIds.rows });
		} else {
			res.status(200).json({ application: application.rows[0] });
		}
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};

export const addApplication = async (req, res) => {
	try {
		const studDet = await pool.query(queries.getStudentEligibilityDetails, [
			req.det.user,
		]);
		const roleDet = await pool.query(queries.getRoleDetails, [
			req.params.role_id,
		]);
		if (
			roleDet.rowCount === 0 ||
			roleDet.rows[0][`${studDet.rows[0].branch}`] === false ||
			roleDet.rows[0].active_backlogs < studDet.rows[0].active_backlogs ||
			roleDet.rows[0].required_cgpa > studDet.rows[0].cgpa ||
			roleDet.rows[0].required_experience > studDet.rows[0].experience ||
			roleDet.rows[0].deadline < new Date()
		) {
			return res.status(400).json({ message: 'Invalid application.' });
		}

		await pool.query(queries.addApplication, [
			req.det.user,
			req.params.role_id,
			req.body.resume_id,
		]);

		res.status(201).json({ message: 'Application submitted.' });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};

export const deleteApplication = async (req, res) => {
	try {
		await pool.query(queries.deleteApplication, [
			req.det.user,
			req.params.role_id,
		]);
		res.status(201).json({ message: 'Application withdrawn.' });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: 'Server error.' });
	}
};
