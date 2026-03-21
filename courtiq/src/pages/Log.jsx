import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useMemo } from 'react'
import { ClipboardList, Plus, Trophy, Calendar, MapPin, Trash2, Filter, Radio } from 'lucide-react'
import { useGames } from '../hooks/useGames'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import { useToast } from '../contexts/ToastContext'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import EmptyState from '../components/ui/EmptyState'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'

function GameCard({ game, onDelete, onNavigate }) {
  const [confirming, setConfirming] = useState(false)
  const date = new Date(game.game_date + 'T12:00:00')
  const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const fgPct = game.fg_attempted > 0
    ? Math.round((game.fg_made / game.fg_attempted) * 100)
    : null

  return (
    <Card className="space-y-4 cursor-pointer card-hover" onClick={() => onNavigate(game.id)}>
      {/* Top row: date, opponent, result */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-text-muted" />
            <span className="text-xs text-text-muted">{formatted}</span>
            {game.game_type && (
              <span className="text-[10px] font-medium text-blue bg-blue/10 px-2 py-0.5 rounded">
                {game.game_type}
              </span>
            )}
          </div>
          {game.opponent && (
            <p className="text-sm font-semibold text-text-primary">vs {game.opponent}</p>
          )}
          {game.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-text-muted" />
              <span className="text-xs text-text-muted">{game.location}</span>
            </div>
          )}
        </div>
        {game.result && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            game.result === 'Win' ? 'bg-success/10 text-success' :
            game.result === 'Loss' ? 'bg-danger/10 text-danger' :
            'bg-warning/10 text-warning'
          }`}>
            {game.result}
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'PTS', value: game.points },
          { label: 'REB', value: game.rebounds },
          { label: 'AST', value: game.assists },
          { label: 'FG%', value: fgPct !== null ? `${fgPct}%` : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-lg font-bold text-text-primary">{value}</p>
            <p className="text-[10px] font-medium text-text-muted uppercase">{label}</p>
          </div>
        ))}
      </div>

      {/* Secondary stats + delete */}
      <div className="flex items-center justify-between pt-1 border-t border-border">
        <div className="flex items-center gap-4">
          {[
            { label: 'STL', value: game.steals },
            { label: 'BLK', value: game.blocks },
            { label: 'TO', value: game.turnovers },
            { label: 'FLS', value: game.fouls },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-[10px] text-text-muted">{label}</span>
              <span className="text-xs font-semibold text-text-secondary">{value}</span>
            </div>
          ))}
        </div>
        {confirming ? (
          <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); setConfirming(false) }} className="text-[10px] text-text-muted">Cancel</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(game.id) }} className="text-[10px] font-semibold text-danger">Delete</button>
          </div>
        ) : (
          <button onClick={(e) => { e.stopPropagation(); setConfirming(true) }} className="p-1 rounded-lg hover:bg-bg-section transition-colors" aria-label="Delete">
            <Trash2 size={13} className="text-text-muted" />
          </button>
        )}
      </div>
    </Card>
  )
}

export default function Log() {
  const navigate = useNavigate()
  const { games, loading, deleteGame, refetch } = useGames()
  const toast = useToast()
  const { pullProps, indicator } = usePullToRefresh(refetch)
  const [filter, setFilter] = useState('All')
  const [sortBy, setSortBy] = useState('date')

  const FILTERS = ['All', 'Win', 'Loss', 'Draw']
  const SORTS = [
    { key: 'date', label: 'Recent' },
    { key: 'points', label: 'Points' },
  ]

  const filteredGames = useMemo(() => {
    let list = filter === 'All' ? games : games.filter(g => g.result === filter)
    if (sortBy === 'points') {
      list = [...list].sort((a, b) => b.points - a.points)
    }
    return list
  }, [games, filter, sortBy])

  async function handleDelete(id) {
    await deleteGame(id)
    toast('Game deleted', 'info')
  }

  return (
    <PageShell>
      <div {...pullProps}>
      {indicator}
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Game Log"
          subtitle="Record and review your games."
          action={
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => navigate('/live')}>
                <Radio size={14} />
                Live
              </Button>
              <Button size="sm" onClick={() => navigate('/log/new')}>
                <Plus size={16} />
                Add
              </Button>
            </div>
          }
        />

        {/* Filters */}
        {games.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 flex-1">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    filter === f
                      ? 'bg-blue text-white'
                      : 'bg-bg-card border border-border text-text-secondary'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              {SORTS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setSortBy(s.key)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 ${
                    sortBy === s.key
                      ? 'bg-bg-section text-text-primary border border-border'
                      : 'text-text-muted'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <Skeleton count={3} />
        ) : games.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No games logged"
            description="After you log a game, your stats and history will show up here."
            action={
              <div className="space-y-3 flex flex-col items-center">
                <Button size="sm" onClick={() => navigate('/log/new')}>
                  <Plus size={16} />
                  Log Your First Game
                </Button>
                <p className="text-[10px] text-text-muted max-w-xs text-center">
                  <strong className="text-text-secondary">Tip:</strong> Track points, rebounds, assists, shooting splits, and more for every game you play.
                </p>
              </div>
            }
          />
        ) : (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                {filteredGames.length} Game{filteredGames.length !== 1 ? 's' : ''}
                {filter !== 'All' && ` · ${filter}`}
              </h2>
              <Trophy size={16} className="text-text-muted" />
            </div>
            {filteredGames.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-6">No {filter.toLowerCase()} games found.</p>
            ) : (
              <div className="space-y-3">
                {filteredGames.map(game => (
                  <GameCard key={game.id} game={game} onDelete={handleDelete} onNavigate={(id) => navigate(`/log/${id}`)} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
      </div>
    </PageShell>
  )
}
