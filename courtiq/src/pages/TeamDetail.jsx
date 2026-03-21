import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trophy, Medal, Users, Crown, Shield, User, BarChart3, Target, Flame } from 'lucide-react'
import { useTeams, useTeamMembers, useTeamLeaderboard } from '../hooks/useTeams'
import { useAuth } from '../contexts/AuthContext'
import PageShell from '../components/ui/PageShell'
import Card from '../components/ui/Card'

const TABS = [
  { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { key: 'roster', label: 'Roster', icon: Users },
]

const SORT_OPTIONS = [
  { key: 'ppg', label: 'PPG' },
  { key: 'rpg', label: 'RPG' },
  { key: 'apg', label: 'APG' },
  { key: 'winPct', label: 'Win %' },
  { key: 'games', label: 'Games' },
]

const ROLE_CONFIG = {
  owner: { icon: Crown, color: 'text-gold' },
  coach: { icon: Shield, color: 'text-blue' },
  player: { icon: User, color: 'text-text-muted' },
}

const MEDAL_COLORS = ['text-gold', 'text-text-secondary', 'text-[#CD7F32]']

export default function TeamDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { teams } = useTeams()
  const { members, loading: membersLoading } = useTeamMembers(id)
  const { leaderboard, loading: lbLoading } = useTeamLeaderboard(id)

  const [tab, setTab] = useState('leaderboard')
  const [sortBy, setSortBy] = useState('ppg')
  const [compareWith, setCompareWith] = useState(null)

  const team = teams.find(t => t.id === id)

  const sortedBoard = [...leaderboard].sort((a, b) => {
    if (sortBy === 'winPct' || sortBy === 'games') return b[sortBy] - a[sortBy]
    return parseFloat(b[sortBy]) - parseFloat(a[sortBy])
  })

  const myStats = leaderboard.find(p => p.id === user?.id)
  const compareStats = compareWith ? leaderboard.find(p => p.id === compareWith) : null

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/team')}
            className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-text-primary truncate">{team?.name || 'Team'}</h1>
            <p className="text-xs text-text-muted">{members.length} member{members.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-bg-section rounded-lg p-0.5">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                tab === t.key ? 'bg-blue text-white' : 'text-text-secondary'
              }`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Leaderboard Tab */}
        {tab === 'leaderboard' && (
          <>
            {/* Sort */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    sortBy === opt.key
                      ? 'bg-blue/10 text-blue border border-blue-border'
                      : 'bg-bg-section border border-border text-text-secondary'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {lbLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : sortedBoard.length === 0 ? (
              <Card>
                <p className="text-sm text-text-muted text-center py-8">No games logged yet. Stats will appear once members log games.</p>
              </Card>
            ) : (
              <div className="space-y-2">
                {sortedBoard.map((player, idx) => {
                  const isMe = player.id === user?.id
                  const isTop3 = idx < 3

                  return (
                    <Card
                      key={player.id}
                      onClick={() => !isMe && setCompareWith(compareWith === player.id ? null : player.id)}
                      className={`flex items-center gap-3 cursor-pointer transition-all ${
                        isMe ? 'border-blue-border bg-blue/5' : ''
                      } ${compareWith === player.id ? 'ring-1 ring-blue' : ''}`}
                    >
                      {/* Rank */}
                      <div className="w-8 text-center shrink-0">
                        {isTop3 ? (
                          <Medal size={20} className={MEDAL_COLORS[idx]} />
                        ) : (
                          <span className="text-sm font-bold text-text-muted">{idx + 1}</span>
                        )}
                      </div>

                      {/* Player info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {player.name}{isMe ? ' (You)' : ''}
                          </p>
                          {player.position && (
                            <span className="text-[9px] font-medium text-text-muted bg-bg-section px-1.5 py-0.5 rounded">{player.position}</span>
                          )}
                        </div>
                        <p className="text-[10px] text-text-muted">{player.games} game{player.games !== 1 ? 's' : ''} · {player.winPct}% W</p>
                      </div>

                      {/* Stat value */}
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-text-primary">{player[sortBy]}{sortBy === 'winPct' ? '%' : ''}</p>
                        <p className="text-[9px] text-text-muted uppercase">{SORT_OPTIONS.find(o => o.key === sortBy)?.label}</p>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Player Comparison */}
            {myStats && compareStats && (
              <Card className="space-y-4">
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 size={14} className="text-blue" />
                  Head-to-Head
                </h2>
                <div className="space-y-3">
                  {[
                    { label: 'PPG', mine: myStats.ppg, theirs: compareStats.ppg },
                    { label: 'RPG', mine: myStats.rpg, theirs: compareStats.rpg },
                    { label: 'APG', mine: myStats.apg, theirs: compareStats.apg },
                    { label: 'Win %', mine: `${myStats.winPct}%`, theirs: `${compareStats.winPct}%` },
                    { label: 'Games', mine: myStats.games, theirs: compareStats.games },
                  ].map(({ label, mine, theirs }) => {
                    const mVal = parseFloat(mine)
                    const tVal = parseFloat(theirs)
                    const isBetter = mVal > tVal
                    const isTied = mVal === tVal

                    return (
                      <div key={label} className="flex items-center justify-between">
                        <span className={`text-sm font-bold w-16 text-right ${isBetter ? 'text-success' : isTied ? 'text-text-primary' : 'text-text-secondary'}`}>
                          {mine}
                        </span>
                        <span className="text-[10px] text-text-muted uppercase flex-1 text-center">{label}</span>
                        <span className={`text-sm font-bold w-16 ${!isBetter && !isTied ? 'text-success' : isTied ? 'text-text-primary' : 'text-text-secondary'}`}>
                          {theirs}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-between text-[10px] text-text-muted border-t border-border pt-2">
                  <span>You</span>
                  <span>{compareStats.name}</span>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Roster Tab */}
        {tab === 'roster' && (
          membersLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {members.map(member => {
                const roleConfig = ROLE_CONFIG[member.role] || ROLE_CONFIG.player
                const RoleIcon = roleConfig.icon
                const joinDate = new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

                return (
                  <Card key={member.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-bg-section border border-border flex items-center justify-center shrink-0">
                      <User size={18} className="text-text-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {member.full_name || 'Player'}
                          {member.id === user?.id ? ' (You)' : ''}
                        </p>
                        <RoleIcon size={12} className={roleConfig.color} />
                      </div>
                      <p className="text-[10px] text-text-muted">
                        {member.position || 'No position'} · Joined {joinDate}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-text-primary">Lv.{member.level || 1}</p>
                      <div className="flex items-center gap-0.5 justify-end">
                        <Flame size={10} className="text-gold" />
                        <span className="text-[10px] text-text-muted">{member.current_streak || 0}</span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )
        )}
      </div>
    </PageShell>
  )
}
