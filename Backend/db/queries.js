const queries = {
	getEmail:
		'SELECT email, password FROM user_credentials WHERE enrollment_number = $1',
	setPassword:
		'UPDATE user_credentials SET password = $1 WHERE enrollment_number = $2',
	getUser:
		'SELECT password, enrollment_number FROM user_credentials WHERE enrollment_number = $1 OR email = $1',
	setOTU: 'UPDATE user_credentials SET OTU = $1 WHERE enrollment_number = $2',
	getOTU: 'SELECT OTU FROM user_credentials WHERE enrollment_number = $1',
	getStudentDetails:
		'SELECT * FROM student_records WHERE enrollment_number = $1',
	getAdminVerified:
		'SELECT admin_verified FROM user_credentials WHERE enrollment_number = $1',
	setAdminVerified:
		'UPDATE user_credentials SET admin_verified = $1 WHERE enrollment_number = $2',
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
	setCompanyDetails:
		'UPDATE company_records SET name = $1, company_description = $2 WHERE id = $3 RETURNING *',
	getRoleDetails: 'SELECT * FROM role_records WHERE id = $1',
	setRoleDetails: (role_id, company_id, roleDet) => {
		const det = Object.entries(roleDet);
		return [
			`UPDATE role_records SET company_id = $2, ${det
				.map(([key, val], i) => key + '=$' + (i + 3))
				.toString()} WHERE id = $1 RETURNING *`,
			[role_id, company_id, ...det.map((ele) => ele[1])],
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
	getApplications:
		'SELECT company_id, role_records.id AS role_id, role, name AS company_name FROM role_records LEFT JOIN company_records ON company_records.id = role_records.company_id',
};
export default queries;
