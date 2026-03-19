CREATE TABLE training_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('Drill', 'Recovery', 'Nutrition')),
  title TEXT NOT NULL,
  description TEXT,
  coaching_cue TEXT,
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Elite')),
  duration_minutes INTEGER,
  equipment_needed TEXT[],
  age_restricted BOOLEAN DEFAULT false,
  min_age INTEGER,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);
