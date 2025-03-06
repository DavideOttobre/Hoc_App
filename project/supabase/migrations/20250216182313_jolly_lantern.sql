/*
  # Fix database structure

  1. Changes
    - Drop existing tables if they exist
    - Recreate tables with correct structure
    - Set up appropriate security policies
    - Add performance indexes

  2. Tables
    - creators (first_name, last_name)
    - operators (first_name, last_name, email)
    - managers (first_name, last_name, email)
    - manager_operator_relations (links operators to managers)
    - availability (shift scheduling)
    - shift_earnings (earnings per shift)
    - users (OF platform users)
    - user_notes (notes about users)
    - requests (user requests)

  3. Security
    - Enable RLS on all tables
    - Basic read policies for authenticated users
    - Indexes for foreign keys and frequently queried columns
*/

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS user_notes CASCADE;
DROP TABLE IF EXISTS shift_earnings CASCADE;
DROP TABLE IF EXISTS availability CASCADE;
DROP TABLE IF EXISTS manager_operator_relations CASCADE;
DROP TABLE IF EXISTS managers CASCADE;
DROP TABLE IF EXISTS operators CASCADE;
DROP TABLE IF EXISTS creators CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create tables with correct structure
CREATE TABLE creators (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE operators (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE managers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE manager_operator_relations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id uuid NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    manager_id uuid NOT NULL REFERENCES managers(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE availability (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_date timestamptz NOT NULL,
    availability_date timestamptz NOT NULL,
    shift_03_07 text NOT NULL,
    shift_07_12 text NOT NULL,
    shift_12_17 text NOT NULL,
    shift_17_22 text NOT NULL,
    shift_22_03 text NOT NULL,
    manager_operator_id uuid NOT NULL REFERENCES manager_operator_relations(id) ON DELETE CASCADE,
    creator_id uuid NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE shift_earnings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    earnings numeric(10,2) NOT NULL,
    availability_id uuid NOT NULL REFERENCES availability(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username text NOT NULL,
    of_unique_id text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE user_notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    note text NOT NULL,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    request_type integer NOT NULL,
    request_notes text NOT NULL,
    amount numeric(10,2) NOT NULL,
    status text NOT NULL,
    expected_delivery_date date NOT NULL,
    actual_delivery_date date,
    delivery_notes text,
    manager_operator_id uuid NOT NULL REFERENCES manager_operator_relations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager_operator_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable read access for authenticated users" ON creators
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON operators
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON managers
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON manager_operator_relations
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON availability
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON shift_earnings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON users
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON user_notes
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON requests
    FOR SELECT TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX idx_manager_operator_relations_operator ON manager_operator_relations(operator_id);
CREATE INDEX idx_manager_operator_relations_manager ON manager_operator_relations(manager_id);
CREATE INDEX idx_availability_manager_operator ON availability(manager_operator_id);
CREATE INDEX idx_availability_creator ON availability(creator_id);
CREATE INDEX idx_shift_earnings_availability ON shift_earnings(availability_id);
CREATE INDEX idx_user_notes_user ON user_notes(user_id);
CREATE INDEX idx_requests_user ON requests(user_id);
CREATE INDEX idx_requests_manager_operator ON requests(manager_operator_id);