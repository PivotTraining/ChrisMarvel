CREATE TABLE drill_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Ball Handling', 'Shooting', 'Finishing', 'Defense', 'Passing', 'Conditioning', 'Custom')),
  drill_name TEXT NOT NULL,
  sets INTEGER CHECK (sets >= 0),
  reps INTEGER CHECK (reps >= 0),
  duration_minutes INTEGER CHECK (duration_minutes >= 0),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  intensity TEXT CHECK (intensity IN ('Low', 'Medium', 'High')),
  notes TEXT,
  is_custom_drill BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE drill_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own drill sessions" ON drill_sessions FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_drills_user_date ON drill_sessions(user_id, session_date DESC);
