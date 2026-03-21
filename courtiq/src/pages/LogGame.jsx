import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useGames } from '../hooks/useGames'
import { useToast } from '../contexts/ToastContext'
import PageShell from '../components/ui/PageShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

const GAME_TYPES = ['League', 'Tournament', 'Pickup', 'Practice', 'Scrimmage']
const RESULTS = ['Win', 'Loss', 'Draw']

function StatInput({ label, value, onChange, max = 99 }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-text-muted">{label}</label>
      <input
        type="number"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(Math.min(Number(e.target.value) || 0, max))}
        className="w-full rounded-lg bg-bg-section border border-border px-3 py-2.5 text-center text-sm font-semibold text-text-primary focus:outline-none focus:border-blue-border transition-colors"
      />
    </div>
  )
}

function SelectGroup({ label, options, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-secondary">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              value === opt
                ? 'bg-blue text-white'
                : 'bg-bg-section border border-border text-text-secondary hover:border-blue-border'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function RatingSlider({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-secondary">{label}</label>
        <span className="text-sm font-bold text-blue">{value}/10</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue"
      />
    </div>
  )
}

export default function LogGame() {
  const navigate = useNavigate()
  const { addGame } = useGames()
  const toast = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    game_date: today,
    opponent: '',
    location: '',
    game_type: 'League',
    result: '',
    minutes_played: '',
    points: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    fouls: 0,
    fg_made: 0,
    fg_attempted: 0,
    three_made: 0,
    three_attempted: 0,
    ft_made: 0,
    ft_attempted: 0,
    energy_level: 7,
    performance_rating: 7,
    notes: '',
  })

  function set(field) {
    return (value) => setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.game_date) {
      setError('Please select a game date.')
      return
    }
    setError('')
    setSubmitting(true)

    const payload = {
      ...form,
      minutes_played: form.minutes_played ? Number(form.minutes_played) : null,
      result: form.result || null,
      notes: form.notes.trim() || null,
      opponent: form.opponent.trim() || null,
      location: form.location.trim() || null,
    }

    const { error } = await addGame(payload)
    if (error) {
      setError(error.message)
      setSubmitting(false)
    } else {
      toast('Game saved!')
      navigate('/log', { replace: true })
    }
  }

  return (
    <PageShell>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Log Game</h1>
            <p className="text-xs text-text-muted">Record your stats from a game.</p>
          </div>
        </div>

        {/* Game Info */}
        <Card className="space-y-5">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Game Info</h2>
          <Input
            label="Date"
            type="date"
            value={form.game_date}
            onChange={(e) => set('game_date')(e.target.value)}
            required
          />
          <Input
            label="Opponent"
            placeholder="e.g. Eagles"
            value={form.opponent}
            onChange={(e) => set('opponent')(e.target.value)}
          />
          <Input
            label="Location"
            placeholder="e.g. Home gym"
            value={form.location}
            onChange={(e) => set('location')(e.target.value)}
          />
          <SelectGroup label="Game Type" options={GAME_TYPES} value={form.game_type} onChange={set('game_type')} />
          <SelectGroup label="Result" options={RESULTS} value={form.result} onChange={set('result')} />
          <Input
            label="Minutes Played"
            type="number"
            min="0"
            max="60"
            placeholder="0"
            value={form.minutes_played}
            onChange={(e) => set('minutes_played')(e.target.value)}
          />
        </Card>

        {/* Box Score */}
        <Card className="space-y-5">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Box Score</h2>
          <div className="grid grid-cols-4 gap-3">
            <StatInput label="PTS" value={form.points} onChange={set('points')} max={150} />
            <StatInput label="REB" value={form.rebounds} onChange={set('rebounds')} max={50} />
            <StatInput label="AST" value={form.assists} onChange={set('assists')} max={50} />
            <StatInput label="STL" value={form.steals} onChange={set('steals')} max={30} />
            <StatInput label="BLK" value={form.blocks} onChange={set('blocks')} max={30} />
            <StatInput label="TO" value={form.turnovers} onChange={set('turnovers')} max={30} />
            <StatInput label="FLS" value={form.fouls} onChange={set('fouls')} max={10} />
          </div>
        </Card>

        {/* Shooting */}
        <Card className="space-y-5">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Shooting</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1"><StatInput label="FG Made" value={form.fg_made} onChange={set('fg_made')} /></div>
              <span className="text-text-muted pt-5">/</span>
              <div className="flex-1"><StatInput label="FG Att" value={form.fg_attempted} onChange={set('fg_attempted')} /></div>
              <div className="pt-5 w-14 text-right">
                <span className="text-sm font-bold text-text-primary">
                  {form.fg_attempted > 0 ? Math.round((form.fg_made / form.fg_attempted) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1"><StatInput label="3P Made" value={form.three_made} onChange={set('three_made')} /></div>
              <span className="text-text-muted pt-5">/</span>
              <div className="flex-1"><StatInput label="3P Att" value={form.three_attempted} onChange={set('three_attempted')} /></div>
              <div className="pt-5 w-14 text-right">
                <span className="text-sm font-bold text-text-primary">
                  {form.three_attempted > 0 ? Math.round((form.three_made / form.three_attempted) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1"><StatInput label="FT Made" value={form.ft_made} onChange={set('ft_made')} /></div>
              <span className="text-text-muted pt-5">/</span>
              <div className="flex-1"><StatInput label="FT Att" value={form.ft_attempted} onChange={set('ft_attempted')} /></div>
              <div className="pt-5 w-14 text-right">
                <span className="text-sm font-bold text-text-primary">
                  {form.ft_attempted > 0 ? Math.round((form.ft_made / form.ft_attempted) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Ratings */}
        <Card className="space-y-5">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">How'd You Feel?</h2>
          <RatingSlider label="Energy Level" value={form.energy_level} onChange={set('energy_level')} />
          <RatingSlider label="Performance" value={form.performance_rating} onChange={set('performance_rating')} />
        </Card>

        {/* Notes */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Notes</h2>
          <textarea
            value={form.notes}
            onChange={(e) => set('notes')(e.target.value)}
            placeholder="What went well? What to improve?"
            rows={3}
            className="w-full rounded-xl bg-bg-section border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border resize-none transition-colors"
          />
        </Card>

        {error && (
          <div className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Submit */}
        <Button type="submit" fullWidth disabled={submitting} size="lg">
          <Save size={18} />
          {submitting ? 'Saving…' : 'Save Game'}
        </Button>
      </form>
    </PageShell>
  )
}
