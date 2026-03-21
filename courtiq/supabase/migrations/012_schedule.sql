-- Schedule: upcoming practices, games, and events
CREATE TABLE schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'practice' CHECK (event_type IN ('practice', 'game', 'workout', 'other')),
  event_date DATE NOT NULL,
  event_time TEXT,
  location TEXT,
  notes TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own schedule"
  ON schedule FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_schedule_user_date ON schedule(user_id, event_date);
