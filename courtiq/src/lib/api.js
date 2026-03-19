import { supabase } from './supabase';

// ── Games ──────────────────────────────────────────────
export async function getGames(userId, { limit = 50, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('user_id', userId)
    .order('game_date', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
}

export async function createGame(game) {
  const { data, error } = await supabase
    .from('games')
    .insert(game)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateGame(id, updates) {
  const { data, error } = await supabase
    .from('games')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGame(id) {
  const { error } = await supabase.from('games').delete().eq('id', id);
  if (error) throw error;
}

// ── Shot Logs ──────────────────────────────────────────
export async function getShotLogs(userId, { limit = 200, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('shot_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
}

export async function createShotLog(shot) {
  const { data, error } = await supabase
    .from('shot_logs')
    .insert(shot)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createShotLogsBatch(shots) {
  const { data, error } = await supabase
    .from('shot_logs')
    .insert(shots)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteShotLog(id) {
  const { error } = await supabase.from('shot_logs').delete().eq('id', id);
  if (error) throw error;
}

// ── Drill Sessions ─────────────────────────────────────
export async function getDrillSessions(userId, { limit = 50, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('drill_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('session_date', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
}

export async function createDrillSession(drill) {
  const { data, error } = await supabase
    .from('drill_sessions')
    .insert(drill)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDrillSession(id, updates) {
  const { data, error } = await supabase
    .from('drill_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDrillSession(id) {
  const { error } = await supabase.from('drill_sessions').delete().eq('id', id);
  if (error) throw error;
}

// ── Journal Entries ────────────────────────────────────
export async function getJournalEntries(userId, { limit = 50, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('entry_date', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
}

export async function createJournalEntry(entry) {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert(entry)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateJournalEntry(id, updates) {
  const { data, error } = await supabase
    .from('journal_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteJournalEntry(id) {
  const { error } = await supabase.from('journal_entries').delete().eq('id', id);
  if (error) throw error;
}

// ── Training Content (curated library) ─────────────────
export async function getTrainingContent({ category, contentType, difficulty, limit = 50, offset = 0 } = {}) {
  let query = supabase
    .from('training_content')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (contentType) query = query.eq('content_type', contentType);
  if (category) query = query.eq('category', category);
  if (difficulty) query = query.eq('difficulty', difficulty);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getTrainingContentById(id) {
  const { data, error } = await supabase
    .from('training_content')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// ── Saved Content ──────────────────────────────────────
export async function getSavedContent(userId) {
  const { data, error } = await supabase
    .from('saved_content')
    .select('*, training_content(*)')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveContent(userId, contentId) {
  const { data, error } = await supabase
    .from('saved_content')
    .insert({ user_id: userId, content_id: contentId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function unsaveContent(userId, contentId) {
  const { error } = await supabase
    .from('saved_content')
    .delete()
    .eq('user_id', userId)
    .eq('content_id', contentId);
  if (error) throw error;
}

// ── Dashboard Stats ────────────────────────────────────
export async function getDashboardStats(userId) {
  const [gamesRes, drillsRes, shotsRes, journalRes] = await Promise.allSettled([
    supabase.from('games').select('id, result, points', { count: 'exact' }).eq('user_id', userId),
    supabase.from('drill_sessions').select('id, duration_minutes, category', { count: 'exact' }).eq('user_id', userId),
    supabase.from('shot_logs').select('id, made, shot_type').eq('user_id', userId),
    supabase.from('journal_entries').select('id', { count: 'exact' }).eq('user_id', userId),
  ]);

  const games = gamesRes.status === 'fulfilled' ? gamesRes.value.data || [] : [];
  const drills = drillsRes.status === 'fulfilled' ? drillsRes.value.data || [] : [];
  const shots = shotsRes.status === 'fulfilled' ? shotsRes.value.data || [] : [];
  const journalCount = journalRes.status === 'fulfilled' ? (journalRes.value.count || 0) : 0;

  const wins = games.filter((g) => g.result === 'Win').length;
  const losses = games.filter((g) => g.result === 'Loss').length;
  const avgPoints = games.length > 0
    ? Math.round(games.reduce((sum, g) => sum + (g.points || 0), 0) / games.length)
    : 0;

  const totalDrillMinutes = drills.reduce((sum, d) => sum + (d.duration_minutes || 0), 0);

  const totalShots = shots.length;
  const madeShots = shots.filter((s) => s.made).length;
  const shootingPct = totalShots > 0 ? Math.round((madeShots / totalShots) * 100) : 0;

  return {
    gamesPlayed: games.length,
    wins,
    losses,
    winPct: games.length > 0 ? Math.round((wins / games.length) * 100) : 0,
    avgPoints,
    totalDrills: drills.length,
    totalDrillMinutes,
    totalShots,
    madeShots,
    shootingPct,
    journalEntries: journalCount,
  };
}
