import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Star } from 'lucide-react'
import { useDrills } from '../hooks/useDrills'
import PageShell from '../components/ui/PageShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

const CATEGORIES = ['Ball Handling', 'Shooting', 'Finishing', 'Defense', 'Passing', 'Conditioning', 'Custom']
const INTENSITIES = ['Low', 'Medium', 'High']

export default function LogDrill() {
  const navigate = useNavigate()
  const { addDrillSession } = useDrills()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    session_date: today,
    category: 'Shooting',
    drill_name: '',
    sets: '',
    reps: '',
    duration_minutes: '',
    intensity: 'Medium',
    rating: 0,
    notes: '',
  })

  function set(field) {
    return (value) => setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.drill_name.trim()) {
      setError('Please enter a drill name.')
      return
    }
    setError('')
    setSubmitting(true)

    const payload = {
      session_date: form.session_date,
      category: form.category,
      drill_name: form.drill_name.trim(),
      sets: form.sets ? Number(form.sets) : null,
      reps: form.reps ? Number(form.reps) : null,
      duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
      intensity: form.intensity,
      rating: form.rating || null,
      notes: form.notes.trim() || null,
    }

    const { error } = await addDrillSession(payload)
    if (error) {
      setError(error.message)
      setSubmitting(false)
    } else {
      navigate('/train', { replace: true })
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
            <h1 className="text-xl font-bold text-text-primary">Log Drill</h1>
            <p className="text-xs text-text-muted">Record a training session.</p>
          </div>
        </div>

        {/* Drill Info */}
        <Card className="space-y-5">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Drill Info</h2>
          <Input
            label="Date"
            type="date"
            value={form.session_date}
            onChange={(e) => set('session_date')(e.target.value)}
            required
          />
          <Input
            label="Drill Name"
            placeholder="e.g. Crossover Series"
            value={form.drill_name}
            onChange={(e) => set('drill_name')(e.target.value)}
            required
          />

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => set('category')(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    form.category === cat
                      ? 'bg-blue text-white'
                      : 'bg-bg-section border border-border text-text-secondary hover:border-blue-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Volume */}
        <Card className="space-y-5">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Volume</h2>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Sets"
              type="number"
              min="0"
              placeholder="0"
              value={form.sets}
              onChange={(e) => set('sets')(e.target.value)}
            />
            <Input
              label="Reps"
              type="number"
              min="0"
              placeholder="0"
              value={form.reps}
              onChange={(e) => set('reps')(e.target.value)}
            />
            <Input
              label="Minutes"
              type="number"
              min="0"
              placeholder="0"
              value={form.duration_minutes}
              onChange={(e) => set('duration_minutes')(e.target.value)}
            />
          </div>

          {/* Intensity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Intensity</label>
            <div className="flex gap-2">
              {INTENSITIES.map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => set('intensity')(level)}
                  className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    form.intensity === level
                      ? 'bg-blue text-white'
                      : 'bg-bg-section border border-border text-text-secondary hover:border-blue-border'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Rating */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Rating</h2>
          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => set('rating')(star)}
                className="p-1 transition-transform duration-150 hover:scale-110"
              >
                <Star
                  size={32}
                  className={`transition-colors duration-200 ${
                    star <= form.rating
                      ? 'text-gold fill-gold'
                      : 'text-border'
                  }`}
                />
              </button>
            ))}
          </div>
        </Card>

        {/* Notes */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Notes</h2>
          <textarea
            value={form.notes}
            onChange={(e) => set('notes')(e.target.value)}
            placeholder="How did it go?"
            rows={3}
            className="w-full rounded-xl bg-bg-section border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border resize-none transition-colors"
          />
        </Card>

        {error && (
          <div className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        <Button type="submit" fullWidth disabled={submitting} size="lg">
          <Save size={18} />
          {submitting ? 'Saving…' : 'Save Drill'}
        </Button>
      </form>
    </PageShell>
  )
}
