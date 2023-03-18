const queries = {
	getEmail:
		'SELECT email, password FROM user_credentials WHERE enrollment_number = $1',
	setPassword:
		'UPDATE user_credentials SET password = $1 WHERE enrollment_number = $2 RETURNING admin_verified, blocked',
	getUser:
		'SELECT password, enrollment_number, admin_verified, blocked FROM user_credentials WHERE enrollment_number = $1 OR email = $1',
	setBlocked:
		'UPDATE user_credentials SET blocked = $1 WHERE enrollment_number = $2 RETURNING blocked',
	setOTU: 'UPDATE user_credentials SET OTU = $1 WHERE enrollment_number = $2',
	getOTU: 'SELECT OTU FROM user_credentials WHERE enrollment_number = $1',
	getStudentDetails:
		'SELECT * FROM student_records WHERE enrollment_number = $1',
	getStudentEligibilityDetails:
		'SELECT branch, cgpa, active_backlogs, experience FROM student_records WHERE enrollment_number = $1',
	getAdminVerifiedAndBlocked:
		'SELECT admin_verified, blocked FROM user_credentials WHERE enrollment_number = $1',
	setAdminVerified:
		'UPDATE user_credentials SET admin_verified = $1 WHERE enrollment_number = $2 RETURNING admin_verified',
	setStudentDetails: (enrollment_number, studDet) => {
		const det = Object.entries(studDet);
		return [
			`INSERT INTO student_records (enrollment_number,${det
				.map((ele) => ele[0])
				.toString()}) VALUES ($1,${det
				.map((_, i) => '$' + (i + 2))
				.toString()}) ON CONFLICT (enrollment_number) DO UPDATE SET ${det
				.map(([key, val]) => key + '=EXCLUDED.' + key)
				.toString()} RETURNING *`,
			[enrollment_number, ...det.map((ele) => ele[1])],
		];
	},
	getCompanyNames: 'SELECT id, name FROM company_records WHERE name ILIKE $1',
	getRoleNames: (role) => [
		'SELECT id, role FROM role_records WHERE role ILIKE $1',
		[role],
	],
	getRoleNamesByCompany: (company_id, role) => [
		'SELECT id, role FROM role_records WHERE company_id = $1 AND role ILIKE $2',
		[company_id, role],
	],
	getCompanyDetails: 'SELECT * FROM company_records WHERE id = $1',
	addCompanyDetails:
		'INSERT INTO company_records (name, company_description) VALUES ($1, $2) RETURNING id',
	deleteCompany: 'DELETE FROM company_records WHERE id = $1 RETURNING id',
	setCompanyDetails:
		'UPDATE company_records SET name = $1, company_description = $2 WHERE id = $3 RETURNING *',
	getRoleDetails:
		'SELECT role_records.*, branch_eligibility.*, company_records.name, company_records.company_description FROM role_records FULL OUTER JOIN company_records ON role_records.company_id = company_records.id FULL OUTER JOIN branch_eligibility ON role_records.id = branch_eligibility.role_id WHERE role_records.id = $1',
	setRoleDetails: (role_id, roleDet) => {
		const det = Object.entries(roleDet);
		return [
			`UPDATE role_records SET ${det
				.map(([key, val], i) => key + '=$' + (i + 2))
				.toString()} WHERE id = $1 RETURNING *`,
			[role_id, ...det.map((ele) => ele[1])],
		];
	},
	addRoleDetails: (company_id, roleDet) => {
		const det = Object.entries(roleDet);
		return [
			`INSERT INTO role_records (company_id, ${det
				.map((ele) => ele[0])
				.toString()}) VALUES 
	($1, ${det
		.map((_, i) => '$' + (i + 2))
		.toString()}) ON CONFLICT (company_id, role) DO UPDATE SET ${det
				.map(([key, val]) => key + '=EXCLUDED.' + key)
				.toString()} RETURNING id`,
			[company_id, ...det.map((ele) => ele[1])],
		];
	},
	deleteRole: 'DELETE FROM role_records WHERE id = $1 RETURNING id',
	getEligibleBranches: 'SELECT * FROM branch_eligibility WHERE role_id = $1',
	setEligibleBranches: (role_id, eligibleBranches) => {
		const branches = Object.entries(eligibleBranches);
		return [
			`UPDATE branch_eligibility SET ${branches
				.map(([key, val], i) => key + '=$' + (i + 2))
				.toString()} WHERE role_id = $1 RETURNING *`,
			[role_id, ...branches.map((ele) => ele[1])],
		];
	},
	addEligibleBranches: (role_id, eligibleBranches) => {
		const branches = Object.entries(eligibleBranches);
		return [
			`INSERT INTO branch_eligibility (role_id, ${branches
				.map((ele) => ele[0])
				.toString()}) VALUES 
	($1, ${branches
		.map((_, i) => '$' + (i + 2))
		.toString()}) ON CONFLICT (role_id) DO UPDATE SET ${branches
				.map(([key, val]) => key + '=EXCLUDED.' + key)
				.toString()}`,
			[role_id, ...branches.map((ele) => ele[1])],
		];
	},
	getProforma: `SELECT company_id, role_records.id AS role_id, role, name AS company_name FROM role_records INNER JOIN company_records ON company_records.id = role_records.company_id`,
	getStudentApplications:
		'SELECT role_records.role, role_records.id AS role_id, student_applications.selection_status, company_records.name AS company_name FROM student_applications INNER JOIN role_records ON student_applications.role_id = role_records.id INNER JOIN company_records ON role_records.company_id = company_records.id WHERE student_applications.enrollment_number = $1',
	getApplications: (branch_id, cgpa, active_backlogs, experience) => [
		`SELECT company_id, role_records.id AS role_id, role, name AS company_name FROM role_records INNER JOIN company_records ON company_records.id = role_records.company_id INNER JOIN branch_eligibility ON branch_eligibility.role_id = role_records.id WHERE role_records.required_cgpa <= $1 AND role_records.active_backlogs >= $2 AND role_records.required_experience <= $3 AND branch_eligibility.${branch_id} = $4`,
		[cgpa, active_backlogs, experience, true],
	],

	getApplication: `SELECT role_records.*, branch_eligibility.*, student_applications.resume_id AS resume_id, student_applications.selection_status AS selection_status, company_records.name, company_records.company_description FROM role_records INNER JOIN
	company_records ON role_records.company_id = company_records.id LEFT OUTER JOIN
				student_applications ON role_records.id = student_applications.role_id INNER JOIN branch_eligibility ON role_records.id = branch_eligibility.role_id WHERE (role_records.id = $2) AND (student_applications.enrollment_number = $1 OR student_applications.enrollment_number IS NULL)`,

	addApplication: `INSERT INTO student_applications (enrollment_number, role_id, resume_id) VALUES ($1, $2, $3)`,
	deleteApplication:
		'DELETE FROM student_applications WHERE (enrollment_number = $1 AND role_id = $2)',
	addDocument: `INSERT INTO student_documents (enrollment_number, category) VALUES ($1, $2) RETURNING document_id`,
	deleteDocument: `DELETE FROM student_documents WHERE document_id = $1 RETURNING document_id`,
	getDocumentIds:
		'SELECT document_id FROM student_documents WHERE enrollment_number = $1 AND category = $2',
};
export default queries;
