import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Smile, Frown, Meh, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useJournal } from '../hooks/useJournal'
import PageShell from '../components/ui/PageShell'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

const MOODS = [
  { value: 'Great', icon: ThumbsUp, color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' },
  { value: 'Good', icon: Smile, color: 'text-blue', bg: 'bg-blue/10', border: 'border-blue/30' },
  { value: 'Okay', icon: Meh, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
  { value: 'Bad', icon: Frown, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/30' },
  { value: 'Terrible', icon: ThumbsDown, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/30' },
]

function SliderField({ label, value, onChange, max = 10 }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-secondary">{label}</label>
        <span className="text-sm font-bold text-blue">{value}/{max}</span>
      </div>
      <input
        type="range"
        min="1"
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue"
      />
    </div>
  )
}

export default function JournalEntry() {
  const navigate = useNavigate()
  const { addEntry } = useJournal()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    entry_date: today,
    mood: '',
    energy_level: 5,
    sleep_hours: '',
    sleep_quality: 5,
    confidence: 5,
    focus: 5,
    motivation: 5,
    stress: 5,
    highlights: '',
    improvements: '',
    goals_for_tomorrow: '',
    gratitude: '',
    notes: '',
  })

  function set(field) {
    return (value) => setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.mood) {
      setError('Please select your mood.')
      return
    }
    setError('')
    setSubmitting(true)

    const payload = {
      entry_date: form.entry_date,
      mood: form.mood,
      energy_level: form.energy_level,
      sleep_hours: form.sleep_hours ? Number(form.sleep_hours) : null,
      sleep_quality: form.sleep_quality,
      confidence: form.confidence,
      focus: form.focus,
      motivation: form.motivation,
      stress: form.stress,
      highlights: form.highlights.trim() || null,
      improvements: form.improvements.trim() || null,
      goals_for_tomorrow: form.goals_for_tomorrow.trim() || null,
      gratitude: form.gratitude.trim() || null,
      notes: form.notes.trim() || null,
    }

    const { error } = await addEntry(payload)
    if (error) {
      setError(error.message)
      setSubmitting(false)
    } else {
      navigate('/journal', { replace: true })
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
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Daily Check-In</h1>
            <p className="text-xs text-text-muted">How are you feeling today?</p>
          </div>
        </div>

        {/* Date */}
        <Input
          label="Date"
          type="date"
          value={form.entry_date}
          onChange={(e) => set('entry_date')(e.target.value)}
          required
        />

        {/* Mood */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Mood</h2>
          <div className="flex justify-between gap-2">
            {MOODS.map(({ value, icon: Icon, color, bg, border }) => (
              <button
                key={value}
                type="button"
                onClick={() => set('mood')(value)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200 ${
                  form.mood === value
                    ? `${bg} border ${border}`
                    : 'bg-bg-section border border-border hover:border-border-blue'
                }`}
              >
                <Icon size={22} className={form.mood === value ? color : 'text-text-muted'} />
                <span className={`text-[10px] font-medium ${form.mood === value ? color : 'text-text-muted'}`}>
                  {value}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Energy & Sleep */}
        <Card className="space-y-5">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Energy & Sleep</h2>
          <SliderField label="Energy Level" value={form.energy_level} onChange={set('energy_level')} />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sleep (hours)"
              type="number"
              min="0"
              max="24"
              step="0.5"
              placeholder="8"
              value={form.sleep_hours}
              onChange={(e) => set('sleep_hours')(e.target.value)}
            />
            <div />
          </div>
          <SliderField label="Sleep Quality" value={form.sleep_quality} onChange={set('sleep_quality')} />
        </Card>

        {/* Mental Game */}
        <Card className="space-y-5">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Mental Game</h2>
          <SliderField label="Confidence" value={form.confidence} onChange={set('confidence')} />
          <SliderField label="Focus" value={form.focus} onChange={set('focus')} />
          <SliderField label="Motivation" value={form.motivation} onChange={set('motivation')} />
          <SliderField label="Stress" value={form.stress} onChange={set('stress')} />

          {/* Preview mental score */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-text-muted">Mental Game Score</span>
            <span className="text-sm font-bold text-blue">
              {((form.confidence + form.focus + form.motivation + (11 - form.stress)) / 4).toFixed(1)}/10
            </span>
          </div>
        </Card>

        {/* Reflection */}
        <Card className="space-y-5">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Reflection</h2>
          {[
            { field: 'highlights', label: 'Highlights', placeholder: 'What went well today?' },
            { field: 'improvements', label: 'Areas to Improve', placeholder: 'What could be better?' },
            { field: 'goals_for_tomorrow', label: 'Goals for Tomorrow', placeholder: 'What will you focus on?' },
            { field: 'gratitude', label: 'Gratitude', placeholder: 'What are you grateful for?' },
          ].map(({ field, label, placeholder }) => (
            <div key={field} className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">{label}</label>
              <textarea
                value={form[field]}
                onChange={(e) => set(field)(e.target.value)}
                placeholder={placeholder}
                rows={2}
                className="w-full rounded-xl bg-bg-section border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border resize-none transition-colors"
              />
            </div>
          ))}
        </Card>

        {/* Notes */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Additional Notes</h2>
          <textarea
            value={form.notes}
            onChange={(e) => set('notes')(e.target.value)}
            placeholder="Anything else on your mind?"
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
          {submitting ? 'Saving…' : 'Save Entry'}
        </Button>
      </form>
    </PageShell>
  )
}
