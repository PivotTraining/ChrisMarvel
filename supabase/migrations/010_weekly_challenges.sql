CREATE TABLE weekly_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_name TEXT NOT NULL,
  challenge_description TEXT,
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  week_start DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  xp_reward INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own weekly challenges" ON weekly_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weekly challenges" ON weekly_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own weekly challenges" ON weekly_challenges FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own weekly challenges" ON weekly_challenges FOR DELETE USING (auth.uid() = user_id);
