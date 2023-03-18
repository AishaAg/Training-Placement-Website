import pool from '../../db/dbConnection';
import { createToken, hashPassword } from '../helpers/helper';
import queries from '../../db/queries';

// verifies set password token and validation of OTU and sets password in the database
// Gets set password token, enrollment number in req from '/set-password'
// Creates lt and sends lt in res
// Registered on
// /set-password
const setPassword = async (req, res) => {
	try {
		if (req.body.password === null) return res.sendStatus(400);
		const hashedPass = await hashPassword(req.body.password);
		const user = await pool.query(queries.setPassword, [
			hashedPass,
			req.det.user,
		]);
		if (user.rows[0].blocked === true)
			return res.status(403).json({
				message: 'User blocked. Please contact the TPO.',
				link: '/login',
			});
		const token = createToken({
			user: req.det.user,
			type: 'lt',
		});
		res.cookie('token', token, {
			sameSite: 'none',
			httpOnly: true,
			secure: true,
		});
		res.status(200).json({
			admin: req.det.admin,
			link: user.rows[0].admin_verified ? '/' : '/profile',
		});
	} catch (e) {
		console.log(e); // TODO
		res.status(500).json({ message: 'Server error.' });
	}
};
export default setPassword;
