import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Pencil, Trash2, Save, Calendar, Star,
  Dumbbell, Zap, Crosshair, Target, ShieldCheck, Send,
  Clock, Repeat, Layers,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useDrills } from '../hooks/useDrills'
import PageShell from '../components/ui/PageShell'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const CATEGORIES = ['Ball Handling', 'Shooting', 'Finishing', 'Defense', 'Passing', 'Conditioning', 'Custom']
const INTENSITIES = ['Low', 'Medium', 'High']

const categoryIcons = {
  'Ball Handling': Zap, Shooting: Crosshair, Finishing: Target,
  Defense: ShieldCheck, Passing: Send, Conditioning: Dumbbell, Custom: Star,
}

const intensityColors = {
  Low: 'text-success bg-success/10',
  Medium: 'text-warning bg-warning/10',
  High: 'text-danger bg-danger/10',
}

export default function DrillDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateDrillSession, deleteDrillSession } = useDrills()
  const [drill, setDrill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('drill_sessions')
        .select('*')
        .eq('id', id)
        .single()
      if (data) {
        setDrill(data)
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
    const { session_date, category, drill_name, sets, reps,
      duration_minutes, rating, intensity, notes } = form
    const { data, error } = await updateDrillSession(id, {
      session_date, category, drill_name,
      sets: sets ? Number(sets) : null,
      reps: reps ? Number(reps) : null,
      duration_minutes: duration_minutes ? Number(duration_minutes) : null,
      rating: rating ? Number(rating) : null,
      intensity: intensity || null,
      notes: notes?.trim() || null,
    })
    setSaving(false)
    if (!error && data) {
      setDrill(data)
      setEditing(false)
    }
  }

  async function handleDelete() {
    await deleteDrillSession(id)
    navigate('/train', { replace: true })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!drill) {
    return (
      <PageShell>
        <div className="flex flex-col items-center py-16 text-center space-y-3">
          <p className="text-sm text-text-muted">Session not found.</p>
          <button onClick={() => navigate(-1)} className="text-blue text-sm font-medium">Go back</button>
        </div>
      </PageShell>
    )
  }

  const date = new Date(drill.session_date + 'T12:00:00')
  const formatted = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const CatIcon = categoryIcons[drill.category] || Dumbbell

  // Edit mode
  if (editing && form) {
    return (
      <PageShell>
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { setEditing(false); setForm({ ...drill }) }}
              className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors" aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Edit Session</h1>
              <p className="text-xs text-text-muted">{formatted}</p>
            </div>
          </div>

          <Card className="space-y-5">
            <Input label="Date" type="date" value={form.session_date} onChange={e => set('session_date')(e.target.value)} required />
            <Input label="Drill Name" value={form.drill_name} onChange={e => set('drill_name')(e.target.value)} placeholder="Drill name" required />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => set('category')(c)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${form.category === c ? 'bg-blue text-white' : 'bg-bg-section border border-border text-text-secondary'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Intensity</label>
              <div className="flex gap-2">
                {INTENSITIES.map(i => (
                  <button key={i} type="button" onClick={() => set('intensity')(i)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      form.intensity === i
                        ? i === 'Low' ? 'bg-success text-white' : i === 'Medium' ? 'bg-warning text-white' : 'bg-danger text-white'
                        : 'bg-bg-section border border-border text-text-secondary'
                    }`}>
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Details</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Sets', field: 'sets', max: 50 },
                { label: 'Reps', field: 'reps', max: 200 },
                { label: 'Minutes', field: 'duration_minutes', max: 180 },
              ].map(({ label, field, max }) => (
                <div key={field} className="space-y-1.5">
                  <label className="block text-xs font-medium text-text-muted">{label}</label>
                  <input type="number" min="0" max={max} value={form[field] ?? ''}
                    onChange={e => set(field)(e.target.value)}
                    className="w-full rounded-lg bg-bg-section border border-border px-3 py-2.5 text-center text-sm font-semibold text-text-primary focus:outline-none focus:border-blue-border transition-colors" />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(r => (
                  <button key={r} type="button" onClick={() => set('rating')(r)}
                    className={`flex-1 py-2.5 rounded-lg transition-all ${
                      form.rating === r ? 'bg-gold/20 border border-gold/30' : 'bg-bg-section border border-border'
                    }`}>
                    <Star size={16} className={`mx-auto ${form.rating >= r ? 'text-gold fill-gold' : 'text-text-muted'}`} />
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <textarea value={form.notes || ''} onChange={e => set('notes')(e.target.value)}
              placeholder="Session notes..." rows={3}
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
              className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors" aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="text-xs text-text-muted flex items-center gap-1"><Calendar size={10} /> {formatted}</p>
              <h1 className="text-lg font-bold text-text-primary">{drill.drill_name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(true)}
              className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-blue transition-colors" aria-label="Edit">
              <Pencil size={16} />
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setConfirmDelete(false)} className="text-xs text-text-muted">Cancel</button>
                <button onClick={handleDelete} className="text-xs font-semibold text-danger">Delete</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)}
                className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-danger transition-colors" aria-label="Delete">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category & Intensity */}
        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-bg-section border border-border flex items-center justify-center">
              <CatIcon size={20} className="text-blue" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">{drill.category}</p>
              {drill.is_custom_drill && <p className="text-[10px] text-text-muted">Custom Drill</p>}
            </div>
          </div>
          {drill.intensity && (
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${intensityColors[drill.intensity]}`}>
              {drill.intensity}
            </span>
          )}
        </Card>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {drill.duration_minutes != null && (
            <Card className="flex flex-col items-center py-4 space-y-1">
              <Clock size={14} className="text-text-muted" />
              <p className="text-lg font-bold text-text-primary">{drill.duration_minutes}</p>
              <p className="text-[9px] text-text-muted uppercase font-semibold">Minutes</p>
            </Card>
          )}
          {drill.sets != null && (
            <Card className="flex flex-col items-center py-4 space-y-1">
              <Layers size={14} className="text-text-muted" />
              <p className="text-lg font-bold text-text-primary">{drill.sets}</p>
              <p className="text-[9px] text-text-muted uppercase font-semibold">Sets</p>
            </Card>
          )}
          {drill.reps != null && (
            <Card className="flex flex-col items-center py-4 space-y-1">
              <Repeat size={14} className="text-text-muted" />
              <p className="text-lg font-bold text-text-primary">{drill.reps}</p>
              <p className="text-[9px] text-text-muted uppercase font-semibold">Reps</p>
            </Card>
          )}
          {drill.rating != null && (
            <Card className="flex flex-col items-center py-4 space-y-1">
              <Star size={14} className="text-gold fill-gold" />
              <p className="text-lg font-bold text-text-primary">{drill.rating}/5</p>
              <p className="text-[9px] text-text-muted uppercase font-semibold">Rating</p>
            </Card>
          )}
        </div>

        {/* Notes */}
        {drill.notes && (
          <Card className="space-y-2">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Notes</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{drill.notes}</p>
          </Card>
        )}
      </div>
    </PageShell>
  )
}
