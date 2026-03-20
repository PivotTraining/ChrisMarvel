import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Trash2, Pencil, Save, Calendar,
  Smile, Frown, Meh, ThumbsUp, ThumbsDown,
  Zap, Moon, Brain, Target, Flame, AlertTriangle,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useJournal } from '../hooks/useJournal'
import PageShell from '../components/ui/PageShell'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const moodConfig = {
  Great: { icon: ThumbsUp, color: 'text-success', bg: 'bg-success/10' },
  Good: { icon: Smile, color: 'text-blue', bg: 'bg-blue/10' },
  Okay: { icon: Meh, color: 'text-warning', bg: 'bg-warning/10' },
  Bad: { icon: Frown, color: 'text-danger', bg: 'bg-danger/10' },
  Terrible: { icon: ThumbsDown, color: 'text-danger', bg: 'bg-danger/10' },
}

const MOODS = ['Great', 'Good', 'Okay', 'Bad', 'Terrible']

function SliderField({ label, value, onChange, max = 10 }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-secondary">{label}</label>
        <span className="text-sm font-bold text-blue">{value}/{max}</span>
      </div>
      <input
        type="range" min="1" max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue"
      />
    </div>
  )
}

export default function JournalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateEntry, deleteEntry } = useJournal()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', id)
        .single()
      if (data) {
        setEntry(data)
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
    const { data, error } = await updateEntry(id, {
      mood: form.mood,
      energy_level: form.energy_level,
      sleep_hours: form.sleep_hours ? Number(form.sleep_hours) : null,
      sleep_quality: form.sleep_quality,
      confidence: form.confidence,
      focus: form.focus,
      motivation: form.motivation,
      stress: form.stress,
      highlights: form.highlights?.trim() || null,
      improvements: form.improvements?.trim() || null,
      goals_for_tomorrow: form.goals_for_tomorrow?.trim() || null,
      gratitude: form.gratitude?.trim() || null,
      notes: form.notes?.trim() || null,
    })
    setSaving(false)
    if (!error && data) {
      setEntry(data)
      setEditing(false)
    }
  }

  async function handleDelete() {
    await deleteEntry(id)
    navigate('/journal', { replace: true })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!entry) {
    return (
      <PageShell>
        <div className="flex flex-col items-center py-16 text-center space-y-3">
          <p className="text-sm text-text-muted">Entry not found.</p>
          <button onClick={() => navigate(-1)} className="text-blue text-sm font-medium">Go back</button>
        </div>
      </PageShell>
    )
  }

  const mood = moodConfig[entry.mood] || moodConfig.Okay
  const MoodIcon = mood.icon
  const date = new Date(entry.entry_date + 'T12:00:00')
  const formatted = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const mentalScore = entry.confidence && entry.focus && entry.motivation && entry.stress
    ? ((entry.confidence + entry.focus + entry.motivation + (11 - entry.stress)) / 4).toFixed(1)
    : null

  if (editing && form) {
    return (
      <PageShell>
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { setEditing(false); setForm({ ...entry }) }}
              className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors" aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Edit Entry</h1>
              <p className="text-xs text-text-muted">{formatted}</p>
            </div>
          </div>

          {/* Mood selector */}
          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Mood</h2>
            <div className="flex justify-between gap-2">
              {MOODS.map(m => {
                const cfg = moodConfig[m]
                const Icon = cfg.icon
                return (
                  <button key={m} type="button" onClick={() => set('mood')(m)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200 ${
                      form.mood === m ? `${cfg.bg} border border-opacity-30` : 'bg-bg-section border border-border'
                    }`}>
                    <Icon size={22} className={form.mood === m ? cfg.color : 'text-text-muted'} />
                    <span className={`text-[10px] font-medium ${form.mood === m ? cfg.color : 'text-text-muted'}`}>{m}</span>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="space-y-5">
            <SliderField label="Energy Level" value={form.energy_level ?? 5} onChange={set('energy_level')} />
            <SliderField label="Sleep Quality" value={form.sleep_quality ?? 5} onChange={set('sleep_quality')} />
            <SliderField label="Confidence" value={form.confidence ?? 5} onChange={set('confidence')} />
            <SliderField label="Focus" value={form.focus ?? 5} onChange={set('focus')} />
            <SliderField label="Motivation" value={form.motivation ?? 5} onChange={set('motivation')} />
            <SliderField label="Stress" value={form.stress ?? 5} onChange={set('stress')} />
          </Card>

          <Card className="space-y-5">
            {[
              { field: 'highlights', label: 'Highlights', placeholder: 'What went well?' },
              { field: 'improvements', label: 'Areas to Improve', placeholder: 'What could be better?' },
              { field: 'goals_for_tomorrow', label: 'Goals for Tomorrow', placeholder: 'What will you focus on?' },
              { field: 'gratitude', label: 'Gratitude', placeholder: 'What are you grateful for?' },
              { field: 'notes', label: 'Notes', placeholder: 'Anything else?' },
            ].map(({ field, label, placeholder }) => (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">{label}</label>
                <textarea value={form[field] || ''} onChange={(e) => set(field)(e.target.value)}
                  placeholder={placeholder} rows={2}
                  className="w-full rounded-xl bg-bg-section border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border resize-none transition-colors" />
              </div>
            ))}
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
              <h1 className="text-lg font-bold text-text-primary">Journal Entry</h1>
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

        {/* Mood */}
        <Card className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${mood.bg} flex items-center justify-center`}>
            <MoodIcon size={24} className={mood.color} />
          </div>
          <div>
            <p className="text-lg font-bold text-text-primary">{entry.mood}</p>
            {mentalScore && (
              <p className="text-xs text-text-muted">Mental Game Score: <span className="font-semibold text-blue">{mentalScore}/10</span></p>
            )}
          </div>
        </Card>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Energy', value: entry.energy_level, icon: Zap, max: 10 },
            { label: 'Sleep', value: entry.sleep_hours ? `${entry.sleep_hours}h` : null, icon: Moon },
            { label: 'Sleep Quality', value: entry.sleep_quality, icon: Moon, max: 10 },
            { label: 'Confidence', value: entry.confidence, icon: Target, max: 10 },
            { label: 'Focus', value: entry.focus, icon: Brain, max: 10 },
            { label: 'Motivation', value: entry.motivation, icon: Flame, max: 10 },
            { label: 'Stress', value: entry.stress, icon: AlertTriangle, max: 10 },
          ].filter(m => m.value != null).map(({ label, value, icon: Icon, max }) => (
            <Card key={label} className="flex flex-col items-center py-3 space-y-1">
              <Icon size={14} className="text-text-muted" />
              <p className="text-sm font-bold text-text-primary">{max ? `${value}/${max}` : value}</p>
              <p className="text-[9px] text-text-muted uppercase">{label}</p>
            </Card>
          ))}
        </div>

        {/* Reflection sections */}
        {[
          { label: 'Highlights', value: entry.highlights },
          { label: 'Areas to Improve', value: entry.improvements },
          { label: 'Goals for Tomorrow', value: entry.goals_for_tomorrow },
          { label: 'Gratitude', value: entry.gratitude },
          { label: 'Notes', value: entry.notes },
        ].filter(s => s.value).map(({ label, value }) => (
          <Card key={label} className="space-y-2">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{value}</p>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}
