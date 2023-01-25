import nodemailer from 'nodemailer';
import { emailSender1 } from '../config.js';

const sendMail = async ({ receiver, subject, body }) => {
	const transporter = nodemailer.createTransport(emailSender1);
	try {
		const info = await transporter.sendMail({
			from: emailSender1.auth.user,
			to: receiver,
			subject: subject,
			text: body,
		});
		console.log('mail sent');
		console.log(info.messageId);
	} catch (e) {
		console.log(e);
		return;
	}
};
export default sendMail;
