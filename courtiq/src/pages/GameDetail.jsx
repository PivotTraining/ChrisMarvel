import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Pencil, Trash2, Save, Calendar, MapPin,
  Target, Trophy, Zap, Star,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useGames } from '../hooks/useGames'
import PageShell from '../components/ui/PageShell'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const GAME_TYPES = ['League', 'Tournament', 'Pickup', 'Practice', 'Scrimmage']
const RESULTS = ['Win', 'Loss', 'Draw']

function pct(made, att) {
  return att > 0 ? Math.round((made / att) * 100) : null
}

export default function GameDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateGame, deleteGame } = useGames()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single()
      if (data) {
        setGame(data)
        setForm({ ...data })
      }
      setLoading(false)
    }
    fetch()
  }, [id])

  function set(field) {
    return (value) => setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    const { game_date, opponent, location, game_type, result, minutes_played,
      points, rebounds, assists, steals, blocks, turnovers, fouls,
      fg_made, fg_attempted, three_made, three_attempted, ft_made, ft_attempted,
      energy_level, performance_rating, notes } = form

    const { data, error } = await updateGame(id, {
      game_date, opponent, location, game_type, result, minutes_played,
      points, rebounds, assists, steals, blocks, turnovers, fouls,
      fg_made, fg_attempted, three_made, three_attempted, ft_made, ft_attempted,
      energy_level, performance_rating, notes,
    })
    setSaving(false)
    if (!error && data) {
      setGame(data)
      setEditing(false)
    }
  }

  async function handleDelete() {
    await deleteGame(id)
    navigate('/log', { replace: true })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!game) {
    return (
      <PageShell>
        <div className="flex flex-col items-center py-16 text-center space-y-3">
          <p className="text-sm text-text-muted">Game not found.</p>
          <button onClick={() => navigate(-1)} className="text-blue text-sm font-medium">Go back</button>
        </div>
      </PageShell>
    )
  }

  const date = new Date(game.game_date + 'T12:00:00')
  const formatted = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const fgPct = pct(game.fg_made, game.fg_attempted)
  const threePct = pct(game.three_made, game.three_attempted)
  const ftPct = pct(game.ft_made, game.ft_attempted)

  // Edit mode
  if (editing && form) {
    return (
      <PageShell>
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { setEditing(false); setForm({ ...game }) }}
              className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Edit Game</h1>
              <p className="text-xs text-text-muted">{formatted}</p>
            </div>
          </div>

          <Card className="space-y-5">
            <Input label="Date" type="date" value={form.game_date} onChange={e => set('game_date')(e.target.value)} required />
            <Input label="Opponent" value={form.opponent || ''} onChange={e => set('opponent')(e.target.value)} placeholder="Team name" />
            <Input label="Location" value={form.location || ''} onChange={e => set('location')(e.target.value)} placeholder="Gym / arena" />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Game Type</label>
              <div className="flex flex-wrap gap-2">
                {GAME_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => set('game_type')(t)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${form.game_type === t ? 'bg-blue text-white' : 'bg-bg-section border border-border text-text-secondary'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Result</label>
              <div className="flex gap-2">
                {RESULTS.map(r => (
                  <button key={r} type="button" onClick={() => set('result')(r)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      form.result === r
                        ? r === 'Win' ? 'bg-success text-white' : r === 'Loss' ? 'bg-danger text-white' : 'bg-warning text-white'
                        : 'bg-bg-section border border-border text-text-secondary'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Stats</h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'PTS', field: 'points', max: 150 },
                { label: 'REB', field: 'rebounds', max: 50 },
                { label: 'AST', field: 'assists', max: 50 },
                { label: 'STL', field: 'steals', max: 30 },
                { label: 'BLK', field: 'blocks', max: 30 },
                { label: 'TO', field: 'turnovers', max: 30 },
                { label: 'FLS', field: 'fouls', max: 10 },
                { label: 'MIN', field: 'minutes_played', max: 60 },
              ].map(({ label, field, max }) => (
                <div key={field} className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-muted">{label}</label>
                  <input type="number" min="0" max={max} value={form[field] ?? 0}
                    onChange={e => set(field)(Math.min(Number(e.target.value) || 0, max))}
                    className="w-full rounded-lg bg-bg-section border border-border px-3 py-2.5 text-center text-sm font-semibold text-text-primary focus:outline-none focus:border-blue-border transition-colors" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Shooting</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'FG Made', field: 'fg_made' },
                { label: 'FG Att', field: 'fg_attempted' },
                { label: '3PT Made', field: 'three_made' },
                { label: '3PT Att', field: 'three_attempted' },
                { label: 'FT Made', field: 'ft_made' },
                { label: 'FT Att', field: 'ft_attempted' },
              ].map(({ label, field }) => (
                <div key={field} className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-muted">{label}</label>
                  <input type="number" min="0" max={99} value={form[field] ?? 0}
                    onChange={e => set(field)(Math.min(Number(e.target.value) || 0, 99))}
                    className="w-full rounded-lg bg-bg-section border border-border px-3 py-2.5 text-center text-sm font-semibold text-text-primary focus:outline-none focus:border-blue-border transition-colors" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-4">
            <textarea value={form.notes || ''} onChange={e => set('notes')(e.target.value)}
              placeholder="Game notes..." rows={3}
              className="w-full rounded-xl bg-bg-section border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border resize-none transition-colors" />
          </Card>

          <Button fullWidth onClick={handleSave} disabled={saving}>
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </PageShell>
    )
  }

  // Read-only view
  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="text-xs text-text-muted flex items-center gap-1"><Calendar size={10} /> {formatted}</p>
              <h1 className="text-lg font-bold text-text-primary">
                {game.opponent ? `vs ${game.opponent}` : 'Game'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(true)}
              className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-blue transition-colors">
              <Pencil size={16} />
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setConfirmDelete(false)} className="text-xs text-text-muted">Cancel</button>
                <button onClick={handleDelete} className="text-xs font-semibold text-danger">Delete</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)}
                className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-danger transition-colors">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Result & meta */}
        <Card className="flex items-center justify-between">
          <div className="space-y-1">
            {game.game_type && (
              <span className="text-[10px] font-medium text-text-muted bg-bg-section px-2 py-0.5 rounded-full">{game.game_type}</span>
            )}
            {game.location && (
              <p className="text-xs text-text-muted flex items-center gap-1"><MapPin size={10} /> {game.location}</p>
            )}
            {game.minutes_played != null && (
              <p className="text-xs text-text-muted">{game.minutes_played} minutes played</p>
            )}
          </div>
          {game.result && (
            <span className={`text-lg font-black px-4 py-2 rounded-xl ${
              game.result === 'Win' ? 'bg-success/10 text-success' :
              game.result === 'Loss' ? 'bg-danger/10 text-danger' :
              'bg-warning/10 text-warning'
            }`}>
              {game.result}
            </span>
          )}
        </Card>

        {/* Primary Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'PTS', value: game.points },
            { label: 'REB', value: game.rebounds },
            { label: 'AST', value: game.assists },
            { label: 'STL', value: game.steals },
            { label: 'BLK', value: game.blocks },
            { label: 'TO', value: game.turnovers },
            { label: 'FLS', value: game.fouls },
            { label: 'MIN', value: game.minutes_played },
          ].map(({ label, value }) => (
            <Card key={label} className="flex flex-col items-center py-3 space-y-1">
              <p className="text-lg font-bold text-text-primary">{value ?? '—'}</p>
              <p className="text-[9px] text-text-muted uppercase font-semibold">{label}</p>
            </Card>
          ))}
        </div>

        {/* Shooting */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Shooting</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'FG', made: game.fg_made, att: game.fg_attempted, p: fgPct },
              { label: '3PT', made: game.three_made, att: game.three_attempted, p: threePct },
              { label: 'FT', made: game.ft_made, att: game.ft_attempted, p: ftPct },
            ].map(({ label, made, att, p }) => (
              <div key={label} className="text-center space-y-1">
                <p className="text-xl font-bold text-text-primary">{p != null ? `${p}%` : '—'}</p>
                <p className="text-xs text-text-muted">{made}/{att}</p>
                <p className="text-[9px] text-text-muted uppercase font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Ratings */}
        {(game.energy_level || game.performance_rating) && (
          <div className="grid grid-cols-2 gap-3">
            {game.energy_level && (
              <Card className="flex flex-col items-center py-3 space-y-1">
                <Zap size={14} className="text-warning" />
                <p className="text-lg font-bold text-text-primary">{game.energy_level}/10</p>
                <p className="text-[9px] text-text-muted uppercase font-semibold">Energy</p>
              </Card>
            )}
            {game.performance_rating && (
              <Card className="flex flex-col items-center py-3 space-y-1">
                <Star size={14} className="text-gold" />
                <p className="text-lg font-bold text-text-primary">{game.performance_rating}/10</p>
                <p className="text-[9px] text-text-muted uppercase font-semibold">Rating</p>
              </Card>
            )}
          </div>
        )}

        {/* Notes */}
        {game.notes && (
          <Card className="space-y-2">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Notes</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{game.notes}</p>
          </Card>
        )}
      </div>
    </PageShell>
  )
}
