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

-- Teams: members can view their teams
CREATE POLICY "Members can view their teams"
  ON teams FOR SELECT
  USING (id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

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
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

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
      SELECT tm2.user_id FROM team_members tm1
      JOIN team_members tm2 ON tm1.team_id = tm2.team_id
      WHERE tm1.user_id = auth.uid()
    )
  );

-- Allow teammates to view each other's games (for comparison)
CREATE POLICY "Teammates can view games"
  ON games FOR SELECT
  USING (
    user_id IN (
      SELECT tm2.user_id FROM team_members tm1
      JOIN team_members tm2 ON tm1.team_id = tm2.team_id
      WHERE tm1.user_id = auth.uid()
    )
  );
