/*
  # HOC Database Schema Update

  This migration safely creates or updates the HOC database schema, checking for existing tables.

  1. Tables
    - Checks for existing tables before creation
    - Creates tables if they don't exist
    - Adds proper foreign key constraints

  2. Security
    - Enables RLS on all tables
    - Adds policies for authenticated users

  3. Performance
    - Adds indexes for frequently accessed columns
*/

-- Create tables if they don't exist
DO $$ 
BEGIN
    -- Create creators table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'creators') THEN
        CREATE TABLE creators (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            first_name text NOT NULL,
            last_name text NOT NULL,
            created_at timestamptz DEFAULT now()
        );
    END IF;

    -- Create operators table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'operators') THEN
        CREATE TABLE operators (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            first_name text NOT NULL,
            last_name text NOT NULL,
            email text NOT NULL,
            created_at timestamptz DEFAULT now()
        );
    END IF;

    -- Create managers table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'managers') THEN
        CREATE TABLE managers (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            first_name text NOT NULL,
            last_name text NOT NULL,
            email text NOT NULL,
            created_at timestamptz DEFAULT now()
        );
    END IF;

    -- Create manager_operator_relations table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'manager_operator_relations') THEN
        CREATE TABLE manager_operator_relations (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            operator_id uuid NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
            manager_id uuid NOT NULL REFERENCES managers(id) ON DELETE CASCADE,
            created_at timestamptz DEFAULT now()
        );
    END IF;

    -- Create availability table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'availability') THEN
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
    END IF;

    -- Create shift_earnings table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'shift_earnings') THEN
        CREATE TABLE shift_earnings (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            earnings numeric(10,2) NOT NULL,
            availability_id uuid NOT NULL REFERENCES availability(id) ON DELETE CASCADE,
            created_at timestamptz DEFAULT now()
        );
    END IF;

    -- Create users table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        CREATE TABLE users (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            username text NOT NULL,
            of_unique_id text UNIQUE NOT NULL,
            created_at timestamptz DEFAULT now()
        );
    END IF;

    -- Create user_notes table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_notes') THEN
        CREATE TABLE user_notes (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            note text NOT NULL,
            user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at timestamptz DEFAULT now()
        );
    END IF;

    -- Create requests table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'requests') THEN
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
    END IF;
END $$;

-- Enable Row Level Security on all tables
DO $$ 
BEGIN
    EXECUTE 'ALTER TABLE creators ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE operators ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE managers ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE manager_operator_relations ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE availability ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE shift_earnings ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE users ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE requests ENABLE ROW LEVEL SECURITY';
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Create or replace policies for each table
DO $$ 
BEGIN
    -- Creators policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'creators' AND policyname = 'Enable read access for authenticated users') THEN
        CREATE POLICY "Enable read access for authenticated users" ON creators
            FOR SELECT TO authenticated USING (true);
    END IF;

    -- Operators policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'operators' AND policyname = 'Enable read access for authenticated users') THEN
        CREATE POLICY "Enable read access for authenticated users" ON operators
            FOR SELECT TO authenticated USING (true);
    END IF;

    -- Managers policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'managers' AND policyname = 'Enable read access for authenticated users') THEN
        CREATE POLICY "Enable read access for authenticated users" ON managers
            FOR SELECT TO authenticated USING (true);
    END IF;

    -- Manager_operator_relations policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'manager_operator_relations' AND policyname = 'Enable read access for authenticated users') THEN
        CREATE POLICY "Enable read access for authenticated users" ON manager_operator_relations
            FOR SELECT TO authenticated USING (true);
    END IF;

    -- Availability policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'availability' AND policyname = 'Enable read access for authenticated users') THEN
        CREATE POLICY "Enable read access for authenticated users" ON availability
            FOR SELECT TO authenticated USING (true);
    END IF;

    -- Shift_earnings policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'shift_earnings' AND policyname = 'Enable read access for authenticated users') THEN
        CREATE POLICY "Enable read access for authenticated users" ON shift_earnings
            FOR SELECT TO authenticated USING (true);
    END IF;

    -- Users policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'users' AND policyname = 'Enable read access for authenticated users') THEN
        CREATE POLICY "Enable read access for authenticated users" ON users
            FOR SELECT TO authenticated USING (true);
    END IF;

    -- User_notes policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'user_notes' AND policyname = 'Enable read access for authenticated users') THEN
        CREATE POLICY "Enable read access for authenticated users" ON user_notes
            FOR SELECT TO authenticated USING (true);
    END IF;

    -- Requests policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'requests' AND policyname = 'Enable read access for authenticated users') THEN
        CREATE POLICY "Enable read access for authenticated users" ON requests
            FOR SELECT TO authenticated USING (true);
    END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
    -- Manager_operator_relations indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_manager_operator_relations_operator') THEN
        CREATE INDEX idx_manager_operator_relations_operator ON manager_operator_relations(operator_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_manager_operator_relations_manager') THEN
        CREATE INDEX idx_manager_operator_relations_manager ON manager_operator_relations(manager_id);
    END IF;

    -- Availability indexes
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'availability' 
        AND column_name = 'manager_operator_id'
    ) THEN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_availability_manager_operator') THEN
            CREATE INDEX idx_availability_manager_operator ON availability(manager_operator_id);
        END IF;
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'availability' 
        AND column_name = 'creator_id'
    ) THEN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_availability_creator') THEN
            CREATE INDEX idx_availability_creator ON availability(creator_id);
        END IF;
    END IF;

    -- Shift_earnings indexes
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'shift_earnings' 
        AND column_name = 'availability_id'
    ) THEN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_shift_earnings_availability') THEN
            CREATE INDEX idx_shift_earnings_availability ON shift_earnings(availability_id);
        END IF;
    END IF;

    -- User_notes indexes
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_notes' 
        AND column_name = 'user_id'
    ) THEN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_user_notes_user') THEN
            CREATE INDEX idx_user_notes_user ON user_notes(user_id);
        END IF;
    END IF;

    -- Requests indexes
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'requests' 
        AND column_name = 'user_id'
    ) THEN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_requests_user') THEN
            CREATE INDEX idx_requests_user ON requests(user_id);
        END IF;
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'requests' 
        AND column_name = 'manager_operator_id'
    ) THEN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_requests_manager_operator') THEN
            CREATE INDEX idx_requests_manager_operator ON requests(manager_operator_id);
        END IF;
    END IF;
END $$;