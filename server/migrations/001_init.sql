-- ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('EMPLOYEE', 'TECHNICIAN', 'MANAGER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE request_type AS ENUM ('CORRECTIVE', 'PREVENTIVE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE request_status AS ENUM ('NEW', 'IN_PROGRESS', 'REPAIRED', 'SCRAP');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE request_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- TEAMS
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'EMPLOYEE',
  team_id INT NULL REFERENCES teams(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EQUIPMENT
CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  serial_number VARCHAR(120) UNIQUE NOT NULL,
  category VARCHAR(80) NOT NULL,
  department VARCHAR(80),
  assigned_employee_name VARCHAR(120),
  location VARCHAR(120) NOT NULL,
  purchase_date DATE,
  warranty_end_date DATE,
  maintenance_team_id INT NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  default_technician_id INT NULL REFERENCES users(id) ON DELETE SET NULL,
  is_scrapped BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MAINTENANCE REQUESTS
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(200) NOT NULL,
  equipment_id INT NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
  request_type request_type NOT NULL,
  priority request_priority NOT NULL DEFAULT 'MEDIUM',
  scheduled_date DATE NULL,
  status request_status NOT NULL DEFAULT 'NEW',
  assigned_to_user_id INT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_by_user_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  duration_hours NUMERIC(6,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_requests_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_equipment ON maintenance_requests(equipment_id);
CREATE INDEX IF NOT EXISTS idx_requests_scheduled ON maintenance_requests(scheduled_date);