CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  condition_type TEXT NOT NULL,
  condition_value INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can earn badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE weekly_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  challenge_type TEXT NOT NULL,
  week_start DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  xp_reward INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own challenges" ON weekly_challenges FOR ALL USING (auth.uid() = user_id);
