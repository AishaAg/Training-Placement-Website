import express from 'express';
import companyRouter from '../company/company';
import { isValidLT, verifyAdmin, verifyToken } from '../helpers/helper';
import studentRouter from '../student/student';

const adminRouter = express.Router();

adminRouter.use(verifyToken);
adminRouter.use(isValidLT);
adminRouter.use(verifyAdmin);

adminRouter.use('/student', studentRouter);
adminRouter.use('/company', companyRouter);
export default adminRouter;
