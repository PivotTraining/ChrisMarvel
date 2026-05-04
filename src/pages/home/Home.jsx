import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Target, BookHeart, Flame, TrendingUp, Award, Zap, Plus, ChevronRight, BookOpen, Timer, Users, CalendarDays, X, Dumbbell } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { useLinking } from '../../context/LinkingContext'
import useGames from '../../hooks/useGames'
import useJournal from '../../hooks/useJournal'
import useAnalytics from '../../hooks/useAnalytics'
import useGamification from '../../hooks/useGamification'
import useSchedule from '../../hooks/useSchedule'
import { getGreeting, formatDate, localToday } from '../../utils/dateUtils'
import PageWrapper from '../../components/layout/PageWrapper'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const MOOD_COLORS = {
  Great: 'var(--color-success)',
  Good: 'var(--color-info)',
  Okay: 'var(--color-warning)',
  Bad: 'var(--color-accent)',
  Terrible: 'var(--color-danger)',
}

function StatItem({ label, value }) {
  return (
    <div className="text-center">
      <p className="t-title3" style={{ color: 'var(--color-accent)' }}>{value}</p>
      <p className="t-caption" style={{ color: 'var(--color-text-sec)', marginTop: '2px' }}>{label}</p>
    </div>
  )
}

function QuickAction({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-xl transition-all duration-200 active:scale-[0.97] cursor-pointer"
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        minWidth: 0,
        padding: 'var(--space-2) var(--space-1)',
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-accent-tint)' }}
      >
        <Icon className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
      </div>
      <span className="t-caption" style={{ color: 'var(--color-text-sec)', fontWeight: 600 }}>{label}</span>
    </button>
  )
}

function ChartTooltip({ active, payload, label, valueSuffix }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>{payload[0]?.payload?.label || label}</p>
      <p className="t-body" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
        {payload[0]?.value}{valueSuffix || ''}
      </p>
    </div>
  )
}

function SectionHeader({ icon: Icon, title, actionLabel, onAction, extra }) {
  return (
    <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />}
        <h2 className="t-title3">{title}</h2>
        {extra && <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>{extra}</span>}
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-0.5 t-label"
          style={{
            color: 'var(--color-accent)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          {actionLabel}
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { myChildren } = useLinking()
  const { games, seasonAverages } = useGames()
  const { entries } = useJournal()
  const { scoringTrend, weeklyActivity } = useAnalytics()
  const { badges, weeklyChallenge, challengeProgress, level, xp, xpToNextLevel } = useGamification()
  const { upcoming, addEvent, deleteEvent, gcalLoading, refreshGoogleCalendar } = useSchedule()
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', type: 'Game', date: '', time: '' })

  const greeting = getGreeting()
  const playerName = profile?.full_name || 'Player'
  const streak = profile?.current_streak || profile?.streak_count || 0
  const lastGame = games.length > 0 ? games[0] : null
  const lastEntry = entries.length > 0 ? entries[0] : null
  const xpPct = xpToNextLevel > 0 ? Math.round(((500 - xpToNextLevel) / 500) * 100) : 100

  return (
    <PageWrapper>
      {/* === Greeting + Level === */}
      <div style={{ marginBottom: 'var(--space-1)' }}>
        <p className="t-body" style={{ color: 'var(--color-text-sec)' }}>{greeting}</p>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="t-title1">{playerName}</h1>
          {level > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-accent-tint)' }}>
              <Zap className="w-3 h-3" style={{ color: 'var(--color-accent)' }} />
              <span className="t-caption" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>Lv {level}</span>
            </div>
          )}
        </div>
        {xp > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${xpPct}%`, backgroundColor: 'var(--color-accent)' }} />
            </div>
            <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>{xp} XP</span>
          </div>
        )}
      </div>

      {/* === Streak === */}
      {streak > 0 && (
        <Card padding="sm" className="mt-4" onClick={() => navigate('/settings')} hover>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-tint)' }}>
              <Flame className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
            </div>
            <div className="flex-1">
              <p className="t-body" style={{ color: 'var(--color-text)', fontWeight: 600 }}>{streak} day streak</p>
              <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>Keep it going</p>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-sec)' }} />
          </div>
        </Card>
      )}

      {/* === Linked Players (parent view) === */}
      {myChildren && myChildren.length > 0 && (
        <div className="mt-4">
          <SectionHeader icon={Users} title="Your Players" />
          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '4px',
              marginRight: '-16px', // break out of PageWrapper padding for edge bleed
              paddingRight: '16px',
            }}
          >
            {myChildren.map((childId) => {
              // childId is opaque; display the short suffix until we fetch profile
              const label = typeof childId === 'string' ? childId.slice(0, 8) : 'Player'
              return (
                <button
                  key={childId}
                  onClick={() => navigate('/settings')}
                  style={{
                    flex: '0 0 auto',
                    minWidth: '140px',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-card)',
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--color-accent-tint)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <Users size={14} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div className="t-caption" style={{ fontWeight: 700, color: 'var(--color-text)' }}>
                    {label}…
                  </div>
                  <div className="t-caption" style={{ color: 'var(--color-text-sec)', marginTop: '2px' }}>
                    Tap to manage
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* === Quick Actions === */}
      {/* Four actions matching the four bottom-nav tabs. "Game Log" was
          removed because all saved games now flow into My IQ, and the
          duplicate entry point was confusing users about where their data
          actually lived. Journal takes its slot as a real feature. */}
      <SectionHeader icon={Zap} title="Quick Actions" />
      <div className="grid grid-cols-2 gap-2.5">
        <QuickAction icon={Timer} label="Gametime" onClick={() => navigate('/gametime')} />
        <QuickAction icon={BookHeart} label="My IQ" onClick={() => navigate('/shots')} />
        <QuickAction icon={Target} label="Drills" onClick={() => navigate('/drills')} />
        <QuickAction icon={BookOpen} label="Journal" onClick={() => navigate('/journal')} />
      </div>

      {/* === Upcoming Schedule === */}
      <div style={{ marginTop: 'var(--space-2)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-1)' }}>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
            <span className="section-label">Schedule</span>
            {gcalLoading && (
              <span className="t-caption" style={{ color: 'var(--color-text-sec)', fontSize: '10px' }}>syncing…</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refreshGoogleCalendar()}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold"
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--color-text-sec)', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: '10px',
              }}
              title="Sync Google Calendar"
            >
              <CalendarDays className="w-3 h-3" /> Sync
            </button>
            <button
              onClick={() => {
                setNewEvent({ title: '', type: 'Game', date: localToday(), time: '' })
                setShowAddEvent(true)
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{
                background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.3)',
                color: '#FF6B35', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
        </div>

        {upcoming.length === 0 ? (
          <Card padding="md">
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <CalendarDays size={24} style={{ color: 'var(--color-text-sec)', margin: '0 auto 8px' }} />
              <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>
                No upcoming sessions. Tap + to schedule a game, practice, or workout.
              </p>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {upcoming.slice(0, 4).map((evt) => {
              const d = evt.date ? new Date(evt.date + 'T12:00:00') : null
              const dateStr = d ? d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '—'
              const typeColors = { Game: '#FF6B35', Practice: '#3B82F6', Workout: '#22C55E' }
              const color = typeColors[evt.type] || '#FF6B35'
              const TypeIcon = evt.type === 'Workout' ? Dumbbell : evt.type === 'Practice' ? Target : Timer
              return (
                <Card key={evt.id} padding="sm" hover onClick={() => {
                  navigate('/gametime', { state: { game: { opponent: evt.title, game_type: evt.type } } })
                }}>
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: `${color}18`, border: `1px solid ${color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <TypeIcon size={18} style={{ color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="t-body" style={{ fontWeight: 700, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {evt.title || evt.type}
                      </div>
                      <div className="t-caption" style={{ color: 'var(--color-text-sec)', marginTop: '1px' }}>
                        {dateStr}{evt.time ? ` · ${evt.time}` : ''} · <span style={{ color, fontWeight: 700 }}>{evt.type}</span>
                        {evt.source === 'google' && <span style={{ marginLeft: '4px', opacity: 0.6 }}>📅</span>}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-sec)' }} />
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* === Add Event Modal === */}
      {showAddEvent && (
        <div
          onClick={() => setShowAddEvent(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 80,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '420px',
              background: '#0D0D1A', borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '24px 20px',
              paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
              <h3 className="t-title3" style={{ color: 'var(--color-text)' }}>Schedule Session</h3>
              <button onClick={() => setShowAddEvent(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-sec)', cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Type pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {['Game', 'Practice', 'Workout'].map((t) => {
                const colors = { Game: '#FF6B35', Practice: '#3B82F6', Workout: '#22C55E' }
                const c = colors[t]
                return (
                  <button
                    key={t}
                    onClick={() => setNewEvent((p) => ({ ...p, type: t }))}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '12px',
                      border: newEvent.type === t ? `2px solid ${c}` : '2px solid rgba(255,255,255,0.08)',
                      background: newEvent.type === t ? `${c}15` : 'rgba(255,255,255,0.03)',
                      color: newEvent.type === t ? c : 'rgba(255,255,255,0.5)',
                      fontSize: '13px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    {t}
                  </button>
                )
              })}
            </div>

            {/* Title */}
            <input
              value={newEvent.title}
              onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))}
              placeholder={newEvent.type === 'Game' ? 'Opponent or team name' : 'Session name (optional)'}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '14px', fontWeight: 600, outline: 'none',
                fontFamily: 'inherit', marginBottom: '12px', boxSizing: 'border-box',
              }}
            />

            {/* Date + Time row */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent((p) => ({ ...p, date: e.target.value }))}
                style={{
                  flex: 2, padding: '12px 14px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '14px', fontWeight: 600, outline: 'none',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                  colorScheme: 'dark',
                }}
              />
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent((p) => ({ ...p, time: e.target.value }))}
                style={{
                  flex: 1, padding: '12px 10px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '14px', fontWeight: 600, outline: 'none',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                  colorScheme: 'dark',
                }}
              />
            </div>

            {/* Save */}
            <button
              onClick={() => {
                if (!newEvent.date) return
                addEvent(newEvent)
                setShowAddEvent(false)
                setNewEvent({ title: '', type: 'Game', date: '', time: '' })
              }}
              style={{
                width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, #FF6B35, #C8490A)',
                color: '#fff', fontSize: '15px', fontWeight: 900, cursor: 'pointer',
                fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(255,107,53,0.35)',
              }}
            >
              Schedule {newEvent.type}
            </button>
          </div>
        </div>
      )}

      {/* === Season Averages === */}
      {seasonAverages && seasonAverages.gamesPlayed > 0 && (
        <>
          <SectionHeader
            icon={TrendingUp}
            title="Season Averages"
            extra={`${seasonAverages.gamesPlayed} game${seasonAverages.gamesPlayed !== 1 ? 's' : ''}`}
            actionLabel="My IQ"
            onAction={() => navigate('/shots')}
          />
          <Card padding="md">
            <div className="grid grid-cols-3 gap-3">
              <StatItem label="PPG" value={seasonAverages.ppg} />
              <StatItem label="RPG" value={seasonAverages.rpg} />
              <StatItem label="APG" value={seasonAverages.apg} />
              <StatItem label="FG%" value={`${seasonAverages.fgPct}%`} />
              <StatItem label="3P%" value={`${seasonAverages.threePct}%`} />
              <StatItem label="Win%" value={`${seasonAverages.winPct}%`} />
            </div>
          </Card>
        </>
      )}

      {/* === Recent Game === */}
      {lastGame && (
        <>
          <SectionHeader icon={Trophy} title="Recent Game" actionLabel="My IQ" onAction={() => navigate('/shots')} />
          <Card padding="md" hover onClick={() => navigate('/shots')}>
            <div className="flex items-center justify-between mb-2">
              <p className="t-body" style={{ color: 'var(--color-text)', fontWeight: 600 }}>
                {lastGame.opponent ? `vs ${lastGame.opponent}` : lastGame.game_type || 'Game'}
              </p>
              <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>{formatDate(lastGame.game_date)}</p>
            </div>
            <div className="flex items-center gap-6 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <StatItem label="PTS" value={lastGame.points || 0} />
              <StatItem label="REB" value={lastGame.rebounds || 0} />
              <StatItem label="AST" value={lastGame.assists || 0} />
            </div>
          </Card>
        </>
      )}

      {/* === Recent Journal === */}
      {lastEntry && (
        <>
          <SectionHeader icon={BookHeart} title="Recent Journal" actionLabel="All Entries" onAction={() => navigate('/journal')} />
          <Card padding="md" hover onClick={() => navigate('/journal')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: MOOD_COLORS[lastEntry.mood] || 'var(--color-text-sec)' }}
                />
                <p className="t-body" style={{ color: 'var(--color-text)', fontWeight: 600 }}>{lastEntry.mood}</p>
              </div>
              <p className="t-title3" style={{ color: 'var(--color-accent)' }}>
                {lastEntry.mental_game_score?.toFixed(1)}
              </p>
            </div>
            <p className="t-caption" style={{ color: 'var(--color-text-sec)', marginTop: '4px' }}>{formatDate(lastEntry.entry_date)}</p>
          </Card>
        </>
      )}

      {/* === Scoring Trend === */}
      {scoringTrend.length > 1 && (
        <>
          <SectionHeader icon={TrendingUp} title="Scoring Trend" actionLabel="Details" onAction={() => navigate('/shots')} />
          <Card padding="md">
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={scoringTrend}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--color-text-sec)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-sec)' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<ChartTooltip valueSuffix=" pts" />} />
                <Line type="monotone" dataKey="points" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-accent)' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}

      {/* === Weekly Activity === */}
      {weeklyActivity.length > 0 && weeklyActivity.some((d) => d.drills + d.games + d.journal > 0) && (
        <>
          <SectionHeader title="This Week" />
          <Card padding="md">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={weeklyActivity}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--color-text-sec)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-sec)' }} axisLine={false} tickLine={false} width={20} allowDecimals={false} />
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0]?.payload
                  return (
                    <div className="rounded-lg px-3 py-2" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                      <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>{d?.day}</p>
                      {d?.games > 0 && <p className="t-caption" style={{ color: 'var(--color-accent)' }}>Games: {d.games}</p>}
                      {d?.drills > 0 && <p className="t-caption" style={{ color: 'var(--color-info)' }}>Drills: {d.drills}</p>}
                      {d?.journal > 0 && <p className="t-caption" style={{ color: 'var(--color-success)' }}>Journal: {d.journal}</p>}
                    </div>
                  )
                }} />
                <Bar dataKey="games" stackId="a" fill="var(--color-accent)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="drills" stackId="a" fill="var(--color-info)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="journal" stackId="a" fill="var(--color-success)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}

      {/* === Badges === */}
      {badges.length > 0 && (
        <>
          <SectionHeader icon={Award} title="Badges" extra={`${badges.length} earned`} actionLabel="See All" onAction={() => navigate('/settings')} />
          <Card padding="md">
            <div className="flex gap-3 overflow-x-auto hide-scrollbar">
              {badges.map((b) => (
                <div key={b.id || b.badge_name} className="flex flex-col items-center gap-1 flex-shrink-0" title={b.badge_description}>
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center t-caption"
                    style={{ backgroundColor: 'var(--color-accent-tint)', color: 'var(--color-accent)', fontWeight: 700 }}
                  >
                    {b.badge_name?.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </div>
                  <span className="t-caption text-center w-14 truncate" style={{ color: 'var(--color-text-sec)' }}>{b.badge_name}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* === Weekly Challenge === */}
      {weeklyChallenge && (
        <>
          <SectionHeader icon={Target} title="Weekly Challenge" actionLabel="Start" onAction={() => navigate('/drills')} />
          <Card padding="md">
            <p className="t-body" style={{ color: 'var(--color-text)', fontWeight: 600 }}>{weeklyChallenge.challenge_name}</p>
            <p className="t-caption" style={{ color: 'var(--color-text-sec)', marginBottom: 'var(--space-2)', marginTop: '2px' }}>{weeklyChallenge.challenge_description}</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.round(challengeProgress * 100)}%`,
                    backgroundColor: weeklyChallenge.completed ? 'var(--color-success)' : 'var(--color-accent)',
                  }}
                />
              </div>
              <span className="t-caption" style={{ color: 'var(--color-text-sec)', fontWeight: 600 }}>
                {weeklyChallenge.current_value || 0}/{weeklyChallenge.target_value}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Zap className="w-3 h-3" style={{ color: 'var(--color-accent)' }} />
              <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>{weeklyChallenge.xp_reward} XP reward</span>
            </div>
          </Card>
        </>
      )}

      {/* === Training Library === */}
      <SectionHeader icon={BookOpen} title="Training Library" actionLabel="Browse" onAction={() => navigate('/training')} />
      <Card padding="md" hover onClick={() => navigate('/training')}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-info-tint)' }}>
            <BookOpen className="w-5 h-5" style={{ color: 'var(--color-info)' }} />
          </div>
          <div className="flex-1">
            <p className="t-body" style={{ color: 'var(--color-text)', fontWeight: 600 }}>Explore drills & tips</p>
            <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>Curated basketball content</p>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-sec)' }} />
        </div>
      </Card>

      {/* === Empty state if nothing logged === */}
      {games.length === 0 && entries.length === 0 && (
        <Card padding="lg" glass style={{ marginTop: 'var(--space-2)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-3)' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-2)',
                boxShadow: '0 6px 24px rgba(255,107,53,0.3)',
                fontSize: '28px',
              }}
            >
              🏀
            </div>
            <h3 className="t-title3" style={{ marginBottom: '8px' }}>
              {profile?.full_name ? `${profile.full_name}'s story starts here` : "Your player's story starts here"}
            </h3>
            <p className="t-body" style={{ color: 'var(--color-text-sec)', lineHeight: 1.6 }}>
              Log your first game and CourtIQ will start building stats, trends, and insights automatically.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button onClick={() => navigate('/gametime')}>
              <Timer size={16} /> Start Gametime
            </Button>
            <Button variant="outline" onClick={() => navigate('/games')}>
              <Plus size={16} /> Log a Past Game
            </Button>
          </div>
        </Card>
      )}
    </PageWrapper>
  )
}
