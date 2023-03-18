import express from 'express';
import { body, param } from 'express-validator';
import { verifyAdmin, verifyToken } from '../helpers/helper';
import {
	addCompanyDetails,
	deleteCompany,
	getCompanyDetails,
	getCompanyNames,
	getRoleNames,
	setCompanyDetails,
} from './profile';
import validator from '../helpers/validator';
import {
	addRoleDetails,
	deleteRole,
	getRoleDetails,
	setRoleDetails,
} from './role';

const companyRouter = express.Router();
companyRouter.use(verifyToken);
companyRouter.use(verifyAdmin);

// Fetches list of all company names from database that match the company name field input at '/company/profile'
companyRouter.get('/company-names/:company_name?', getCompanyNames);

companyRouter.get('/role/role-names', getRoleNames);

// Fetches details of the company with given company_id field input at '/company/:company_id'
companyRouter.get(
	`/:company_id`,
	param('company_id').isNumeric(),
	validator,
	getCompanyDetails
);

// Edit details of the company with given company_id field input at '/company/:company_id' returning everything
companyRouter.patch(
	'/:company_id',
	param('company_id').isNumeric(),
	validator,
	setCompanyDetails
);

// Creates company record on request at 'company/profile/new' returning generated company_id
companyRouter.post(
	'/profile',
	body('compDet.name').exists(),
	body('compDet.company_description').exists(),
	validator,
	addCompanyDetails
);

companyRouter.delete(
	'/:company_id',
	param('company_id').isNumeric(),
	validator,
	deleteCompany
);

// Fetches details of the role with given role_id and company_id field input at '/company/role/:role_id'
companyRouter.get(
	'/role/:role_id',
	param('role_id').isNumeric(),
	validator,
	getRoleDetails
);

// Edits details of the role with given role_id and company_id field input at '/company/role/:role_id' returning everything
companyRouter.patch(
	'/role/:role_id',
	param('role_id').isNumeric(),
	validator,
	setRoleDetails
);

companyRouter.delete(
	'/role/:role_id',
	param('role_id').isNumeric(),
	validator,
	deleteRole
);

// Creates role record on request at 'company/:company_id/role/new' returning generated role_id
companyRouter.post(
	'/:company_id/role',
	param('company_id').isNumeric(),
	validator,
	addRoleDetails
);

export default companyRouter;
