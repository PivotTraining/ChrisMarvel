import { useNavigate } from 'react-router-dom'
import { Trophy, Target, BookHeart, Crosshair, Flame, TrendingUp, Award, Zap } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { useAuth } from '../../context/AuthContext'
import useGames from '../../hooks/useGames'
import useJournal from '../../hooks/useJournal'
import useAnalytics from '../../hooks/useAnalytics'
import useGamification from '../../hooks/useGamification'
import { getGreeting, formatDate } from '../../utils/dateUtils'
import PageWrapper from '../../components/layout/PageWrapper'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const CHART_COLORS = ['#F97316', '#3B82F6', '#22C55E']

function StatItem({ label, value }) {
  return (
    <div className="text-center">
      <p
        className="text-2xl font-bold"
        style={{ color: 'var(--accent-primary)', fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        {value}
      </p>
      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  )
}

function QuickAction({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 active:scale-[0.97] cursor-pointer"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        minWidth: 0,
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}
      >
        <Icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
      </div>
      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </button>
  )
}

function ChartTooltip({ active, payload, label, valueKey, valueSuffix }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: '#1E1E2E', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p style={{ color: '#94A3B8' }}>{payload[0]?.payload?.label || label}</p>
      <p className="font-bold" style={{ color: '#F97316' }}>
        {payload[0]?.value}{valueSuffix || ''}
      </p>
    </div>
  )
}

function SectionTitle({ icon: Icon, title, extra }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />}
      <h2 className="text-base" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: 'var(--text-primary)' }}>
        {title}
      </h2>
      {extra && <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>{extra}</span>}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { games, seasonAverages } = useGames()
  const { entries } = useJournal()
  const { scoringTrend, weeklyActivity } = useAnalytics()
  const { badges, weeklyChallenge, challengeProgress, level, xp, xpToNextLevel } = useGamification()

  const greeting = getGreeting()
  const playerName = profile?.full_name || 'Player'
  const streak = profile?.current_streak || 0
  const lastGame = games.length > 0 ? games[0] : null
  const lastEntry = entries.length > 0 ? entries[0] : null
  const xpPct = xpToNextLevel > 0 ? Math.round(((500 - xpToNextLevel) / 500) * 100) : 100

  return (
    <PageWrapper>
      {/* Greeting + Level */}
      <div className="mb-6">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{greeting}</p>
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-3xl" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: 'var(--text-primary)' }}>
            {playerName}
          </h1>
          {level > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)' }}>
                <Zap className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>Lv {level}</span>
              </div>
            </div>
          )}
        </div>
        {xp > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${xpPct}%`, backgroundColor: 'var(--accent-primary)' }} />
            </div>
            <span className="text-[10px] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{xp} XP</span>
          </div>
        )}
      </div>

      {/* Streak */}
      {streak > 0 && (
        <Card padding="sm" className="mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)' }}>
              <Flame className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{streak} day streak!</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Keep it going</p>
            </div>
          </div>
        </Card>
      )}

      {/* Season Averages */}
      {seasonAverages && seasonAverages.gamesPlayed > 0 && (
        <Card padding="md" className="mb-4">
          <SectionTitle icon={TrendingUp} title="Season Averages" extra={`${seasonAverages.gamesPlayed} game${seasonAverages.gamesPlayed !== 1 ? 's' : ''}`} />
          <div className="grid grid-cols-3 gap-3">
            <StatItem label="PPG" value={seasonAverages.ppg} />
            <StatItem label="RPG" value={seasonAverages.rpg} />
            <StatItem label="APG" value={seasonAverages.apg} />
            <StatItem label="FG%" value={`${seasonAverages.fgPct}%`} />
            <StatItem label="3P%" value={`${seasonAverages.threePct}%`} />
            <StatItem label="Win%" value={`${seasonAverages.winPct}%`} />
          </div>
        </Card>
      )}

      {/* Last Session */}
      {lastGame && (
        <Card padding="md" hover onClick={() => navigate('/games')} className="mb-4">
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Last Game</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {lastGame.opponent ? `vs ${lastGame.opponent}` : lastGame.game_type || 'Game'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(lastGame.game_date)}</p>
            </div>
            <div className="flex items-center gap-4">
              <StatItem label="PTS" value={lastGame.points || 0} />
              <StatItem label="REB" value={lastGame.rebounds || 0} />
              <StatItem label="AST" value={lastGame.assists || 0} />
            </div>
          </div>
        </Card>
      )}

      {lastEntry && (
        <Card padding="md" hover onClick={() => navigate('/journal')} className="mb-4">
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Last Journal Entry</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{
                  backgroundColor: { Great: '#22C55E', Good: '#3B82F6', Okay: '#EAB308', Bad: '#F97316', Terrible: '#EF4444' }[lastEntry.mood] || 'var(--text-muted)',
                }}
              />
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{lastEntry.mood}</p>
            </div>
            <p className="text-xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: 'var(--accent-primary)' }}>
              {lastEntry.mental_game_score?.toFixed(1)}
            </p>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formatDate(lastEntry.entry_date)}</p>
        </Card>
      )}

      {/* Quick Actions */}
      <h2 className="text-base mb-3 mt-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: 'var(--text-primary)' }}>
        Quick Actions
      </h2>
      <div className="grid grid-cols-4 gap-2 mb-6">
        <QuickAction icon={Trophy} label="Log Game" onClick={() => navigate('/games')} />
        <QuickAction icon={Target} label="Drill" onClick={() => navigate('/drills')} />
        <QuickAction icon={Crosshair} label="Shots" onClick={() => navigate('/shots')} />
        <QuickAction icon={BookHeart} label="Journal" onClick={() => navigate('/journal')} />
      </div>

      {/* Scoring Trend Chart */}
      {scoringTrend.length > 1 && (
        <Card padding="md" className="mb-4">
          <SectionTitle icon={TrendingUp} title="Scoring Trend" />
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={scoringTrend}>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<ChartTooltip valueSuffix=" pts" />} />
              <Line type="monotone" dataKey="points" stroke="#F97316" strokeWidth={2} dot={{ r: 3, fill: '#F97316' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Weekly Activity Chart */}
      {weeklyActivity.length > 0 && weeklyActivity.some((d) => d.drills + d.games + d.journal > 0) && (
        <Card padding="md" className="mb-4">
          <SectionTitle title="This Week" />
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyActivity}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} width={20} allowDecimals={false} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]?.payload
                return (
                  <div className="rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: '#1E1E2E', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ color: '#94A3B8' }}>{d?.day}</p>
                    {d?.games > 0 && <p style={{ color: '#F97316' }}>Games: {d.games}</p>}
                    {d?.drills > 0 && <p style={{ color: '#3B82F6' }}>Drills: {d.drills}</p>}
                    {d?.journal > 0 && <p style={{ color: '#22C55E' }}>Journal: {d.journal}</p>}
                  </div>
                )
              }} />
              <Bar dataKey="games" stackId="a" fill="#F97316" radius={[0, 0, 0, 0]} />
              <Bar dataKey="drills" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="journal" stackId="a" fill="#22C55E" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Badge Showcase */}
      {badges.length > 0 && (
        <Card padding="md" className="mb-4">
          <SectionTitle icon={Award} title="Badges" extra={`${badges.length} earned`} />
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {badges.map((b) => (
              <div key={b.id || b.badge_name} className="flex flex-col items-center gap-1 flex-shrink-0" title={b.badge_description}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)', color: 'var(--accent-primary)' }}
                >
                  {b.badge_name?.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
                <span className="text-[10px] text-center w-14 truncate" style={{ color: 'var(--text-muted)' }}>{b.badge_name}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Weekly Challenge */}
      {weeklyChallenge && (
        <Card padding="md" className="mb-4">
          <SectionTitle icon={Target} title="Weekly Challenge" />
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{weeklyChallenge.challenge_name}</p>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{weeklyChallenge.challenge_description}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.round(challengeProgress * 100)}%`,
                  backgroundColor: weeklyChallenge.completed ? '#22C55E' : 'var(--accent-primary)',
                }}
              />
            </div>
            <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
              {weeklyChallenge.current_value || 0}/{weeklyChallenge.target_value}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Zap className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{weeklyChallenge.xp_reward} XP reward</span>
          </div>
        </Card>
      )}

      {/* Empty state if nothing logged */}
      {games.length === 0 && entries.length === 0 && (
        <Card padding="lg" glass className="text-center mt-4">
          <h3 className="text-lg mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: 'var(--text-primary)' }}>
            Welcome to CourtIQ
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Start by logging your first game or journal entry to see your stats here.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/games')}>Log a Game</Button>
            <Button variant="outline" onClick={() => navigate('/journal')}>Write in Journal</Button>
          </div>
        </Card>
      )}
    </PageWrapper>
  )
}
