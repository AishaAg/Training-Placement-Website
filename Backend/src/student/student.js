import express from 'express';
import { body } from 'express-validator';
import validator from '../helpers/validator';
import {
	addApplication,
	deleteApplication,
	getApplication,
	getApplications,
	getDocumentIds,
	getStudentApplications,
} from '../applications/applications';
import {
	deleteDocument,
	fetchDocument,
	uploadDocument,
} from '../documents/documents';
import {
	getAdminVerifiedAndBlocked,
	isValidLT,
	verifyToken,
} from '../helpers/helper';
import { getStudentDetails, setStudentDetails } from './profile';
import { getProforma } from '../proforma/proforma';

const studentRouter = express.Router();
studentRouter.use(verifyToken);
studentRouter.use(isValidLT);

studentRouter.use(getAdminVerifiedAndBlocked);

// Profile details setter & getter
studentRouter.get('/profile', getStudentDetails);
studentRouter.post('/profile', setStudentDetails);

studentRouter.use((req, res, next) => {
	if (!req.det.admin_verified)
		return res.status(403).json({ message: 'User not verified by the TPO.' });
	next();
});

//Proforma
studentRouter.get('/proforma', getProforma);

// Applications
studentRouter.get('/application/all', getStudentApplications);
studentRouter.get('/applications', getApplications);
studentRouter.get('/application/:role_id', getApplication);
studentRouter.post(
	'/application/:role_id',
	body('resume_id').exists(),
	validator,
	addApplication
);
studentRouter.delete('/application/:role_id', deleteApplication);

// Documents
studentRouter.post('/documents/:document_type', uploadDocument);
studentRouter.get('/documents/:document_type/:document_id', fetchDocument);
studentRouter.get('/documents/:document_type', getDocumentIds);
studentRouter.delete('/documents/:document_type/:document_id', deleteDocument);

export default studentRouter;
