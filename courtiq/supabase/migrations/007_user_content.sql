CREATE TABLE saved_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES training_content(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

ALTER TABLE saved_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own saved content" ON saved_content FOR ALL USING (auth.uid() = user_id);

CREATE TABLE user_content_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES training_content(id) ON DELETE CASCADE,
  last_viewed_at TIMESTAMPTZ DEFAULT NOW(),
  view_count INTEGER DEFAULT 1,
  UNIQUE(user_id, content_id)
);

ALTER TABLE user_content_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own content history" ON user_content_history FOR ALL USING (auth.uid() = user_id);
