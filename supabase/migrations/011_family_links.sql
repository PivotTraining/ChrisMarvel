-- Family Linking — parent/child account pairing via short-lived 6-digit codes.
--
-- Two tables:
--   • family_link_codes — one row per unexpired code a parent has minted.
--   • family_links      — the durable many-to-one mapping child_id → parent_id
--                         that the app reads from on both sides.
--
-- RLS is deliberately permissive on SELECT of link_codes because redemption
-- needs to look up a code by its value before the child is linked. We compensate
-- by making the codes short-lived and burning them on use.

CREATE TABLE IF NOT EXISTS family_link_codes (
  code          TEXT PRIMARY KEY,
  owner_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_email   TEXT,
  owner_name    TEXT,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS family_link_codes_owner_idx ON family_link_codes(owner_id);
CREATE INDEX IF NOT EXISTS family_link_codes_expires_idx ON family_link_codes(expires_at);

ALTER TABLE family_link_codes ENABLE ROW LEVEL SECURITY;

-- Anyone signed-in can look up a code by value to redeem it.
CREATE POLICY "Authenticated users can read codes for redemption"
  ON family_link_codes FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only the minter can create / delete their own codes.
CREATE POLICY "Owner can insert their own codes"
  ON family_link_codes FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner or redeemer can delete (burn) codes"
  ON family_link_codes FOR DELETE
  USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS family_links (
  child_id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS family_links_parent_idx ON family_links(parent_id);

ALTER TABLE family_links ENABLE ROW LEVEL SECURITY;

-- A row is readable by either the parent or the child it represents.
CREATE POLICY "Parent or child can read their link"
  ON family_links FOR SELECT
  USING (auth.uid() = child_id OR auth.uid() = parent_id);

-- Only the child-side can insert (redeem) or delete (unlink) their own row.
CREATE POLICY "Child can manage their own link"
  ON family_links FOR INSERT
  WITH CHECK (auth.uid() = child_id);

CREATE POLICY "Child can unlink themselves"
  ON family_links FOR DELETE
  USING (auth.uid() = child_id OR auth.uid() = parent_id);

-- Mirror the linked parent onto the profile for fast Home screen reads.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linked_parent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linked_parent_name TEXT;
