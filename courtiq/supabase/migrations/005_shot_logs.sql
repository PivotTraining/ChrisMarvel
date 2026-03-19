CREATE TABLE shot_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  zone_id TEXT NOT NULL,
  shot_type TEXT CHECK (shot_type IN ('Catch & Shoot', 'Off Dribble', 'Post Up', 'Free Throw', 'Floater', 'Hook Shot')),
  made BOOLEAN NOT NULL,
  context TEXT CHECK (context IN ('Practice', 'Game', 'Warmup')) DEFAULT 'Practice',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE shot_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own shot logs" ON shot_logs FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_shots_user_date ON shot_logs(user_id, session_date DESC);
CREATE INDEX idx_shots_zone ON shot_logs(user_id, zone_id);
