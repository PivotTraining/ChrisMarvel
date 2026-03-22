-- Fix infinite recursion in team_members RLS policies
-- The original policies on team_members SELECT referenced team_members itself,
-- and the profiles/games teammate policies also caused circular references.

-- Drop the problematic policies
DROP POLICY IF EXISTS "Members can view teammates" ON team_members;
DROP POLICY IF EXISTS "Members can view their teams" ON teams;
DROP POLICY IF EXISTS "Teammates can view profiles" ON profiles;
DROP POLICY IF EXISTS "Teammates can view games" ON games;

-- Fix team_members SELECT: users can see rows where they are the user,
-- or rows in teams they belong to (using a security definer function to avoid recursion)
CREATE OR REPLACE FUNCTION public.get_user_team_ids(uid UUID)
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT team_id FROM team_members WHERE user_id = uid;
$$;

-- Team members: users can view their own membership + teammates
CREATE POLICY "Members can view teammates"
  ON team_members FOR SELECT
  USING (team_id IN (SELECT public.get_user_team_ids(auth.uid())));

-- Teams: members can view their teams (using the helper function)
CREATE POLICY "Members can view their teams"
  ON teams FOR SELECT
  USING (id IN (SELECT public.get_user_team_ids(auth.uid())));

-- Profiles: teammates can view each other (using the helper function)
CREATE POLICY "Teammates can view profiles"
  ON profiles FOR SELECT
  USING (
    id IN (
      SELECT tm.user_id FROM team_members tm
      WHERE tm.team_id IN (SELECT public.get_user_team_ids(auth.uid()))
    )
  );

-- Games: teammates can view each other's games (using the helper function)
CREATE POLICY "Teammates can view games"
  ON games FOR SELECT
  USING (
    user_id IN (
      SELECT tm.user_id FROM team_members tm
      WHERE tm.team_id IN (SELECT public.get_user_team_ids(auth.uid()))
    )
  );
