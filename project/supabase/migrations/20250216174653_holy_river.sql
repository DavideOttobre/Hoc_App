/*
  # Initial schema setup
  
  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - References auth.users
      - `email` (text) - User's email
      - `role` (text) - User's role (admin/operator)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `profiles` table
    - Add policies for:
      - Admins can read all profiles
      - Users can read their own profile
      - System can create/update profiles
*/

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'operator' CHECK (role IN ('admin', 'operator')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Allow Supabase system to create/update profiles
CREATE POLICY "Enable insert for service role only"
  ON profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Enable update for service role only"
  ON profiles
  FOR UPDATE
  TO service_role
  USING (true);

-- Create a trigger to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create the first admin user
INSERT INTO profiles (id, email, role)
SELECT 
  id,
  email,
  'admin'
FROM auth.users
WHERE email = 'admin@example.com'
ON CONFLICT (id) DO NOTHING;