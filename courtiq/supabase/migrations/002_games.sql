CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_date DATE NOT NULL,
  opponent TEXT,
  location TEXT,
  game_type TEXT CHECK (game_type IN ('League', 'Tournament', 'Pickup', 'Practice', 'Scrimmage')) DEFAULT 'League',
  result TEXT CHECK (result IN ('Win', 'Loss', 'Draw')),
  minutes_played INTEGER CHECK (minutes_played >= 0 AND minutes_played <= 60),
  points INTEGER DEFAULT 0 CHECK (points >= 0 AND points <= 150),
  rebounds INTEGER DEFAULT 0 CHECK (rebounds >= 0 AND rebounds <= 50),
  assists INTEGER DEFAULT 0 CHECK (assists >= 0 AND assists <= 50),
  steals INTEGER DEFAULT 0 CHECK (steals >= 0 AND steals <= 30),
  blocks INTEGER DEFAULT 0 CHECK (blocks >= 0 AND blocks <= 30),
  turnovers INTEGER DEFAULT 0 CHECK (turnovers >= 0 AND turnovers <= 30),
  fouls INTEGER DEFAULT 0 CHECK (fouls >= 0 AND fouls <= 10),
  fg_made INTEGER DEFAULT 0 CHECK (fg_made >= 0),
  fg_attempted INTEGER DEFAULT 0 CHECK (fg_attempted >= 0),
  three_made INTEGER DEFAULT 0 CHECK (three_made >= 0),
  three_attempted INTEGER DEFAULT 0 CHECK (three_attempted >= 0),
  ft_made INTEGER DEFAULT 0 CHECK (ft_made >= 0),
  ft_attempted INTEGER DEFAULT 0 CHECK (ft_attempted >= 0),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  performance_rating INTEGER CHECK (performance_rating >= 1 AND performance_rating <= 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own games" ON games FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_games_user_date ON games(user_id, game_date DESC);
