import pool from '../db/dbConnection.js';
import queries from '../db/queries.js';
import {
	branchEligibilityDataGenerator,
	companyDataGenerator,
	randint,
	roleDataGenerator,
} from './generator.js';

import fs from 'fs';
import path from 'path';
export const makeDatabase = async () => {
	var myQuery = fs
		.readFileSync(path.join(path.resolve(), 'tempDB/database.sql'))
		.toString();

	await pool.query(myQuery, (err, result) => {
		if (err) {
			console.log('error: ', err);
			process.exit(1);
		}
	});

	const companies = await addDummyCompanyData();
	console.log(`${companies} new companies added!`);
	const roles = await addDummyRoleData(companies);
	console.log(`${roles} new roles added!`);
};

const addDummyCompanyData = async () => {
	const companies = 25;
	for (let i = 0; i < companies; i++) {
		const data = companyDataGenerator();
		const companyId = await pool.query(queries.addCompanyDetails, [
			data.name,
			data.company_description,
		]);
	}
	return companies + 2;
};

const addDummyRoleData = async (totalCompanies) => {
	const roles = 100;
	for (let i = 0; i < roles; i++) {
		const data = roleDataGenerator();
		const roleId = await pool.query(
			...queries.addRoleDetails(randint(1, totalCompanies - 1), data)
		);
		const eligibleBranches = branchEligibilityDataGenerator();
		await pool.query(
			...queries.addEligibleBranches(roleId.rows[0].id, eligibleBranches)
		);
	}
	return roles + 1;
};
