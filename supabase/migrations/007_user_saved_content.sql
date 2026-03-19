CREATE TABLE user_saved_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES training_content(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, content_id)
);

ALTER TABLE user_saved_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own saved content" ON user_saved_content FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved content" ON user_saved_content FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved content" ON user_saved_content FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved content" ON user_saved_content FOR DELETE USING (auth.uid() = user_id);
