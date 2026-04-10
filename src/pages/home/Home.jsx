import { useNavigate } from 'react-router-dom'
import { Trophy, Target, BookHeart, Flame, TrendingUp, Award, Zap, Plus, ChevronRight, BookOpen, Crown, Timer } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { usePremium } from '../../context/PremiumContext'
import useGames from '../../hooks/useGames'
import useJournal from '../../hooks/useJournal'
import useAnalytics from '../../hooks/useAnalytics'
import useGamification from '../../hooks/useGamification'
import { getGreeting, formatDate } from '../../utils/dateUtils'
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
  const { isPro } = usePremium()
  const { games, seasonAverages } = useGames()
  const { entries } = useJournal()
  const { scoringTrend, weeklyActivity } = useAnalytics()
  const { badges, weeklyChallenge, challengeProgress, level, xp, xpToNextLevel } = useGamification()

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

      {/* === Quick Actions === */}
      <SectionHeader icon={Zap} title="Quick Actions" />
      <div className="grid grid-cols-3 gap-2.5">
        <QuickAction icon={Timer} label="Quick Game" onClick={() => navigate('/quick-game')} />
        <QuickAction icon={Trophy} label="Log Game" onClick={() => navigate('/games')} />
        <QuickAction icon={Target} label="Drill" onClick={() => navigate('/drills')} />
        <QuickAction icon={BookHeart} label="Journal" onClick={() => navigate('/journal')} />
      </div>

      {/* === Pro Upsell === */}
      {!isPro && (
        <Card padding="md" hover onClick={() => navigate('/premium')} style={{ marginTop: 'var(--space-2)', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #D97706, #FBBF24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Crown className="w-5 h-5" style={{ color: '#fff' }} />
            </div>
            <div className="flex-1">
              <p className="t-body" style={{ fontWeight: 700, color: '#FBBF24' }}>Upgrade to Pro</p>
              <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>Practice Mode, training packs, heat maps & more</p>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: '#FBBF24' }} />
          </div>
        </Card>
      )}

      {/* === Season Averages === */}
      {seasonAverages && seasonAverages.gamesPlayed > 0 && (
        <>
          <SectionHeader
            icon={TrendingUp}
            title="Season Averages"
            extra={`${seasonAverages.gamesPlayed} game${seasonAverages.gamesPlayed !== 1 ? 's' : ''}`}
            actionLabel="View All"
            onAction={() => navigate('/games')}
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
          <SectionHeader icon={Trophy} title="Recent Game" actionLabel="All Games" onAction={() => navigate('/games')} />
          <Card padding="md" hover onClick={() => navigate('/games')}>
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
          <SectionHeader icon={TrendingUp} title="Scoring Trend" actionLabel="Details" onAction={() => navigate('/games')} />
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
        <Card padding="lg" glass className="text-center" style={{ marginTop: 'var(--space-3)' }}>
          <h3 className="t-title3" style={{ marginBottom: 'var(--space-1)' }}>Welcome to CourtIQ</h3>
          <p className="t-body" style={{ color: 'var(--color-text-sec)', marginBottom: 'var(--space-3)' }}>
            Start by logging your first game or journal entry to see your stats here.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/games')}>
              <Plus size={16} /> Log a Game
            </Button>
            <Button variant="outline" onClick={() => navigate('/journal')}>Journal</Button>
          </div>
        </Card>
      )}
    </PageWrapper>
  )
}
