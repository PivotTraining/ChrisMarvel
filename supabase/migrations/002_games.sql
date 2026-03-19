CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_date DATE NOT NULL,
  opponent TEXT,
  is_home_game BOOLEAN DEFAULT true,
  game_type TEXT CHECK (game_type IN ('League', 'Tournament', 'Pickup', 'Practice', 'Scrimmage')),
  result TEXT CHECK (result IN ('Win', 'Loss', 'Draw')),
  minutes_played INTEGER CHECK (minutes_played >= 0 AND minutes_played <= 48),
  points INTEGER DEFAULT 0 CHECK (points >= 0 AND points <= 150),
  rebounds INTEGER DEFAULT 0 CHECK (rebounds >= 0 AND rebounds <= 50),
  assists INTEGER DEFAULT 0 CHECK (assists >= 0 AND assists <= 50),
  steals INTEGER DEFAULT 0 CHECK (steals >= 0 AND steals <= 30),
  blocks INTEGER DEFAULT 0 CHECK (blocks >= 0 AND blocks <= 30),
  turnovers INTEGER DEFAULT 0 CHECK (turnovers >= 0 AND turnovers <= 30),
  fouls INTEGER DEFAULT 0 CHECK (fouls >= 0 AND fouls <= 6),
  free_throws_made INTEGER DEFAULT 0,
  free_throws_attempted INTEGER DEFAULT 0,
  field_goals_made INTEGER DEFAULT 0,
  field_goals_attempted INTEGER DEFAULT 0,
  three_pointers_made INTEGER DEFAULT 0,
  three_pointers_attempted INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own games" ON games FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own games" ON games FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own games" ON games FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own games" ON games FOR DELETE USING (auth.uid() = user_id);
