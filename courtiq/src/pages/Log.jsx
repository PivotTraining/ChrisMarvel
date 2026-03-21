import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ClipboardList, Plus, Trophy, Calendar, MapPin, Trash2 } from 'lucide-react'
import { useGames } from '../hooks/useGames'
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
              <span className="text-[10px] font-medium text-text-muted bg-bg-section px-2 py-0.5 rounded-full">
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
  const { games, loading, deleteGame } = useGames()
  const toast = useToast()

  async function handleDelete(id) {
    await deleteGame(id)
    toast('Game deleted', 'info')
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Game Log"
          subtitle="Record and review your games."
          action={
            <Button size="sm" onClick={() => navigate('/log/new')}>
              <Plus size={16} />
              Add
            </Button>
          }
        />

        {loading ? (
          <Skeleton count={3} />
        ) : games.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No games logged"
            description="After you log a game, your stats and history will show up here."
            action={
              <Button size="sm" onClick={() => navigate('/log/new')}>
                <Plus size={16} />
                Log Your First Game
              </Button>
            }
          />
        ) : (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                {games.length} Game{games.length !== 1 ? 's' : ''}
              </h2>
              <Trophy size={16} className="text-text-muted" />
            </div>
            <div className="space-y-3">
              {games.map(game => (
                <GameCard key={game.id} game={game} onDelete={handleDelete} onNavigate={(id) => navigate(`/log/${id}`)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  )
}
