CREATE TABLE training_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('drill', 'recovery', 'nutrition')),
  title TEXT NOT NULL,
  description TEXT,
  coaching_cue TEXT,
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  duration_minutes INTEGER,
  equipment TEXT[],
  video_url TEXT,
  image_url TEXT,
  age_restricted BOOLEAN DEFAULT FALSE,
  min_age INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE training_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view training content" ON training_content FOR SELECT USING (true);
CREATE INDEX idx_content_type ON training_content(content_type);
CREATE INDEX idx_content_category ON training_content(content_type, category);
