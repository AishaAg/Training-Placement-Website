import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import { verifyToken, isValidOTU } from './helpers/helper';
import { sendSignupMail, login } from './auth/auth';
import setPassword from './auth/setPassword';
import studentRouter from './student/student';
import adminRouter from './admin/admin';
import testRouter from './test';
import cookieParser from 'cookie-parser';
import { body } from 'express-validator';
import validator from './helpers/validator';
import fileUpload from 'express-fileupload';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

export const seed = Math.round(Math.random() * 1e10);

// Default middlewares
app.disable('x-powered-by');
app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:1234',
	})
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Authentication routes
app.post('/send-signup-mail', sendSignupMail);
app.post('/login', body(['user', 'password']).exists(), validator, login);

// Set password route
app.post(
	'/set-password',
	isValidOTU,
	body('password').exists(),
	validator,
	setPassword
);

// Student router
app.use('/student', studentRouter);

// Admin router
app.use('/admin', adminRouter);

// Test router
app.use('/test', testRouter);
app.get('/', (req, res) => {
	res.send('Hi from backend!');
});

app.get('/get-notices', verifyToken, async (req, res) => {
	res.sendStatus(200);
});
app.all('/**/*', (req, res) => {
	res.status(436).json({ message: 'No such route exists.' });
});
export default app;
