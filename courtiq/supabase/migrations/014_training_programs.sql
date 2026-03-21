-- Training programs (multi-week structured plans)
CREATE TABLE training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Elite')) DEFAULT 'Intermediate',
  duration_weeks INTEGER NOT NULL DEFAULT 4,
  focus_areas TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('active', 'paused', 'completed', 'archived')) DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Program days (individual workout sessions within a program)
CREATE TABLE program_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES training_programs(id) ON DELETE CASCADE NOT NULL,
  week_number INTEGER NOT NULL,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  drills JSONB DEFAULT '[]',
  duration_minutes INTEGER DEFAULT 45,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(program_id, week_number, day_number)
);

-- RLS
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own programs"
  ON training_programs FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users manage own program days"
  ON program_days FOR ALL
  USING (program_id IN (SELECT id FROM training_programs WHERE user_id = auth.uid()))
  WITH CHECK (program_id IN (SELECT id FROM training_programs WHERE user_id = auth.uid()));

-- Index for fast lookups
CREATE INDEX idx_program_days_program ON program_days(program_id, week_number, day_number);
