-- Game film notes / clips
CREATE TABLE film_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  tags TEXT[] DEFAULT '{}',
  quarter TEXT,
  timestamp_label TEXT,
  play_type TEXT CHECK (play_type IN ('offense', 'defense', 'transition', 'set_play', 'turnover', 'highlight', 'mistake', 'other')),
  video_url TEXT,
  thumbnail_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE film_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own film notes"
  ON film_notes FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_film_notes_user ON film_notes(user_id, created_at DESC);
CREATE INDEX idx_film_notes_game ON film_notes(game_id);
CREATE INDEX idx_film_notes_tags ON film_notes USING GIN(tags);
