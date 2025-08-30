/*
  # Fix Final Database Schema for Sahara Platform

  1. Schema Updates
    - Ensure help_requests table has correct foreign key relationships
    - Add missing columns to profiles table
    - Fix all foreign key constraints to match actual schema
    
  2. Security
    - Update RLS policies for corrected schema
    - Ensure proper access controls
    
  3. Data Integrity
    - Add proper constraints and defaults
    - Ensure all relationships work correctly
*/

-- First, let's ensure the profiles table has all required columns
DO $$
BEGIN
  -- Add badges column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'badges'
  ) THEN
    ALTER TABLE profiles ADD COLUMN badges text[] DEFAULT '{}';
  END IF;

  -- Add services_offered column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'services_offered'
  ) THEN
    ALTER TABLE profiles ADD COLUMN services_offered text[] DEFAULT '{}';
  END IF;

  -- Add role column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user';
  END IF;
END $$;

-- Update help_requests table to ensure it has the correct structure
DO $$
BEGIN
  -- Add user_id column if it doesn't exist (it should exist based on schema)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'help_requests' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE help_requests ADD COLUMN user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE;
  END IF;

  -- Ensure requester_id exists and references profiles correctly
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'help_requests' AND column_name = 'requester_id'
  ) THEN
    ALTER TABLE help_requests ADD COLUMN requester_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update RLS policies for help_requests to work with actual schema
DROP POLICY IF EXISTS "Anyone can view help requests" ON help_requests;
DROP POLICY IF EXISTS "Users can create help requests" ON help_requests;
DROP POLICY IF EXISTS "Users can update their own requests" ON help_requests;

CREATE POLICY "Anyone can view help requests"
  ON help_requests
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create help requests"
  ON help_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests"
  ON help_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure mental_health_sessions table exists and has correct structure
CREATE TABLE IF NOT EXISTS mental_health_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  session_type text NOT NULL,
  mood_before integer,
  mood_after integer,
  session_notes text,
  crisis_detected boolean DEFAULT false,
  duration_minutes integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mental_health_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own sessions" ON mental_health_sessions;
DROP POLICY IF EXISTS "Users can create their own sessions" ON mental_health_sessions;

CREATE POLICY "Users can view their own sessions"
  ON mental_health_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON mental_health_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Ensure community_stories table exists and has correct structure
CREATE TABLE IF NOT EXISTS community_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES profiles(user_id) ON DELETE SET NULL,
  title text,
  content text NOT NULL,
  is_anonymous boolean DEFAULT true,
  category text,
  likes_count integer DEFAULT 0,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view approved stories" ON community_stories;
DROP POLICY IF EXISTS "Users can create stories" ON community_stories;

CREATE POLICY "Anyone can view approved stories"
  ON community_stories
  FOR SELECT
  TO public
  USING (is_approved = true);

CREATE POLICY "Users can create stories"
  ON community_stories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id OR author_id IS NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_help_requests_user_id ON help_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON help_requests(status);
CREATE INDEX IF NOT EXISTS idx_mental_health_sessions_user_id ON mental_health_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_community_stories_approved ON community_stories(is_approved);
