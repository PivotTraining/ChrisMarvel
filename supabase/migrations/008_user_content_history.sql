CREATE TABLE user_content_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES training_content(id) ON DELETE CASCADE,
  last_viewed_at TIMESTAMPTZ DEFAULT now(),
  view_count INTEGER DEFAULT 1,
  UNIQUE(user_id, content_id)
);

ALTER TABLE user_content_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own content history" ON user_content_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own content history" ON user_content_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own content history" ON user_content_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own content history" ON user_content_history FOR DELETE USING (auth.uid() = user_id);
