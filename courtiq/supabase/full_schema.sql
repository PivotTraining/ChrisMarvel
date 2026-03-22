-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  date_of_birth DATE,
  position TEXT CHECK (position IN ('PG', 'SG', 'SF', 'PF', 'C')),
  skill_level TEXT CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  streak_freeze_used_this_week BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  recruiting_profile_public BOOLEAN DEFAULT FALSE,
  notification_streak_reminders BOOLEAN DEFAULT TRUE,
  notification_weekly_summary BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_date DATE NOT NULL,
  opponent TEXT,
  location TEXT,
  game_type TEXT CHECK (game_type IN ('League', 'Tournament', 'Pickup', 'Practice', 'Scrimmage')) DEFAULT 'League',
  result TEXT CHECK (result IN ('Win', 'Loss', 'Draw')),
  minutes_played INTEGER CHECK (minutes_played >= 0 AND minutes_played <= 60),
  points INTEGER DEFAULT 0 CHECK (points >= 0 AND points <= 150),
  rebounds INTEGER DEFAULT 0 CHECK (rebounds >= 0 AND rebounds <= 50),
  assists INTEGER DEFAULT 0 CHECK (assists >= 0 AND assists <= 50),
  steals INTEGER DEFAULT 0 CHECK (steals >= 0 AND steals <= 30),
  blocks INTEGER DEFAULT 0 CHECK (blocks >= 0 AND blocks <= 30),
  turnovers INTEGER DEFAULT 0 CHECK (turnovers >= 0 AND turnovers <= 30),
  fouls INTEGER DEFAULT 0 CHECK (fouls >= 0 AND fouls <= 10),
  fg_made INTEGER DEFAULT 0 CHECK (fg_made >= 0),
  fg_attempted INTEGER DEFAULT 0 CHECK (fg_attempted >= 0),
  three_made INTEGER DEFAULT 0 CHECK (three_made >= 0),
  three_attempted INTEGER DEFAULT 0 CHECK (three_attempted >= 0),
  ft_made INTEGER DEFAULT 0 CHECK (ft_made >= 0),
  ft_attempted INTEGER DEFAULT 0 CHECK (ft_attempted >= 0),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  performance_rating INTEGER CHECK (performance_rating >= 1 AND performance_rating <= 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own games" ON games FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_games_user_date ON games(user_id, game_date DESC);
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  mood TEXT CHECK (mood IN ('Great', 'Good', 'Okay', 'Bad', 'Terrible')) NOT NULL,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10) NOT NULL,
  sleep_hours NUMERIC(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  confidence INTEGER CHECK (confidence >= 1 AND confidence <= 10),
  focus INTEGER CHECK (focus >= 1 AND focus <= 10),
  motivation INTEGER CHECK (motivation >= 1 AND motivation <= 10),
  stress INTEGER CHECK (stress >= 1 AND stress <= 10),
  mental_game_score NUMERIC(3,1) GENERATED ALWAYS AS (
    (confidence + focus + motivation + (11 - stress)) / 4.0
  ) STORED,
  highlights TEXT,
  improvements TEXT,
  goals_for_tomorrow TEXT,
  gratitude TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own journal entries" ON journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_journal_user_date ON journal_entries(user_id, entry_date DESC);
CREATE TABLE drill_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Ball Handling', 'Shooting', 'Finishing', 'Defense', 'Passing', 'Conditioning', 'Custom')),
  drill_name TEXT NOT NULL,
  sets INTEGER CHECK (sets >= 0),
  reps INTEGER CHECK (reps >= 0),
  duration_minutes INTEGER CHECK (duration_minutes >= 0),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  intensity TEXT CHECK (intensity IN ('Low', 'Medium', 'High')),
  notes TEXT,
  is_custom_drill BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE drill_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own drill sessions" ON drill_sessions FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_drills_user_date ON drill_sessions(user_id, session_date DESC);
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
CREATE TABLE training_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('drill', 'recovery', 'nutrition')),
  title TEXT NOT NULL,
  description TEXT,
  coaching_cue TEXT,
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  duration_minutes INTEGER,
  equipment TEXT[],
  video_url TEXT,
  image_url TEXT,
  age_restricted BOOLEAN DEFAULT FALSE,
  min_age INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE training_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view training content" ON training_content FOR SELECT USING (true);
CREATE INDEX idx_content_type ON training_content(content_type);
CREATE INDEX idx_content_category ON training_content(content_type, category);
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
-- Seed training content: drills, recovery, and nutrition
-- Migration 009

-- ============================================================
-- DRILLS (content_type = 'drill')
-- ============================================================

INSERT INTO training_content
  (content_type, title, description, coaching_cue, category, difficulty, duration_minutes, equipment, video_url, image_url, age_restricted, min_age, is_featured, tags)
VALUES
  (
    'drill', 'Mikan Drill',
    'A classic finishing drill where you alternate layups from each side of the basket without letting the ball touch the ground. Builds touch and rhythm around the rim.',
    'Keep the ball high—never bring it below your chin between finishes.',
    'Finishing', 'Beginner', 10,
    ARRAY['basketball', 'hoop'],
    NULL, 'https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, TRUE,
    ARRAY['layups', 'finishing', 'fundamentals']
  ),
  (
    'drill', 'Pound Dribble Series',
    'Stationary ball-handling drill focusing on hard, low dribbles with each hand. Develops grip strength, control, and a feel for the ball.',
    'Pound the ball as hard as you can—the floor is your enemy.',
    'Ball Handling', 'Beginner', 10,
    ARRAY['basketball'],
    NULL, 'https://images.pexels.com/photos/8084841/pexels-photo-8084841.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['dribbling', 'ball handling', 'fundamentals']
  ),
  (
    'drill', 'Figure 8 Dribbles',
    'Weave the ball in a figure-8 pattern around and through your legs while stationary. Improves hand speed, coordination, and ambidexterity.',
    'Stay low in an athletic stance and keep your eyes up.',
    'Ball Handling', 'Beginner', 8,
    ARRAY['basketball'],
    NULL, 'https://images.pexels.com/photos/8084841/pexels-photo-8084841.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['dribbling', 'coordination', 'ball handling']
  ),
  (
    'drill', 'Crossover Combo',
    'Perform in-and-out, between-the-legs, and behind-the-back crossovers in sequence while advancing up the court. Builds live-game combo moves.',
    'Sell the first move before exploding into the second.',
    'Ball Handling', 'Intermediate', 15,
    ARRAY['basketball', 'cones'],
    NULL, 'https://images.pexels.com/photos/8084841/pexels-photo-8084841.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, TRUE,
    ARRAY['dribbling', 'moves', 'ball handling']
  ),
  (
    'drill', 'Spot-Up Shooting',
    'Catch and shoot from five marked spots around the arc, focusing on footwork and a consistent release. Track makes out of 10 at each spot.',
    'Land in your shot before the ball arrives—feet set, hands ready.',
    'Shooting', 'Beginner', 15,
    ARRAY['basketball', 'hoop'],
    NULL, 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['shooting', 'catch and shoot', 'footwork']
  ),
  (
    'drill', 'Free Throw Routine',
    'Practice a repeatable pre-shot routine and shoot sets of 10 free throws with a focus on rhythm and follow-through. Essential for late-game composure.',
    'Find your routine and never skip it—same breaths, same bounce, every time.',
    'Shooting', 'Beginner', 10,
    ARRAY['basketball', 'hoop'],
    NULL, 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['free throws', 'shooting', 'routine']
  ),
  (
    'drill', '3-Point Circuit',
    'Move around seven three-point stations (corners, wings, top, slots) taking two shots at each before rotating. Simulates game-speed relocation.',
    'Sprint to the spot, gather your feet, then fire—don''t rush the release itself.',
    'Shooting', 'Intermediate', 20,
    ARRAY['basketball', 'hoop', 'cones'],
    NULL, 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, TRUE,
    ARRAY['three pointers', 'shooting', 'conditioning']
  ),
  (
    'drill', 'Pull-Up Jumper',
    'Attack off the dribble and pull up for a mid-range jumper from various angles. Focuses on deceleration, balance, and shooting off movement.',
    'Plant your inside foot hard to kill momentum before you rise.',
    'Shooting', 'Advanced', 20,
    ARRAY['basketball', 'hoop', 'cones'],
    NULL, 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['mid-range', 'shooting', 'advanced moves']
  ),
  (
    'drill', 'Euro Step Finishes',
    'Drive baseline and execute euro-step finishes with both hands, alternating sides. Develops body control and the ability to avoid shot-blockers.',
    'Your first step should freeze the defender, your second step goes around them.',
    'Finishing', 'Intermediate', 15,
    ARRAY['basketball', 'hoop', 'cones'],
    NULL, 'https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['euro step', 'finishing', 'footwork']
  ),
  (
    'drill', 'Closeout Drill',
    'Sprint from the paint to contest a shooter on the perimeter, then slide to recover on a drive. Trains the balance between closing out hard and staying under control.',
    'High hands, choppy feet—never fly past the shooter.',
    'Defense', 'Intermediate', 12,
    ARRAY['basketball', 'cones'],
    NULL, 'https://images.pexels.com/photos/2874717/pexels-photo-2874717.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['defense', 'closeouts', 'agility']
  ),
  (
    'drill', 'Slide & Recover',
    'Defensive sliding drill across the lane and back, emphasizing low hips and quick lateral movement. Builds the base for on-ball defense.',
    'Stay low—if your hips rise, you lose.',
    'Defense', 'Beginner', 10,
    ARRAY['cones'],
    NULL, 'https://images.pexels.com/photos/2874717/pexels-photo-2874717.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['defense', 'footwork', 'lateral quickness']
  ),
  (
    'drill', 'Chest Pass Wall Drill',
    'Stand 6-8 feet from a wall and deliver rapid chest passes, catching and releasing as quickly as possible. Builds passing accuracy and hand strength.',
    'Step into every pass and snap your wrists—thumbs should point down on the follow-through.',
    'Passing', 'Beginner', 8,
    ARRAY['basketball', 'wall'],
    NULL, 'https://images.pexels.com/photos/1080882/pexels-photo-1080882.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['passing', 'fundamentals', 'hand strength']
  ),
  (
    'drill', 'Skip Pass Series',
    'Practice cross-court skip passes to a partner or target from different positions. Develops the vision and zip needed to swing the ball against a zone defense.',
    'Throw off your back foot and aim chest-high at your target.',
    'Passing', 'Intermediate', 12,
    ARRAY['basketball', 'cones', 'partner'],
    NULL, 'https://images.pexels.com/photos/1080882/pexels-photo-1080882.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['passing', 'court vision', 'zone offense']
  ),
  (
    'drill', 'Suicide Sprints',
    'Full-court sprint intervals touching the near free-throw line, half court, far free-throw line, and far baseline. Builds game-speed endurance and mental toughness.',
    'Touch every line and drive through the last sprint—don''t coast.',
    'Conditioning', 'Intermediate', 15,
    ARRAY[]::TEXT[],
    NULL, 'https://images.pexels.com/photos/3771071/pexels-photo-3771071.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['conditioning', 'speed', 'endurance']
  ),
  (
    'drill', 'Defensive Shuffle Ladder',
    'Combine lateral shuffles, backpedals, and sprints through an agility ladder pattern. An advanced conditioning circuit that mirrors defensive rotations.',
    'Stay on the balls of your feet—flat feet are dead feet.',
    'Conditioning', 'Advanced', 20,
    ARRAY['agility ladder', 'cones'],
    NULL, 'https://images.pexels.com/photos/3771071/pexels-photo-3771071.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['conditioning', 'agility', 'defense']
  );

-- ============================================================
-- RECOVERY (content_type = 'recovery')
-- ============================================================

INSERT INTO training_content
  (content_type, title, description, coaching_cue, category, difficulty, duration_minutes, equipment, video_url, image_url, age_restricted, min_age, is_featured, tags)
VALUES
  (
    'recovery', 'Dynamic Warm-Up Routine',
    'A full-body warm-up sequence including high knees, butt kicks, leg swings, and arm circles to prepare joints and muscles for practice or a game.',
    'Move through each exercise with purpose—this is not a cool-down.',
    'Mobility', 'Beginner', 10,
    ARRAY[]::TEXT[],
    NULL, 'https://images.pexels.com/photos/4775199/pexels-photo-4775199.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, TRUE,
    ARRAY['warm-up', 'mobility', 'pre-game']
  ),
  (
    'recovery', 'Post-Game Stretch Sequence',
    'A guided static stretching routine targeting hamstrings, quads, hip flexors, and shoulders. Hold each stretch for 30-45 seconds to promote recovery.',
    'Breathe deeply into each stretch—never bounce.',
    'Stretching', 'Beginner', 15,
    ARRAY['yoga mat'],
    NULL, 'https://images.pexels.com/photos/3771071/pexels-photo-3771071.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['stretching', 'cool-down', 'recovery']
  ),
  (
    'recovery', 'Hip Mobility Flow',
    'A focused sequence of hip openers including 90/90 sits, pigeon stretches, and leg swings. Essential for guards and forwards who rely on lateral quickness.',
    'Don''t force depth—work at the edge of your range and let it open up.',
    'Mobility', 'Intermediate', 12,
    ARRAY['yoga mat'],
    NULL, 'https://images.pexels.com/photos/4775199/pexels-photo-4775199.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['hips', 'mobility', 'flexibility']
  ),
  (
    'recovery', 'Ankle Stability Exercises',
    'Single-leg balance progressions and band-resisted ankle movements to bulletproof the ankle joint. Critical for players with a history of sprains.',
    'Start on a flat surface; progress to a balance pad only when you feel solid.',
    'Mobility', 'Beginner', 10,
    ARRAY['resistance band', 'balance pad'],
    NULL, 'https://images.pexels.com/photos/4775199/pexels-photo-4775199.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['ankles', 'stability', 'injury prevention']
  ),
  (
    'recovery', 'Foam Roller Recovery',
    'Self-myofascial release session targeting IT bands, quads, calves, and upper back. Helps reduce soreness and improve tissue quality between games.',
    'Roll slowly—when you hit a tender spot, pause and breathe through it for 20 seconds.',
    'Rest', 'Beginner', 15,
    ARRAY['foam roller'],
    NULL, 'https://images.pexels.com/photos/5485460/pexels-photo-5485460.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, TRUE,
    ARRAY['foam rolling', 'recovery', 'soreness']
  ),
  (
    'recovery', 'Ice Bath Protocol',
    'Step-by-step guide to cold water immersion at 50-59 °F for 10-15 minutes. Reduces inflammation and speeds recovery after intense games or practices.',
    'Control your breathing on entry—slow exhales calm the shock response.',
    'Rest', 'Intermediate', 15,
    ARRAY['ice bath', 'thermometer', 'timer'],
    NULL, 'https://images.pexels.com/photos/2567016/pexels-photo-2567016.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['cold therapy', 'recovery', 'inflammation']
  ),
  (
    'recovery', 'Active Rest Day Plan',
    'A light-activity day plan including walking, gentle yoga, and mobility work to promote blood flow without taxing the body. Ideal between back-to-back game days.',
    'Keep your heart rate under 120 bpm—today is about recovery, not training.',
    'Rest', 'Beginner', 30,
    ARRAY['yoga mat'],
    NULL, 'https://images.pexels.com/photos/2567016/pexels-photo-2567016.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['rest day', 'active recovery', 'wellness']
  ),
  (
    'recovery', 'Sleep Optimization Guide',
    'Practical tips for improving sleep quality including room temperature, screen time limits, and pre-bed routines. Recovery starts with quality sleep.',
    'Set a consistent bedtime—your body clock is your best recovery tool.',
    'Rest', 'Beginner', 5,
    ARRAY[]::TEXT[],
    NULL, 'https://images.pexels.com/photos/2567016/pexels-photo-2567016.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['sleep', 'recovery', 'wellness']
  );

-- ============================================================
-- NUTRITION (content_type = 'nutrition')
-- ============================================================

INSERT INTO training_content
  (content_type, title, description, coaching_cue, category, difficulty, duration_minutes, equipment, video_url, image_url, age_restricted, min_age, is_featured, tags)
VALUES
  (
    'nutrition', 'Pre-Game Meal Plan',
    'A structured meal plan for 3-4 hours before tip-off, emphasizing complex carbs, lean protein, and low fat. Keeps energy steady without feeling heavy.',
    'Eat your big meal 3 hours out—a small snack 60 minutes before is fine.',
    'Pre-Game', 'Beginner', 5,
    ARRAY[]::TEXT[],
    NULL, 'https://images.pexels.com/photos/6632286/pexels-photo-6632286.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, TRUE,
    ARRAY['meal plan', 'pre-game', 'energy']
  ),
  (
    'nutrition', 'Post-Workout Shake Guide',
    'Recipes for protein-packed recovery shakes using whey or plant protein, fruit, and simple carbs. Designed to kickstart muscle repair within 30 minutes of training.',
    'Hit the 3:1 carb-to-protein ratio for optimal recovery.',
    'Post-Game', 'Beginner', 5,
    ARRAY['blender', 'shaker bottle'],
    NULL, 'https://images.pexels.com/photos/6740517/pexels-photo-6740517.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['protein', 'post-workout', 'shakes']
  ),
  (
    'nutrition', 'Hydration Calculator',
    'Guidelines for calculating daily water intake based on body weight, activity level, and climate. Includes electrolyte replenishment strategies for heavy sweaters.',
    'If your urine isn''t pale yellow, you''re behind on fluids.',
    'Hydration', 'Beginner', 3,
    ARRAY[]::TEXT[],
    NULL, 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['hydration', 'water', 'electrolytes']
  ),
  (
    'nutrition', 'Game Day Nutrition Timeline',
    'Hour-by-hour eating and hydration schedule from morning through post-game. Takes the guesswork out of fueling for competition.',
    'Front-load your calories early—don''t try to catch up at halftime.',
    'Pre-Game', 'Intermediate', 5,
    ARRAY[]::TEXT[],
    NULL, 'https://images.pexels.com/photos/6632286/pexels-photo-6632286.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['game day', 'meal timing', 'performance']
  ),
  (
    'nutrition', 'Healthy Snack Ideas for Athletes',
    'A curated list of portable, nutrient-dense snacks like trail mix, rice cakes with almond butter, and Greek yogurt parfaits. Perfect for between practices.',
    'Keep a snack in your bag—hunger is the enemy of focus.',
    'General', 'Beginner', 3,
    ARRAY[]::TEXT[],
    NULL, 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['snacks', 'healthy eating', 'portable']
  ),
  (
    'nutrition', 'Protein-Rich Meal Prep',
    'Weekly meal prep guide featuring grilled chicken, salmon, eggs, and legumes paired with complex carbs. Saves time and keeps your nutrition consistent.',
    'Prep on Sunday, win all week—consistency beats perfection.',
    'General', 'Intermediate', 10,
    ARRAY[]::TEXT[],
    NULL, 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['meal prep', 'protein', 'weekly plan']
  ),
  (
    'nutrition', 'Anti-Inflammatory Foods Guide',
    'A guide to foods that fight inflammation—berries, fatty fish, leafy greens, and turmeric. Helps reduce joint soreness and supports long-term joint health.',
    'Add one anti-inflammatory food to every meal—small changes add up.',
    'General', 'Beginner', 5,
    ARRAY[]::TEXT[],
    NULL, 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=600', FALSE, NULL, FALSE,
    ARRAY['anti-inflammatory', 'joint health', 'nutrition']
  );
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
-- Workout templates: save reusable drill combinations
CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  drills JSONB NOT NULL DEFAULT '[]',
  estimated_minutes INTEGER,
  category TEXT NOT NULL DEFAULT 'Custom',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own templates"
  ON workout_templates FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_workout_templates_user ON workout_templates(user_id);
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
-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  description TEXT,
  max_members INTEGER DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members (join table)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('owner', 'coach', 'player')) DEFAULT 'player',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Helper function to avoid RLS infinite recursion on team_members
CREATE OR REPLACE FUNCTION public.get_user_team_ids(uid UUID)
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT team_id FROM team_members WHERE user_id = uid;
$$;

-- Teams: members can view their teams
CREATE POLICY "Members can view their teams"
  ON teams FOR SELECT
  USING (id IN (SELECT public.get_user_team_ids(auth.uid())));

-- Teams: anyone can create a team
CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Teams: owner can update
CREATE POLICY "Owner can update team"
  ON teams FOR UPDATE
  USING (created_by = auth.uid());

-- Teams: owner can delete
CREATE POLICY "Owner can delete team"
  ON teams FOR DELETE
  USING (created_by = auth.uid());

-- Team members: members can view their teammates
CREATE POLICY "Members can view teammates"
  ON team_members FOR SELECT
  USING (team_id IN (SELECT public.get_user_team_ids(auth.uid())));

-- Team members: users can join (insert themselves)
CREATE POLICY "Users can join teams"
  ON team_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Team members: users can leave (delete themselves)
CREATE POLICY "Users can leave teams"
  ON team_members FOR DELETE
  USING (user_id = auth.uid());

-- Team members: owner can remove members
CREATE POLICY "Owner can remove members"
  ON team_members FOR DELETE
  USING (team_id IN (SELECT id FROM teams WHERE created_by = auth.uid()));

-- Allow profiles to be viewed by teammates (for leaderboard)
CREATE POLICY "Teammates can view profiles"
  ON profiles FOR SELECT
  USING (
    id IN (
      SELECT tm.user_id FROM team_members tm
      WHERE tm.team_id IN (SELECT public.get_user_team_ids(auth.uid()))
    )
  );

-- Allow teammates to view each other's games (for comparison)
CREATE POLICY "Teammates can view games"
  ON games FOR SELECT
  USING (
    user_id IN (
      SELECT tm.user_id FROM team_members tm
      WHERE tm.team_id IN (SELECT public.get_user_team_ids(auth.uid()))
    )
  );
-- Training programs (multi-week structured plans)
CREATE TABLE training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Elite')) DEFAULT 'Intermediate',
  duration_weeks INTEGER NOT NULL DEFAULT 4,
  focus_areas TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('active', 'paused', 'completed', 'archived')) DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Program days (individual workout sessions within a program)
CREATE TABLE program_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES training_programs(id) ON DELETE CASCADE NOT NULL,
  week_number INTEGER NOT NULL,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  drills JSONB DEFAULT '[]',
  duration_minutes INTEGER DEFAULT 45,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(program_id, week_number, day_number)
);

-- RLS
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own programs"
  ON training_programs FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users manage own program days"
  ON program_days FOR ALL
  USING (program_id IN (SELECT id FROM training_programs WHERE user_id = auth.uid()))
  WITH CHECK (program_id IN (SELECT id FROM training_programs WHERE user_id = auth.uid()));

-- Index for fast lookups
CREATE INDEX idx_program_days_program ON program_days(program_id, week_number, day_number);
-- In-app notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('achievement', 'milestone', 'streak', 'tip', 'team', 'system')),
  title TEXT NOT NULL,
  body TEXT,
  icon TEXT DEFAULT 'bell',
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own notifications"
  ON notifications FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read, created_at DESC);
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
-- Recruiting profile extension
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS height TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weight TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS graduation_year INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS school TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS jersey_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS highlight_video_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS recruiting_bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS recruiting_slug TEXT UNIQUE;

-- Public profiles: allow anyone to view if recruiting_profile_public is true
CREATE POLICY "Public recruiting profiles visible"
  ON profiles FOR SELECT
  USING (recruiting_profile_public = true);

-- Public games for public profiles
CREATE POLICY "Public profile games visible"
  ON games FOR SELECT
  USING (
    user_id IN (SELECT id FROM profiles WHERE recruiting_profile_public = true)
  );
