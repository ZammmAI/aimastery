-- ============================================================
-- AI MASTERY — Supabase Database Setup
-- Run this in your Supabase SQL Editor (one time only)
-- ============================================================

-- Create the enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id          BIGSERIAL PRIMARY KEY,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  city        TEXT,
  status      TEXT DEFAULT 'pending',  -- pending | verified | rejected
  notes       TEXT,                    -- your private notes per student
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Allow the website to INSERT new enrollments (public anon key)
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert from website"
  ON enrollments FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only you (authenticated) can SELECT/UPDATE/DELETE
CREATE POLICY "Owner can read all"
  ON enrollments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owner can update"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (true);

-- ============================================================
-- After running this, go to Table Editor in Supabase
-- You'll see your 'enrollments' table ready to go
-- ============================================================
