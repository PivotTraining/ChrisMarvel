import { useState, useMemo } from 'react'
import { BookHeart, ArrowLeft, Trash2, Heart } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Slider from '../../components/ui/Slider'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import { useToast } from '../../context/ToastContext'
import useJournal from '../../hooks/useJournal'

const MOODS = [
  { value: 'Great', label: 'Great' },
  { value: 'Good', label: 'Good' },
  { value: 'Okay', label: 'Okay' },
  { value: 'Bad', label: 'Bad' },
  { value: 'Terrible', label: 'Terrible' },
]

const MOOD_COLORS = { Great: '#22C55E', Good: '#3B82F6', Okay: '#EAB308', Bad: '#F97316', Terrible: '#EF4444' }

const barlow = { fontFamily: "'Barlow Condensed', sans-serif" }
const dmSans = { fontFamily: "'DM Sans', sans-serif" }

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)', ...dmSans }}>{label}</label>}
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 resize-y"
        style={{
          backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)', ...dmSans,
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)' }}
        onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = 'none' }}
      />
    </div>
  )
}

function MentalGameScore({ confidence, focus, stress, sleep_quality, energy_level }) {
  const score = ((confidence + focus + (11 - stress) + sleep_quality + energy_level) / 5).toFixed(1)
  return (
    <div className="flex flex-col items-center py-4">
      <span className="text-sm" style={{ color: 'var(--text-muted)', ...dmSans }}>Mental Game Score</span>
      <span className="text-5xl font-bold" style={{ color: 'var(--accent-primary)', ...barlow }}>{score}</span>
    </div>
  )
}

function JournalEntryCard({ entry, onClick }) {
  const date = new Date(entry.entry_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  const mgs = entry.mental_game_score != null ? entry.mental_game_score : '—'
  return (
    <Card hover onClick={onClick} padding="md">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs" style={{ color: 'var(--text-muted)', ...dmSans }}>{date}</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: MOOD_COLORS[entry.mood] || 'var(--text-muted)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)', ...dmSans }}>{entry.mood}</span>
          </div>
          {entry.tags?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-1">
              {entry.tags.map(t => <Badge key={t}>{t}</Badge>)}
            </div>
          )}
        </div>
        <span className="text-3xl font-bold" style={{ color: 'var(--accent-primary)', ...barlow }}>{mgs}</span>
      </div>
    </Card>
  )
}

const defaultForm = () => ({
  entry_date: new Date().toISOString().slice(0, 10),
  mood: '', energy_level: 5, confidence: 5, focus: 5, stress: 5, sleep_quality: 5,
  goals_text: '', gratitude_text: '', reflection_text: '', tags: '',
})

function JournalForm({ entry, onSave, onDelete, onBack, saving }) {
  const editing = !!entry
  const [form, setForm] = useState(() => {
    if (entry) return { ...entry, tags: Array.isArray(entry.tags) ? entry.tags.join(', ') : entry.tags || '' }
    return defaultForm()
  })
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = e => {
    e.preventDefault()
    const data = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] }
    data.mental_game_score = +((data.confidence + data.focus + (11 - data.stress) + data.sleep_quality + data.energy_level) / 5).toFixed(1)
    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm self-start" style={{ color: 'var(--text-secondary)', ...dmSans, background: 'none', border: 'none', cursor: 'pointer' }}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', ...barlow }}>{editing ? 'Edit Entry' : 'New Entry'}</h1>

      <Input label="Date" type="date" value={form.entry_date} onChange={e => set('entry_date', e.target.value)} />
      <Select label="Mood" value={form.mood} onChange={e => set('mood', e.target.value)} options={MOODS} placeholder="How are you feeling?" />

      <Slider label="Energy Level" value={form.energy_level} onChange={e => set('energy_level', +e.target.value)} min={1} max={10} />
      <Slider label="Confidence" value={form.confidence} onChange={e => set('confidence', +e.target.value)} min={1} max={10} />
      <Slider label="Focus" value={form.focus} onChange={e => set('focus', +e.target.value)} min={1} max={10} />
      <Slider label="Stress" value={form.stress} onChange={e => set('stress', +e.target.value)} min={1} max={10} />
      <Slider label="Sleep Quality" value={form.sleep_quality} onChange={e => set('sleep_quality', +e.target.value)} min={1} max={10} />

      <MentalGameScore {...form} />

      <TextArea label="Goals" value={form.goals_text} onChange={e => set('goals_text', e.target.value)} placeholder="What are you working toward?" />
      <TextArea label="Gratitude" value={form.gratitude_text} onChange={e => set('gratitude_text', e.target.value)} placeholder="What are you grateful for?" />
      <TextArea label="Reflection" value={form.reflection_text} onChange={e => set('reflection_text', e.target.value)} placeholder="How did today go?" />
      <Input label="Tags" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. practice, tournament, mindset" />

      <Button type="submit" variant="primary" loading={saving} fullWidth>Save Entry</Button>
      {editing && (
        <Button type="button" variant="ghost" fullWidth onClick={() => onDelete(entry.id)}
          style={{ color: 'var(--danger)' }}>
          <Trash2 className="w-4 h-4 mr-1.5" /> Delete Entry
        </Button>
      )}
    </form>
  )
}

export default function Journal() {
  const { entries, loading, addEntry, updateEntry, deleteEntry, loadMore, hasMore, showMentalHealthSupport } = useJournal()
  const { showToast } = useToast()
  const [view, setView] = useState('list')
  const [editingEntry, setEditingEntry] = useState(null)
  const [saving, setSaving] = useState(false)

  const openNew = () => { setEditingEntry(null); setView('form') }
  const openEdit = entry => { setEditingEntry(entry); setView('form') }
  const backToList = () => setView('list')

  const handleSave = async data => {
    setSaving(true)
    try {
      if (editingEntry) { await updateEntry(editingEntry.id, data); showToast('Entry updated', 'success') }
      else { await addEntry(data); showToast('Entry saved', 'success') }
      backToList()
    } catch { showToast('Failed to save entry', 'error') }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    try { await deleteEntry(id); showToast('Entry deleted', 'success'); backToList() }
    catch { showToast('Failed to delete', 'error') }
  }

  if (view === 'form') {
    return (
      <PageWrapper>
        <JournalForm entry={editingEntry} onSave={handleSave} onDelete={handleDelete} onBack={backToList} saving={saving} />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', ...barlow }}>Journal</h1>
        <Button variant="primary" onClick={openNew}>New Entry</Button>
      </div>

      {showMentalHealthSupport && (
        <Card padding="md" className="mb-5" style={{ borderColor: 'rgba(139,92,246,0.35)', background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))' }}>
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#8B5CF6' }} />
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)', ...dmSans }}>
                We notice things have been tough lately.
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)', ...dmSans }}>
                It's okay to not feel your best. Consider reaching out to a coach, counselor, or someone you trust. You don't have to work through it alone.
              </p>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <SkeletonLoader variant="list" rows={4} />
      ) : !entries?.length ? (
        <EmptyState icon={BookHeart} title="No Journal Entries" description="Track your mental game and growth" actionLabel="Write Your First Entry" onAction={openNew} />
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map(e => <JournalEntryCard key={e.id} entry={e} onClick={() => openEdit(e)} />)}
          {hasMore && (
            <Button variant="outline" fullWidth onClick={loadMore} className="mt-2">Load More</Button>
          )}
        </div>
      )}
    </PageWrapper>
  )
}
