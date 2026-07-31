-- Comment editing on support tickets: stamp when a note was last edited so
-- the activity feed can show "(edited)" — matters because Frank may have
-- already read the original text.
ALTER TABLE ticket_activity ADD COLUMN IF NOT EXISTS edited_at timestamptz;
