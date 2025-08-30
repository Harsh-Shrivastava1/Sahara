/*
  # Fix database relationships and schema (clean version)

  1. Database Schema Fixes
    - Ensure foreign key relationships use user_id only (remove requester_id)
    - Add missing badges column to profiles
    - Add proper constraints and indexes

  2. Tables Updated
    - `profiles` - Add missing columns and fix relationships
    - `help_requests` - Use only user_id as foreign key to profiles
    - `help_offers` - Fix relationships
    - `mental_health_sessions` - Fix user relationships
    - `community_stories` - Fix author relationships

  3. Security
    - Update RLS policies for new schema
    - Ensure proper access controls
*/

-- Drop existing foreign key constraints that might be causing issues
ALTER TABLE help_requests DROP CONSTRAINT IF EXISTS help_requests_user_id_fkey;
ALTER TABLE help_requests DROP CONSTRAINT IF EXISTS help_requests_requester_id_fkey;
ALTER TABLE help_offers DROP CONSTRAINT IF EXISTS help_offers_helper_id_fkey;
ALTER TABLE mental_health_sessions DROP CONSTRAINT IF EXISTS mental_health_sessions_user_id_fkey;
ALTER TABLE community_stories DROP CONSTRAINT IF EXISTS community_stories_author_id_fkey;

-- Update profiles table to match application expectations
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS badges text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS services_offered text[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Ensure help_requests has the correct user reference column
ALTER TABLE help_requests ADD COLUMN IF NOT EXISTS user_id uuid;

-- 🔥 Drop requester_id column completely (no longer needed)
ALTER TABLE help_requests DROP COLUMN IF EXISTS requester_id;

-- Add proper foreign key constraints
ALTER TABLE help_requests 
ADD CONSTRAINT help_requests_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

ALTER TABLE help_offers 
ADD CONSTRAINT help_offers_helper_id_fkey 
FOREIGN KEY (helper_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

ALTER TABLE mental_health_sessions 
ADD CONSTRAINT mental_health_sessions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

ALTER TABLE community_stories 
ADD CONSTRAINT community_stories_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES profiles(user_id) ON DELETE SET NULL;

-- Update RLS policies for help_requests
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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_help_requests_user_id ON help_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON help_requests(status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_mental_health_sessions_user_id ON mental_health_sessions(user_id);
