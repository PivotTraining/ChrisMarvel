-- Recruiting profile extension
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS height TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weight TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS graduation_year INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS jersey_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS highlight_video_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS recruiting_bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS recruiting_slug TEXT UNIQUE;

-- Public profiles: allow anyone to view if recruiting_profile_public is true
CREATE POLICY "Public recruiting profiles visible"
  ON profiles FOR SELECT
  USING (recruiting_profile_public = true);

-- Public games for public profiles
CREATE POLICY "Public profile games visible"
  ON games FOR SELECT
  USING (
    user_id IN (SELECT id FROM profiles WHERE recruiting_profile_public = true)
  );
