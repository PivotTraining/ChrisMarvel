CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  mood TEXT CHECK (mood IN ('Great', 'Good', 'Okay', 'Bad', 'Terrible')) NOT NULL,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10) NOT NULL,
  sleep_hours NUMERIC(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  confidence INTEGER CHECK (confidence >= 1 AND confidence <= 10),
  focus INTEGER CHECK (focus >= 1 AND focus <= 10),
  motivation INTEGER CHECK (motivation >= 1 AND motivation <= 10),
  stress INTEGER CHECK (stress >= 1 AND stress <= 10),
  mental_game_score NUMERIC(3,1) GENERATED ALWAYS AS (
    (confidence + focus + motivation + (11 - stress)) / 4.0
  ) STORED,
  highlights TEXT,
  improvements TEXT,
  goals_for_tomorrow TEXT,
  gratitude TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own journal entries" ON journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_journal_user_date ON journal_entries(user_id, entry_date DESC);
