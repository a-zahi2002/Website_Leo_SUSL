-- Leo Club Website Database Schema
-- This file contains the SQL schema for the Supabase database

-- ============================================
-- Table: projects
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Completed', 'Ongoing', 'Upcoming')),
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  project_date DATE,
  recruitment_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster category filtering
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- ============================================
-- Table: leadership
-- ============================================
CREATE TABLE IF NOT EXISTS leadership (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  role_type TEXT NOT NULL CHECK (role_type IN ('Executive', 'Board')),
  image_url TEXT NOT NULL,
  year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster role_type filtering
CREATE INDEX IF NOT EXISTS idx_leadership_role_type ON leadership(role_type);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to projects
CREATE POLICY "Allow public read access on projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert/update/delete projects
CREATE POLICY "Allow authenticated users to manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Enable RLS on leadership table
ALTER TABLE leadership ENABLE ROW LEVEL SECURITY;

-- Allow public read access to leadership
CREATE POLICY "Allow public read access on leadership"
  ON leadership
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert/update/delete leadership
CREATE POLICY "Allow authenticated users to manage leadership"
  ON leadership
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Insert sample projects
INSERT INTO projects (title, category, description, image_url, project_date, recruitment_link) VALUES
  ('Community Clean-Up Drive', 'Completed', 'A successful initiative to clean local parks and streets, engaging over 100 volunteers.', 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800', '2024-03-15', NULL),
  ('Blood Donation Campaign', 'Ongoing', 'Ongoing campaign to collect blood donations for local hospitals. Join us every month!', 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800', NULL, NULL),
  ('Youth Leadership Workshop', 'Upcoming', 'An upcoming workshop to develop leadership skills among university students.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', '2025-02-20', 'https://forms.google.com/example')
ON CONFLICT DO NOTHING;

-- Insert sample leadership members
INSERT INTO leadership (name, position, role_type, image_url, year) VALUES
  ('John Doe', 'President', 'Executive', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', '2024/2025'),
  ('Jane Smith', 'Vice President', 'Executive', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', '2024/2025'),
  ('Mike Johnson', 'Secretary', 'Executive', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', '2024/2025'),
  ('Sarah Williams', 'Treasurer', 'Executive', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', '2024/2025'),
  ('David Brown', 'Board Member', 'Board', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', '2024/2025'),
  ('Emily Davis', 'Board Member', 'Board', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400', '2024/2025')
ON CONFLICT DO NOTHING;
