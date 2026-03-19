CREATE TABLE shot_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID,
  shot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  zone_id TEXT NOT NULL,
  is_made BOOLEAN NOT NULL,
  shot_type TEXT CHECK (shot_type IN ('Catch & Shoot', 'Off Dribble', 'Post Up', 'Free Throw', 'Floater', 'Hook Shot')),
  context TEXT CHECK (context IN ('Practice', 'Game', 'Warmup')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE shot_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own shot logs" ON shot_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shot logs" ON shot_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own shot logs" ON shot_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own shot logs" ON shot_logs FOR DELETE USING (auth.uid() = user_id);
