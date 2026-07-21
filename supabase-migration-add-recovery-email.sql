-- Migration: Add recovery_email column to couples table
-- Run this in Supabase SQL Editor if you have existing data

ALTER TABLE couples ADD COLUMN IF NOT EXISTS recovery_email TEXT;

-- Add comment to document the column
COMMENT ON COLUMN couples.recovery_email IS 'Optional email for edit link recovery';
