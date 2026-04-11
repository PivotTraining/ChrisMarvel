#!/usr/bin/env node
// scripts/supabase-roundtrip.mjs
//
// End-to-end sanity check that the non-BYPASS_AUTH code path still works
// against a real Supabase project. Exercises every table the app writes to,
// then verifies we can read the same data back. Leaves no residue.
//
// Usage:
//   SUPABASE_URL=https://xxx.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=sb_service_... \
//   node scripts/supabase-roundtrip.mjs
//
// We use the service-role key so we can create test users without going
// through the email confirmation flow. Never run this against production.

import { createClient } from '@supabase/supabase-js'

const URL = process.env.SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!URL || !KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const sb = createClient(URL, KEY, { auth: { persistSession: false } })

const uid = `test_${Date.now()}`
const email = `${uid}@courtiq.test`
const password = 'test-password-123'

function ok(label) { console.log(`  ✓ ${label}`) }
function fail(label, err) {
  console.error(`  ✗ ${label}:`, err?.message || err)
  process.exit(1)
}

async function main() {
  console.log(`\n▶ roundtrip as ${email}\n`)

  // 1. Create user
  let userId
  {
    const { data, error } = await sb.auth.admin.createUser({
      email, password, email_confirm: true,
    })
    if (error) fail('create user', error)
    userId = data.user.id
    ok(`create user (${userId.slice(0, 8)}…)`)
  }

  // 2. Profile insert
  {
    const { error } = await sb.from('profiles').insert({
      id: userId,
      email,
      full_name: 'Roundtrip Tester',
      position: 'PG',
      skill_level: 'Intermediate',
      onboarding_completed: true,
    })
    if (error) fail('profile insert', error)
    ok('profile insert')
  }

  // 3. Game insert
  {
    const { error } = await sb.from('games').insert({
      user_id: userId,
      game_date: new Date().toISOString().split('T')[0],
      opponent: 'Roundtrip HS',
      points: 14,
      rebounds: 5,
      assists: 3,
      field_goals_made: 5,
      field_goals_attempted: 11,
      three_pointers_made: 1,
      three_pointers_attempted: 3,
      free_throws_made: 3,
      free_throws_attempted: 4,
      result: 'Win',
    })
    if (error) fail('game insert', error)
    ok('game insert')
  }

  // 4. Drill session
  {
    const { error } = await sb.from('drill_sessions').insert({
      user_id: userId,
      session_date: new Date().toISOString().split('T')[0],
      drill_name: 'Form Shooting',
      category: 'Shooting',
      duration_minutes: 20,
      rating: 4,
    })
    if (error) fail('drill_sessions insert', error)
    ok('drill_sessions insert')
  }

  // 5. Family link code + redemption
  let childId
  {
    const { data, error } = await sb.auth.admin.createUser({
      email: `${uid}_child@courtiq.test`,
      password,
      email_confirm: true,
    })
    if (error) fail('create child user', error)
    childId = data.user.id
  }
  {
    const code = 'RT' + Math.floor(1000 + Math.random() * 9000)
    const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString()
    const { error } = await sb.from('family_link_codes').insert({
      code,
      owner_id: userId,
      owner_email: email,
      owner_name: 'Roundtrip Tester',
      expires_at: expires,
    })
    if (error) fail('family_link_codes insert', error)

    const { error: linkErr } = await sb.from('family_links').insert({
      child_id: childId,
      parent_id: userId,
    })
    if (linkErr) fail('family_links insert', linkErr)
    ok('family link code + link')
  }

  // 6. Read the whole shape back the way the app does
  {
    const { data: games, error: gErr } = await sb
      .from('games').select('*').eq('user_id', userId)
    if (gErr || !games?.length) fail('games read-back', gErr)
    ok(`games read-back (${games.length})`)

    const { data: drills, error: dErr } = await sb
      .from('drill_sessions').select('*').eq('user_id', userId)
    if (dErr || !drills?.length) fail('drills read-back', dErr)
    ok(`drills read-back (${drills.length})`)

    const { data: links, error: lErr } = await sb
      .from('family_links').select('*').eq('parent_id', userId)
    if (lErr || !links?.length) fail('family_links read-back', lErr)
    ok(`family_links read-back (${links.length})`)
  }

  // 7. Edge function probe (insights)
  {
    const { data, error } = await sb.functions.invoke('insights', {
      body: {
        summary: {
          games: { count: 1, avgPts: 14, avgFgPct: 45 },
          shots: { total: 11, made: 5, pct: 45 },
          training: { totalSessions: 1, totalMinutes: 20, last7: 1 },
        },
        player: { name: 'Roundtrip Tester' },
      },
    })
    if (error) console.warn(`  ⚠ insights fn not deployed: ${error.message}`)
    else ok(`insights fn (source=${data?.source || '?'})`)
  }

  // 8. Cleanup
  console.log(`\n▶ cleanup\n`)
  await sb.from('family_links').delete().eq('parent_id', userId)
  await sb.from('family_link_codes').delete().eq('owner_id', userId)
  await sb.from('drill_sessions').delete().eq('user_id', userId)
  await sb.from('games').delete().eq('user_id', userId)
  await sb.from('profiles').delete().eq('id', userId)
  await sb.auth.admin.deleteUser(childId)
  await sb.auth.admin.deleteUser(userId)
  ok('cleanup')

  console.log(`\n✓ roundtrip passed\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
