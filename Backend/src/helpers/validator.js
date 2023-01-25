import { validationResult } from 'express-validator';

const validator = (req, res, next) => {
	const errors = validationResult(req).array();
	if (errors.length) {
		res.status(400).json({ errors });
		return;
	}
	next();
};

export default validator;
