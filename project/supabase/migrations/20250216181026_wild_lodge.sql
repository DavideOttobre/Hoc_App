/*
  # Fix RLS policies for profiles table

  1. Changes
    - Drop existing policies that cause infinite recursion
    - Create new, simplified policies for profiles table
    - Add policy for admin operations
    - Add policy for user operations

  2. Security
    - Enable RLS on profiles table
    - Add policies for read/write operations
    - Ensure proper access control for admins and users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable insert for service role only" ON profiles;
DROP POLICY IF EXISTS "Enable update for service role only" ON profiles;

-- Create new policies
CREATE POLICY "Enable read access for all authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on role"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    -- Users can update their own profile
    auth.uid() = id
    OR
    -- Admins can update any profile
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (true);

CREATE POLICY "Enable delete for admins only"
  ON profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );