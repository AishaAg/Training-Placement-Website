import express from 'express';
import companyRouter from '../company/company';
import { isValidLT, verifyAdmin, verifyToken } from '../helpers/helper';
import { getStudentDetails, setStudentDetails } from '../student/profile';
import studentRouter from '../student/student';
import { setAdminVerified, setBlocked } from './studentDetails';

const adminRouter = express.Router();

adminRouter.use(verifyToken);
adminRouter.use(isValidLT);
adminRouter.use(verifyAdmin);

adminRouter.use('/company', companyRouter);
adminRouter
	.route('/student/profile/:enrollment_number')
	.get(getStudentDetails)
	.post(setStudentDetails);

adminRouter
	.route('/student/profile/:enrollment_number/admin_verified')
	.patch(setAdminVerified);
adminRouter
	.route('/student/profile/:enrollment_number/blocked')
	.patch(setBlocked);

export default adminRouter;
