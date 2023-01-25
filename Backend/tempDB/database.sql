DROP TABLE IF EXISTS student_documents;
DROP TABLE IF EXISTS student_applications;
DROP TABLE IF EXISTS role_records;
DROP TABLE IF EXISTS company_records;
DROP TABLE IF EXISTS student_records;
DROP TABLE IF EXISTS user_credentials;
CREATE TABLE user_credentials (
    enrollment_number VARCHAR (32) PRIMARY KEY NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    password VARCHAR (512),
    admin_verified BOOLEAN DEFAULT FALSE,
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
            'Civil Engineering',
            'Mechanical Engineering',
            'Electrical Engineering',
            'Electronics and Telecommunication Engineering',
            'Computer Science & Engineering',
            'Industrial and Production Engineering',
            'Information Technology Engineering',
            'Mechatronics Engineering',
            'Artificial Intelligence Engineering',
            'Applied Chemistry',
            'Applied Physics',
            'Applied Mathematics'
        )
    ),
    semester INT NOT NULL,
    CONSTRAINT sem_limit CHECK (
        semester BETWEEN 1 AND 8
    ),
    batch INT NOT NULL,
    cgpa FLOAT(1) NOT NULL,
    active_backlogs INT NOT NULL
);
CREATE TABLE student_documents (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    enrollment_number VARCHAR (32) NOT NULL REFERENCES student_records(enrollment_number) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL,
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
    required_cgpa FLOAT(1),
    eligible_branches TEXT,
    required_experience INT DEFAULT 0,
    active_backlogs INT,
    compensation INT,
    benefits TEXT,
    job_location TEXT,
    bond_details TEXT,
    hiring_process TEXT,
    drive_status VARCHAR (128) NOT NULL
);
CREATE TABLE student_applications (
    enrollment_number VARCHAR (32) NOT NULL REFERENCES student_records(enrollment_number) ON DELETE CASCADE,
    profile_id INT NOT NULL REFERENCES role_records(id) ON DELETE CASCADE,
    CONSTRAINT application_id PRIMARY KEY(enrollment_number, profile_id),
    selection_status BOOLEAN
);