import { supabase } from './supabase';

// ── Games ──────────────────────────────────────────────
export async function getGames(userId, { limit = 50, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
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

// ── Shot Sessions ──────────────────────────────────────
export async function getShotSessions(userId, { limit = 50, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('shot_sessions')
    .select('*, shots(id, shot_type, zone, made)')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
}

export async function createShotSession(session) {
  const { data, error } = await supabase
    .from('shot_sessions')
    .insert(session)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteShotSession(id) {
  const { error } = await supabase.from('shot_sessions').delete().eq('id', id);
  if (error) throw error;
}

// ── Shots ──────────────────────────────────────────────
export async function getShots(sessionId) {
  const { data, error } = await supabase
    .from('shots')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createShot(shot) {
  const { data, error } = await supabase
    .from('shots')
    .insert(shot)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createShotsBatch(shots) {
  const { data, error } = await supabase
    .from('shots')
    .insert(shots)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteShot(id) {
  const { error } = await supabase.from('shots').delete().eq('id', id);
  if (error) throw error;
}

// ── Drills ─────────────────────────────────────────────
export async function getDrills(userId, { limit = 50, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('drills')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
}

export async function createDrill(drill) {
  const { data, error } = await supabase
    .from('drills')
    .insert(drill)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDrill(id, updates) {
  const { data, error } = await supabase
    .from('drills')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDrill(id) {
  const { error } = await supabase.from('drills').delete().eq('id', id);
  if (error) throw error;
}

// ── Journal ────────────────────────────────────────────
export async function getJournalEntries(userId, { limit = 50, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
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

// ── Training Sessions ──────────────────────────────────
export async function getTrainingSessions(userId, { limit = 50, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('training_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
}

export async function createTrainingSession(session) {
  const { data, error } = await supabase
    .from('training_sessions')
    .insert(session)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTrainingSession(id, updates) {
  const { data, error } = await supabase
    .from('training_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTrainingSession(id) {
  const { error } = await supabase.from('training_sessions').delete().eq('id', id);
  if (error) throw error;
}

// ── Dashboard Stats ────────────────────────────────────
export async function getDashboardStats(userId) {
  const [gamesRes, drillsRes, sessionsRes, journalRes] = await Promise.allSettled([
    supabase.from('games').select('id, result, user_score, opponent_score', { count: 'exact' }).eq('user_id', userId),
    supabase.from('drills').select('id, duration_minutes', { count: 'exact' }).eq('user_id', userId),
    supabase.from('shot_sessions').select('id, shots(id, made)').eq('user_id', userId),
    supabase.from('journal_entries').select('id', { count: 'exact' }).eq('user_id', userId),
  ]);

  const games = gamesRes.status === 'fulfilled' ? gamesRes.value.data || [] : [];
  const drills = drillsRes.status === 'fulfilled' ? drillsRes.value.data || [] : [];
  const shotSessions = sessionsRes.status === 'fulfilled' ? sessionsRes.value.data || [] : [];
  const journalCount = journalRes.status === 'fulfilled' ? (journalRes.value.count || 0) : 0;

  const wins = games.filter((g) => g.result === 'W').length;
  const losses = games.filter((g) => g.result === 'L').length;

  const totalDrillMinutes = drills.reduce((sum, d) => sum + (d.duration_minutes || 0), 0);

  const allShots = shotSessions.flatMap((s) => s.shots || []);
  const totalShots = allShots.length;
  const madeShots = allShots.filter((s) => s.made).length;
  const shootingPct = totalShots > 0 ? Math.round((madeShots / totalShots) * 100) : 0;

  return {
    gamesPlayed: games.length,
    wins,
    losses,
    winPct: games.length > 0 ? Math.round((wins / games.length) * 100) : 0,
    totalDrills: drills.length,
    totalDrillMinutes,
    totalShots,
    madeShots,
    shootingPct,
    journalEntries: journalCount,
  };
}
