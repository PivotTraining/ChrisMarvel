import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Plus, X, MapPin, Clock, Trash2, Check, Circle, ChevronDown } from 'lucide-react'
import { useSchedule } from '../hooks/useSchedule'
import { useToast } from '../contexts/ToastContext'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'

const EVENT_TYPES = [
  { key: 'practice', label: 'Practice', color: 'text-blue', bg: 'bg-blue/10 border-blue-border' },
  { key: 'game', label: 'Game', color: 'text-success', bg: 'bg-success/10 border-success/20' },
  { key: 'workout', label: 'Workout', color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
  { key: 'other', label: 'Other', color: 'text-text-secondary', bg: 'bg-bg-section border-border' },
]

export default function Schedule() {
  const navigate = useNavigate()
  const { events, loading, addEvent, toggleComplete, deleteEvent } = useSchedule()
  const toast = useToast()

  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [eventType, setEventType] = useState('practice')
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0])
  const [eventTime, setEventTime] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  const { upcoming, past } = useMemo(() => {
    const up = events.filter(e => e.event_date >= today && !e.completed)
    const p = events.filter(e => e.event_date < today || e.completed)
    return { upcoming: up, past: p }
  }, [events, today])

  async function handleSave(e) {
    e.preventDefault()
    if (!title.trim() || !eventDate) return
    setSaving(true)
    const { error } = await addEvent({
      title: title.trim(),
      event_type: eventType,
      event_date: eventDate,
      event_time: eventTime || null,
      location: location.trim() || null,
      notes: notes.trim() || null,
    })
    setSaving(false)
    if (!error) {
      toast('Event added!')
      setShowForm(false)
      setTitle('')
      setEventType('practice')
      setEventDate(new Date().toISOString().split('T')[0])
      setEventTime('')
      setLocation('')
      setNotes('')
    } else {
      toast('Failed to add event', 'error')
    }
  }

  async function handleDelete(id) {
    await deleteEvent(id)
    setConfirmId(null)
    toast('Event deleted', 'info')
  }

  function EventCard({ event }) {
    const typeInfo = EVENT_TYPES.find(t => t.key === event.event_type) || EVENT_TYPES[3]
    const date = new Date(event.event_date + 'T12:00:00')
    const formatted = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    const isPast = event.event_date < today
    const isToday = event.event_date === today

    return (
      <Card className={`space-y-2 ${event.completed ? 'opacity-50' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={() => toggleComplete(event.id)}
              className={`mt-0.5 shrink-0 ${event.completed ? 'text-success' : 'text-text-muted hover:text-text-secondary'}`}
              aria-label={event.completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {event.completed ? <Check size={18} /> : <Circle size={18} />}
            </button>
            <div className="min-w-0 space-y-1">
              <p className={`text-sm font-semibold truncate ${event.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                {event.title}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${typeInfo.bg} ${typeInfo.color}`}>
                  {typeInfo.label}
                </span>
                <span className={`text-[10px] flex items-center gap-1 ${isToday ? 'text-blue font-medium' : 'text-text-muted'}`}>
                  <Calendar size={10} />
                  {isToday ? 'Today' : formatted}
                </span>
                {event.event_time && (
                  <span className="text-[10px] text-text-muted flex items-center gap-1">
                    <Clock size={10} />
                    {event.event_time}
                  </span>
                )}
                {event.location && (
                  <span className="text-[10px] text-text-muted flex items-center gap-1">
                    <MapPin size={10} />
                    {event.location}
                  </span>
                )}
              </div>
              {event.notes && (
                <p className="text-[10px] text-text-muted">{event.notes}</p>
              )}
            </div>
          </div>
          {confirmId === event.id ? (
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setConfirmId(null)} className="text-[10px] text-text-muted">Cancel</button>
              <button onClick={() => handleDelete(event.id)} className="text-[10px] font-semibold text-danger">Delete</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmId(event.id)}
              className="p-1 rounded-lg hover:bg-bg-section transition-colors shrink-0"
              aria-label="Delete"
            >
              <Trash2 size={13} className="text-text-muted" />
            </button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Schedule"
          subtitle="Plan practices, games, and workouts."
          action={
            <Button size="sm" onClick={() => setShowForm(!showForm)}>
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? 'Cancel' : 'Add'}
            </Button>
          }
        />

        {/* Add Event Form */}
        {showForm && (
          <Card className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">New Event</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Event title"
                className="w-full rounded-lg bg-bg-section border border-border px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
                required
              />

              {/* Type selector */}
              <div className="flex gap-2">
                {EVENT_TYPES.map(t => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setEventType(t.key)}
                    className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                      eventType === t.key
                        ? `${t.bg} border ${t.color}`
                        : 'bg-bg-section border border-border text-text-muted'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="rounded-lg bg-bg-section border border-border px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-blue-border transition-colors"
                  required
                />
                <input
                  type="time"
                  value={eventTime}
                  onChange={e => setEventTime(e.target.value)}
                  className="rounded-lg bg-bg-section border border-border px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-blue-border transition-colors"
                />
              </div>

              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Location (optional)"
                className="w-full rounded-lg bg-bg-section border border-border px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
              />

              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Notes (optional)"
                rows={2}
                className="w-full rounded-lg bg-bg-section border border-border px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border resize-none transition-colors"
              />

              <Button type="submit" fullWidth disabled={saving || !title.trim()}>
                {saving ? 'Saving...' : 'Add Event'}
              </Button>
            </form>
          </Card>
        )}

        {/* Content */}
        {loading ? (
          <Skeleton count={3} />
        ) : events.length === 0 && !showForm ? (
          <Card>
            <div className="flex flex-col items-center py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-bg-section border border-border flex items-center justify-center">
                <Calendar size={22} className="text-text-muted" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-text-primary">No events scheduled</p>
                <p className="text-xs text-text-muted">Plan your practices, games, and workouts ahead of time.</p>
              </div>
              <Button size="sm" onClick={() => setShowForm(true)}>
                <Plus size={14} />
                Add Event
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                  Upcoming ({upcoming.length})
                </h2>
                {upcoming.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </section>
            )}

            {/* Past / Completed */}
            {past.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                  Past & Completed ({past.length})
                </h2>
                {past.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </PageShell>
  )
}
