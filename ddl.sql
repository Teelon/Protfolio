-- Create tables for portfolio database

-- Resume Profile table
CREATE TABLE IF NOT EXISTS resume_profile (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    linkedin TEXT,
    title TEXT NOT NULL,
    summary TEXT,
    github_link TEXT,
    bio_photo TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    location TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    gpa TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Experience table
CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    position TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    employment_type TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    description TEXT[],
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    organization TEXT,
    start_date DATE,
    end_date DATE,
    description TEXT[],
    technologies TEXT[],
    image_url TEXT,
    github_url TEXT,
    demo_url TEXT,
    slug VARCHAR(255),
    summary TEXT,
    role VARCHAR(255),
    goal TEXT,
    skills TEXT[],
    tools TEXT[],
    tags TEXT[],
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    skills TEXT[] NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Volunteering table
CREATE TABLE IF NOT EXISTS volunteering (
    id SERIAL PRIMARY KEY,
    position TEXT NOT NULL,
    organization TEXT NOT NULL,
    location TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT[],
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    allow_registration BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_experience_current ON experience(current);