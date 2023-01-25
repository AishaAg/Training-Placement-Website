import express from 'express';
import { getApplications } from '../applications/application';
import { isValidLT, verifyToken } from '../helpers/helper';
import { getStudentDetails, setStudentDetails } from './profile';

const studentRouter = express.Router();
studentRouter.use(verifyToken);
studentRouter.use(isValidLT);

// Profile details setter & getter
studentRouter.get('/applications', getApplications);
studentRouter.get('/:enrollment_number?', getStudentDetails);
studentRouter.post('/:enrollment_number?', setStudentDetails);

export default studentRouter;
