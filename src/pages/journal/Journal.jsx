import { useState, useMemo, useEffect } from 'react'
import { BookHeart, ArrowLeft, Trash2, Heart } from 'lucide-react'
import { localToday } from '../../utils/dateUtils'
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

const MOOD_COLORS = {
  Great: 'var(--color-success)',
  Good: 'var(--color-info)',
  Okay: 'var(--color-warning)',
  Bad: 'var(--color-accent)',
  Terrible: 'var(--color-danger)',
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="t-label">{label}</label>}
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-base resize-y"
        style={{ minHeight: '80px' }}
      />
    </div>
  )
}

function MentalGameScore({ confidence, focus, stress, sleep_quality, energy_level }) {
  const score = ((confidence + focus + (11 - stress) + sleep_quality + energy_level) / 5).toFixed(1)
  return (
    <div className="flex flex-col items-center py-4">
      <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>Mental Game Score</span>
      <span className="t-title1" style={{ color: 'var(--color-accent)', fontSize: '48px' }}>{score}</span>
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
          <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>{date}</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: MOOD_COLORS[entry.mood] || 'var(--color-text-sec)' }} />
            <span className="t-body" style={{ color: 'var(--color-text)', fontWeight: 600 }}>{entry.mood}</span>
          </div>
          {entry.tags?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-1">
              {entry.tags.map(t => <Badge key={t}>{t}</Badge>)}
            </div>
          )}
        </div>
        <span className="t-title2" style={{ color: 'var(--color-accent)' }}>{mgs}</span>
      </div>
    </Card>
  )
}

const defaultForm = () => ({
  entry_date: localToday(),
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
      <button type="button" onClick={onBack} className="flex items-center gap-1.5 self-start btn-ghost" style={{ padding: '8px 16px' }}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="t-title2" style={{ color: 'var(--color-text)' }}>{editing ? 'Edit Entry' : 'New Entry'}</h1>

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
          style={{ color: 'var(--color-danger)' }}>
          <Trash2 className="w-4 h-4 mr-1.5" /> Delete Entry
        </Button>
      )}
    </form>
  )
}

export default function Journal() {
  const { entries, allEntries, loading, addEntry, updateEntry, deleteEntry, loadMore, hasMore, showMentalHealthSupport } = useJournal()
  const { showToast } = useToast()
  const [view, setView] = useState('list')
  const [editingEntry, setEditingEntry] = useState(null)
  const [saving, setSaving] = useState(false)

  const openNew = () => {
    setEditingEntry(null); setView('form')
  }
  const openEdit = entry => { setEditingEntry(entry); setView('form') }
  const backToList = () => setView('list')

  // Auto-open form when there are no entries yet (skip empty state)
  useEffect(() => {
    if (!loading && (!entries || entries.length === 0) && view === 'list') {
      setEditingEntry(null)
      setView('form')
    }
  }, [loading, entries, view])

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
        <h1 className="t-title2" style={{ color: 'var(--color-text)' }}>Journal</h1>
        <Button variant="primary" onClick={openNew}>New Entry</Button>
      </div>

      {showMentalHealthSupport && (
        <Card padding="md" className="mb-5" style={{ borderColor: 'rgba(139,92,246,0.35)', background: 'linear-gradient(135deg, var(--color-info-tint), var(--color-purple-tint))' }}>
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-purple)' }} />
            <div>
              <p className="t-body" style={{ color: 'var(--color-text)', fontWeight: 600, marginBottom: '4px' }}>
                We notice things have been tough lately.
              </p>
              <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>
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
