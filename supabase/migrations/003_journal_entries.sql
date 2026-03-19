CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood TEXT CHECK (mood IN ('Great', 'Good', 'Okay', 'Bad', 'Terrible')),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  confidence INTEGER CHECK (confidence >= 1 AND confidence <= 10),
  focus INTEGER CHECK (focus >= 1 AND focus <= 10),
  stress INTEGER CHECK (stress >= 1 AND stress <= 10),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  mental_game_score NUMERIC(3,1) GENERATED ALWAYS AS ((confidence + focus + (11 - stress) + sleep_quality + energy_level) / 5.0) STORED,
  goals_text TEXT,
  gratitude_text TEXT,
  reflection_text TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own journal entries" ON journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal entries" ON journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal entries" ON journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journal entries" ON journal_entries FOR DELETE USING (auth.uid() = user_id);
