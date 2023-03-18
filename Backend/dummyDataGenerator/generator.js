export const randint = (mini = 0, maxi = 0, multiplier = 1) =>
	(mini + Math.floor((maxi - mini + 1) * Math.random())) * multiplier;

const wordGenerator = (length = 7, mini = 1) => {
	const alphabets = 'abcdefghijklmnopqrstuvwxyz';
	const wordLen = randint(mini, length);
	const something = Array.from(Array(wordLen)).reduce(
		(prev) => prev + alphabets[randint(0, 25)],
		''
	);
	return something;
};

const textGenerator = (length = 30, mini = 0) => {
	const textLen = randint(mini, length);
	return Array.from(Array(textLen))
		.map(() => wordGenerator())
		.join(' ');
};

export const companyDataGenerator = () => {
	return {
		name: textGenerator(3, 1),
		company_description: textGenerator(),
	};
};

export const branchEligibilityDataGenerator = () => {
	return Object.fromEntries(
		Array.from(Array(12)).map((_, ind) => [
			`_${ind}`,
			randint(0, 1) ? true : false,
		])
	);
};

export const roleDataGenerator = () => {
	const roles = [
		'SDE',
		'Summer analyst',
		'Software developer',
		'data engineer',
		'member technical',
		'frontend engineer',
		'backend engineer',
		'ML Engineer',
		'Intern',
		'Data Science Intern',
		'Research Intern',
		'Sales',
	];
	const deadline = new Date();
	deadline.setDate(deadline.getDate() + randint(1, 7));
	const locations = [
		'Chennai',
		'Mumbai',
		'Gurgaon',
		'Bengaluru',
		'remote',
		'Hyderabad',
		'Kolkata',
		'Indore',
		'Pune',
		'Mysore',
	];
	const roleDet = {
		role: roles[randint(0, roles.length - 1)],
		role_description: textGenerator(),
		required_cgpa: randint(3, 9),
		required_experience: randint(0, 2),
		active_backlogs: randint(0, 20),
		compensation: randint(3, 30, 100000),
		benefits: textGenerator(),
		job_location: Array.from(
			new Set(
				Array.from(Array(randint(1, locations.length + 2))).map(
					() => locations[randint(0, locations.length - 1)]
				)
			)
		).join(', '),
		bond_details: textGenerator(),
		hiring_process: textGenerator(),
		drive_status: wordGenerator(),
		deadline: deadline,
	};
	if (randint(1, 10) > 4) delete roleDet['active_backlogs'];
	if (randint(1, 10) > 2) delete roleDet['required_experience'];
	if (randint(1, 10) > 6) delete roleDet['required_cgpa'];
	return roleDet;
};
