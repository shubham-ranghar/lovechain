-- Create couples table
CREATE TABLE IF NOT EXISTS couples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  edit_token TEXT UNIQUE NOT NULL,
  recovery_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  content JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_couples_slug ON couples(slug);
CREATE INDEX IF NOT EXISTS idx_couples_edit_token ON couples(edit_token);

-- Enable Row Level Security (RLS)
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;

-- Allow public read access by slug (for viewing the love site)
CREATE POLICY "Allow public read by slug"
  ON couples FOR SELECT
  USING (true);

-- Allow insert (for creating new couples)
CREATE POLICY "Allow insert"
  ON couples FOR INSERT
  WITH CHECK (true);

-- Allow update by edit_token (for editing content)
CREATE POLICY "Allow update by edit_token"
  ON couples FOR UPDATE
  USING (edit_token = (edit_token));

-- Storage buckets will be created in Supabase dashboard:
-- 1. 'photos' bucket for gallery images
-- 2. 'audio' bucket for voice notes and song clips
