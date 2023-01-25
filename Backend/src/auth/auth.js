import express from 'express';
import { frontendAddress } from '../config';
import pool from '../../db/dbConnection';
import queries from '../../db/queries';
import { createToken, verifyPassword } from '../helpers/helper';
import sendMail from '../helpers/mails';

// Gets enrollment number in req from '/signup'
// Looks for corresponding email in database and sends mail to set password url with set password token
export const sendSignupMail = async (req, res) => {
	const user = req.body.user;
	try {
		const response = await pool.query(queries.getEmail, [user]);
		if (response.rowCount === 0)
			return res.status(404).json({ message: 'Enrollment number not found.' });

		if (response.rows[0].password)
			return res
				.status(409)
				.json({ message: 'Enrollment number already signed up. Please login' }); // show forgot password link

		const email = response.rows[0].email;
		const token = createToken({ user: user, type: 'otu' });
		const setPasswordURL = `${frontendAddress}/set-password/${token}`;
		console.log(setPasswordURL);
		const mailParams = {
			receiver: email,
			subject: 'Set password link for TPO Website.',
			body: `Please click on this link to set password - ${setPasswordURL} `,
			html: `<a href=${setPasswordURL}>click me</a>`,
		};
		await pool.query(queries.setOTU, [true, user]);
		sendMail(mailParams);
		const ind = email.indexOf('@');
		const starredEmail =
			email.slice(0, 2) +
			'*'.repeat(ind - 4) +
			email.slice(ind - 2, email.length);
		res.status(200).json({ starredEmail: starredEmail });
	} catch (e) {
		console.log(e); // TODO
		res.status(500).json({ message: 'Server error.' });
	}
};

// Gets id(email / enrollment number) and password in req from '/login'
// Authenticates, creates lt and responds with lt
export const login = async (req, res) => {
	try {
		const response = await pool.query(queries.getUser, [req.body.user]);
		if (response.rowCount === 0)
			return res.status(404).json({ message: 'User not found.' });

		if (response.rows[0].password === null)
			return res.status(403).json({ message: 'Please signup first.' });

		const authenticated = await verifyPassword(
			req.body.password,
			response.rows[0].password
		);
		if (!authenticated)
			return res.status(401).json({ message: 'Invalid Password' });

		const token = createToken({
			user: response.rows[0].enrollment_number,
			type: 'lt',
		});
		res.cookie('token', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
		});
		res.status(201).json({ admin: req.body.user === 'admin' });
	} catch (e) {
		console.log(e); // TODO
		res.status(500).json({ message: 'Server error.' });
	}
};
