import express from 'express';
import { body, param } from 'express-validator';
import { verifyAdmin, verifyToken } from '../helpers/helper';
import {
	addCompanyDetails,
	getCompanyDetails,
	getCompanyNames,
	getRoleNames,
	setCompanyDetails,
} from './profile';
import validator from '../helpers/validator';
import { addRoleDetails, getRoleDetails, setRoleDetails } from './role';

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

// Creates company record on request at 'company/:company_id/profile/new' returning generated company_id
companyRouter.post(
	'/profile',
	body('name').exists().isString(),
	body('company_description').exists(),
	validator,
	addCompanyDetails
);

// Fetches details of the role with given role_id and company_id field input at '/company/:company_id/role/:role_id'

companyRouter.get(
	'/:company_id/role/:role_id',
	param('company_id').isNumeric(),
	param('role_id').isNumeric(),
	validator,
	getRoleDetails
);

// Edits details of the role with given role_id and company_id field input at '/company/:company_id/role/:role_id' returning everything

companyRouter.patch(
	'/:company_id/role/:role_id',
	param('company_id').isNumeric(),
	param('role_id').isNumeric(),
	validator,
	setRoleDetails
);

companyRouter.post(
	'/:company_id/role',
	param('company_id').isNumeric(),
	validator,
	addRoleDetails
);

export default companyRouter;
