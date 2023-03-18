DROP TABLE IF EXISTS branch_eligibility;
DROP TABLE IF EXISTS student_applications;
DROP TABLE IF EXISTS role_records;
DROP TABLE IF EXISTS company_records;
DROP TABLE IF EXISTS student_documents;
DROP TABLE IF EXISTS student_records;
DROP TABLE IF EXISTS user_credentials;
CREATE TABLE user_credentials (
    enrollment_number VARCHAR (32) PRIMARY KEY NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    password VARCHAR (512),
    admin_verified BOOLEAN DEFAULT FALSE,
    blocked BOOLEAN DEFAULT FALSE,
    OTU BOOLEAN DEFAULT FALSE
);
CREATE TABLE student_records (
    enrollment_number VARCHAR (32) PRIMARY KEY NOT NULL,
    program VARCHAR (32) NOT NULL,
    CONSTRAINT program_enums CHECK (
        program IN (
            'BTech',
            'BE',
            'BE(PTDC)',
            'BTech(PTDC)',
            'MTech',
            'MCA',
            'MSc',
            'PhD'
        )
    ),
    name VARCHAR (128) NOT NULL,
    gender VARCHAR (32),
    CONSTRAINT gender_enums CHECK (gender IN ('male', 'female', 'other')),
    date_of_birth DATE,
    contact VARCHAR(16),
    branch VARCHAR(64) NOT NULL,
    CONSTRAINT branch_enums CHECK (
        branch IN (
            '_0',
            '_1',
            '_2',
            '_3',
            '_4',
            '_5',
            '_6',
            '_7',
            '_8',
            '_9',
            '_10',
            '_11'
        )
    ),
    semester INT NOT NULL,
    CONSTRAINT sem_limit CHECK (
        semester BETWEEN 1 AND 8
    ),
    batch INT NOT NULL,
    cgpa FLOAT(1) NOT NULL,
    active_backlogs INT NOT NULL,
    experience INT DEFAULT 0
);
CREATE TABLE student_documents (
    document_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    enrollment_number VARCHAR (32) NOT NULL REFERENCES student_records(enrollment_number) ON DELETE CASCADE,
    category VARCHAR (32),
    CONSTRAINT category_enums CHECK (
        category in ('document', 'resume', 'certificate')
    )
);
CREATE TABLE company_records (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR (128) NOT NULL,
    company_description TEXT
);
CREATE TABLE role_records (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    company_id INT NOT NULL REFERENCES company_records(id) ON DELETE CASCADE,
    role VARCHAR(128) NOT NULL,
    CONSTRAINT job UNIQUE (company_id, role),
    role_description TEXT,
    required_cgpa FLOAT(1) DEFAULT 0,
    required_experience INT DEFAULT 0,
    active_backlogs NUMERIC DEFAULT 'infinity',
    compensation INT,
    benefits TEXT,
    job_location TEXT,
    bond_details TEXT,
    hiring_process TEXT,
    drive_status VARCHAR (128) NOT NULL,
    created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deadline TIMESTAMPTZ NOT NULL,
    CONSTRAINT valid_deadline CHECK (created_on <= deadline)
);
CREATE TABLE student_applications (
    enrollment_number VARCHAR (32) NOT NULL REFERENCES student_records(enrollment_number) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES role_records(id) ON DELETE CASCADE,
    CONSTRAINT application_id PRIMARY KEY(enrollment_number, role_id),
    resume_id VARCHAR (512) NOT NULL,
    selection_status BOOLEAN
);
CREATE TABLE branch_eligibility (
    role_id INT PRIMARY KEY NOT NULL REFERENCES role_records(id) ON DELETE CASCADE,
    _0 BOOLEAN NOT NULL DEFAULT FALSE,
    _1 BOOLEAN NOT NULL DEFAULT FALSE,
    _2 BOOLEAN NOT NULL DEFAULT FALSE,
    _3 BOOLEAN NOT NULL DEFAULT FALSE,
    _4 BOOLEAN NOT NULL DEFAULT FALSE,
    _5 BOOLEAN NOT NULL DEFAULT FALSE,
    _6 BOOLEAN NOT NULL DEFAULT FALSE,
    _7 BOOLEAN NOT NULL DEFAULT FALSE,
    _8 BOOLEAN NOT NULL DEFAULT FALSE,
    _9 BOOLEAN NOT NULL DEFAULT FALSE,
    _10 BOOLEAN NOT NULL DEFAULT FALSE,
    _11 BOOLEAN NOT NULL DEFAULT FALSE
);
INSERT INTO user_credentials (
        enrollment_number,
        email,
        password,
        admin_verified
    )
VALUES (
        '0201EC191089',
        'kn1jt.soumya@inbox.testmail.app',
        '$2b$10$bAssLSK15AFshJ1MotinuOhy9R/8krf1xQUrIkY233woQdQttgDEq',
        'true'
    ),
    (
        '0201EC191062',
        'kn1jt.ria@inbox.testmail.app',
        '$2b$10$bAssLSK15AFshJ1MotinuOhy9R/8krf1xQUrIkY233woQdQttgDEq',
        'false'
    ),
    (
        'admin',
        'kn1jt.admin@inbox.testmail.app',
        '$2b$10$8TMO7rbckmbs/FfJkXVUKO1IAPJIZxanHpDfrnrNvoC48FjSS826C',
        'true'
    );
INSERT INTO user_credentials (enrollment_number, email)
VALUES (
        '0201EC191005',
        'pubgkiid13579@gmail.com'
    );
INSERT INTO student_records (
        name,
        enrollment_number,
        program,
        branch,
        cgpa,
        semester,
        batch,
        gender,
        date_of_birth,
        contact,
        active_backlogs,
        experience
    )
VALUES (
        'Soumya Agrawal',
        '0201EC191089',
        'BTech',
        '_7',
        8.55,
        8,
        2019,
        'female',
        '2000-09-16',
        9876598765,
        0,
        0
    );
INSERT INTO company_records (name, company_description)
VALUES (
        'Goldman FOCKING Sachs',
        'SABSE MAST COMPANYYYYYYYYYYYYYYYYYYYYYYYYYYYYY MAJAI AA GAYI EKDAM'
    ),
    (
        'Walmart Tech',
        'BAHUT MAST COMPANYYYYYYYYYYYYYYYYY DIDI KHUSH HO GAYIIIIIII'
    ),
    ('Trilogy Innovations', 'bhery sed.');
INSERT INTO role_records (
        company_id,
        role,
        role_description,
        required_cgpa,
        required_experience,
        compensation,
        benefits,
        job_location,
        bond_details,
        hiring_process,
        drive_status,
        deadline
    )
VALUES (
        1,
        'summer analyst',
        'software development internship for 2 months',
        8,
        0,
        100000,
        'health and insurance',
        'Bengaluru, Hyderabad, Mumbai',
        'will be disclosed later.',
        'Aptitude test -> Technical test -> Technical + HR interviews(3 rounds)',
        'Aptitude test',
        '2023-06-19 20:00:00+0530'
    );
INSERT INTO branch_eligibility (
        role_id,
        _0,
        _1,
        _2,
        _3,
        _4,
        _5,
        _6,
        _7,
        _8,
        _9,
        _10,
        _11
    )
VALUES (
        1,
        'true',
        'false',
        'true',
        'true',
        'true',
        'false',
        'true',
        'true',
        'true',
        'false',
        'true',
        'true'
    );
INSERT INTO student_applications (enrollment_number, role_id, resume_id)
VALUES (
        '0201EC191089',
        1,
        'SoumyaAgrawalResume.pdf'
    );