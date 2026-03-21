-- Goals table for weekly/custom goals
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_value INTEGER NOT NULL DEFAULT 1,
  current_value INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('games', 'drills', 'shots', 'streak', 'custom')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own goals" ON goals FOR ALL USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_goals_user_status ON goals(user_id, status);
