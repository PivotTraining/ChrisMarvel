import { useNavigate } from 'react-router-dom'
import { Trophy, Target, BookHeart, Crosshair, Flame, TrendingUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import useGames from '../../hooks/useGames'
import useJournal from '../../hooks/useJournal'
import { getGreeting, formatDate } from '../../utils/dateUtils'
import PageWrapper from '../../components/layout/PageWrapper'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

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

export default function Home() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { games, seasonAverages } = useGames()
  const { entries } = useJournal()

  const greeting = getGreeting()
  const playerName = profile?.full_name || 'Player'
  const streak = profile?.current_streak || 0

  const lastGame = games.length > 0 ? games[0] : null
  const lastEntry = entries.length > 0 ? entries[0] : null

  return (
    <PageWrapper>
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{greeting}</p>
        <h1
          className="text-3xl mt-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: 'var(--text-primary)' }}
        >
          {playerName}
        </h1>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <Card padding="sm" className="mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)' }}
            >
              <Flame className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {streak} day streak!
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Keep it going</p>
            </div>
          </div>
        </Card>
      )}

      {/* Season Averages */}
      {seasonAverages && seasonAverages.gamesPlayed > 0 && (
        <Card padding="md" className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <h2
              className="text-base"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: 'var(--text-primary)' }}
            >
              Season Averages
            </h2>
            <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
              {seasonAverages.gamesPlayed} game{seasonAverages.gamesPlayed !== 1 ? 's' : ''}
            </span>
          </div>
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
                  backgroundColor: {
                    Great: '#22C55E', Good: '#3B82F6', Okay: '#EAB308', Bad: '#F97316', Terrible: '#EF4444',
                  }[lastEntry.mood] || 'var(--text-muted)',
                }}
              />
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{lastEntry.mood}</p>
            </div>
            <p
              className="text-xl font-bold"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color: 'var(--accent-primary)' }}
            >
              {lastEntry.mental_game_score?.toFixed(1)}
            </p>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formatDate(lastEntry.entry_date)}</p>
        </Card>
      )}

      {/* Quick Actions */}
      <h2
        className="text-base mb-3 mt-6"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: 'var(--text-primary)' }}
      >
        Quick Actions
      </h2>
      <div className="grid grid-cols-4 gap-2 mb-6">
        <QuickAction icon={Trophy} label="Log Game" onClick={() => navigate('/games')} />
        <QuickAction icon={Target} label="Drill" onClick={() => navigate('/drills')} />
        <QuickAction icon={Crosshair} label="Shots" onClick={() => navigate('/shots')} />
        <QuickAction icon={BookHeart} label="Journal" onClick={() => navigate('/journal')} />
      </div>

      {/* Empty state if nothing logged */}
      {games.length === 0 && entries.length === 0 && (
        <Card padding="lg" glass className="text-center mt-4">
          <h3
            className="text-lg mb-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: 'var(--text-primary)' }}
          >
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
