CREATE TABLE drill_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  drill_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Shooting', 'Ball Handling', 'Passing', 'Defense', 'Conditioning', 'Agility', 'Custom')),
  duration_minutes INTEGER CHECK (duration_minutes > 0 AND duration_minutes <= 300),
  reps INTEGER CHECK (reps >= 0),
  sets INTEGER CHECK (sets >= 0),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  is_custom_drill BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE drill_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own drill sessions" ON drill_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own drill sessions" ON drill_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own drill sessions" ON drill_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own drill sessions" ON drill_sessions FOR DELETE USING (auth.uid() = user_id);
