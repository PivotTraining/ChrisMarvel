import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Film, Plus, Search, X, Tag, Star, Clock, Filter, ChevronDown, ChevronUp, Trash2, Edit3, Check } from 'lucide-react'
import { useFilmNotes } from '../hooks/useFilmNotes'
import { useGames } from '../hooks/useGames'
import { useToast } from '../contexts/ToastContext'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const PLAY_TYPES = [
  { key: 'offense', label: 'Offense', color: 'text-blue bg-blue/10 border-blue-border' },
  { key: 'defense', label: 'Defense', color: 'text-success bg-success/10 border-success/20' },
  { key: 'transition', label: 'Transition', color: 'text-warning bg-warning/10 border-warning/20' },
  { key: 'set_play', label: 'Set Play', color: 'text-blue bg-blue/5 border-blue-border/30' },
  { key: 'turnover', label: 'Turnover', color: 'text-danger bg-danger/10 border-danger/20' },
  { key: 'highlight', label: 'Highlight', color: 'text-gold bg-gold/10 border-gold/30' },
  { key: 'mistake', label: 'Mistake', color: 'text-danger bg-danger/5 border-danger/10' },
  { key: 'other', label: 'Other', color: 'text-text-secondary bg-bg-section border-border' },
]

const QUICK_TAGS = ['Crossover', 'Screen Action', 'Post Up', 'Fast Break', 'Pick & Roll', 'Iso', 'Closeout', 'Help Defense', 'Box Out', 'Transition D', 'Clutch', 'Bad Decision']

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4', 'OT']

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange(value === n ? 0 : n)}>
          <Star size={16} className={n <= value ? 'text-gold fill-gold' : 'text-text-muted'} />
        </button>
      ))}
    </div>
  )
}

export default function FilmRoom() {
  const navigate = useNavigate()
  const { notes, loading, allTags, addNote, deleteNote } = useFilmNotes()
  const { games } = useGames()
  const toast = useToast()

  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState(null)
  const [filterTag, setFilterTag] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [playType, setPlayType] = useState('offense')
  const [quarter, setQuarter] = useState('')
  const [timestampLabel, setTimestampLabel] = useState('')
  const [selectedGame, setSelectedGame] = useState('')
  const [tags, setTags] = useState([])
  const [customTag, setCustomTag] = useState('')
  const [rating, setRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  function toggleTag(tag) {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  function addCustomTag() {
    const t = customTag.trim()
    if (t && !tags.includes(t)) {
      setTags(prev => [...prev, t])
      setCustomTag('')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    const { error } = await addNote({
      title: title.trim(),
      body: body.trim() || null,
      play_type: playType,
      quarter: quarter || null,
      timestamp_label: timestampLabel.trim() || null,
      game_id: selectedGame || null,
      tags,
      rating: rating || null,
    })
    setSubmitting(false)
    if (error) {
      toast(error.message || 'Failed to save')
    } else {
      toast('Film note saved!')
      resetForm()
    }
  }

  function resetForm() {
    setShowForm(false)
    setTitle('')
    setBody('')
    setPlayType('offense')
    setQuarter('')
    setTimestampLabel('')
    setSelectedGame('')
    setTags([])
    setRating(0)
  }

  // Filtered notes
  const filtered = useMemo(() => {
    let list = notes
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        (n.body || '').toLowerCase().includes(q) ||
        (n.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }
    if (filterType) {
      list = list.filter(n => n.play_type === filterType)
    }
    if (filterTag) {
      list = list.filter(n => (n.tags || []).includes(filterTag))
    }
    return list
  }, [notes, query, filterType, filterTag])

  // Stats
  const notesByType = useMemo(() => {
    const map = {}
    notes.forEach(n => {
      map[n.play_type] = (map[n.play_type] || 0) + 1
    })
    return map
  }, [notes])

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors" aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <SectionHeader
            title="Film Room"
            subtitle={`${notes.length} note${notes.length !== 1 ? 's' : ''}`}
            action={
              <Button size="sm" onClick={() => setShowForm(!showForm)}>
                {showForm ? <X size={14} /> : <Plus size={14} />}
                {showForm ? 'Close' : 'Add'}
              </Button>
            }
          />
        </div>

        {/* Quick stats */}
        {notes.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PLAY_TYPES.filter(pt => notesByType[pt.key]).map(pt => (
              <button
                key={pt.key}
                onClick={() => setFilterType(filterType === pt.key ? null : pt.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium border whitespace-nowrap transition-all shrink-0 ${
                  filterType === pt.key ? 'ring-1 ring-blue ' + pt.color : pt.color
                }`}
              >
                {pt.label}
                <span className="opacity-60">{notesByType[pt.key]}</span>
              </button>
            ))}
          </div>
        )}

        {/* Add Note Form */}
        {showForm && (
          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-text-primary">New Film Note</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Note title (e.g. 'Pick & Roll read')"
                maxLength={80}
                className="w-full rounded-xl bg-bg-section border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
              />
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Describe the play, what you noticed, what to improve..."
                rows={3}
                className="w-full rounded-xl bg-bg-section border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border resize-none transition-colors"
              />

              {/* Play Type */}
              <div className="space-y-1.5">
                <p className="text-xs text-text-muted">Play Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {PLAY_TYPES.map(pt => (
                    <button key={pt.key} type="button" onClick={() => setPlayType(pt.key)} className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${playType === pt.key ? 'ring-1 ring-blue ' + pt.color : 'bg-bg-section border-border text-text-muted'}`}>
                      {pt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quarter & Timestamp */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <p className="text-xs text-text-muted">Quarter</p>
                  <div className="flex gap-1">
                    {QUARTERS.map(q => (
                      <button key={q} type="button" onClick={() => setQuarter(quarter === q ? '' : q)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium ${quarter === q ? 'bg-blue text-white' : 'bg-bg-section border border-border text-text-secondary'}`}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-text-muted">Time</p>
                  <input
                    type="text"
                    value={timestampLabel}
                    onChange={e => setTimestampLabel(e.target.value)}
                    placeholder="e.g. 3:42"
                    className="w-full rounded-lg bg-bg-section border border-border px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
                  />
                </div>
              </div>

              {/* Link to game */}
              {games.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-text-muted">Link to Game (optional)</p>
                  <select
                    value={selectedGame}
                    onChange={e => setSelectedGame(e.target.value)}
                    className="w-full rounded-lg bg-bg-section border border-border px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-blue-border transition-colors"
                  >
                    <option value="">No game linked</option>
                    {games.slice(0, 20).map(g => {
                      const d = new Date(g.game_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      return (
                        <option key={g.id} value={g.id}>
                          {d} — {g.opponent ? `vs ${g.opponent}` : 'Game'} ({g.points} PTS)
                        </option>
                      )
                    })}
                  </select>
                </div>
              )}

              {/* Tags */}
              <div className="space-y-1.5">
                <p className="text-xs text-text-muted">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_TAGS.map(t => (
                    <button key={t} type="button" onClick={() => toggleTag(t)} className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all ${tags.includes(t) ? 'bg-blue text-white' : 'bg-bg-section border border-border text-text-muted'}`}>
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTag}
                    onChange={e => setCustomTag(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag() } }}
                    placeholder="Custom tag..."
                    maxLength={30}
                    className="flex-1 rounded-lg bg-bg-section border border-border px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border"
                  />
                  {customTag.trim() && (
                    <button type="button" onClick={addCustomTag} className="text-blue text-xs font-medium">Add</button>
                  )}
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue/10 text-blue text-[10px] font-medium">
                        {t}
                        <button type="button" onClick={() => toggleTag(t)}><X size={8} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-text-muted">Importance</p>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <Button type="submit" fullWidth disabled={submitting || !title.trim()}>
                {submitting ? 'Saving...' : 'Save Note'}
              </Button>
            </form>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search notes, tags..."
            className="w-full rounded-xl bg-bg-card border border-border pl-10 pr-10 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary mb-2">
              <Filter size={12} />
              Tags
              {showFilters ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {showFilters && (
              <div className="flex flex-wrap gap-1.5">
                {allTags.map(t => (
                  <button key={t} onClick={() => setFilterTag(filterTag === t ? null : t)} className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all ${filterTag === t ? 'bg-blue text-white' : 'bg-bg-section border border-border text-text-muted'}`}>
                    <Tag size={8} className="inline mr-0.5" />{t}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active filters */}
        {(filterType || filterTag) && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-muted">Filters:</span>
            {filterType && (
              <button onClick={() => setFilterType(null)} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue/10 text-blue text-[10px] font-medium">
                {PLAY_TYPES.find(p => p.key === filterType)?.label} <X size={8} />
              </button>
            )}
            {filterTag && (
              <button onClick={() => setFilterTag(null)} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue/10 text-blue text-[10px] font-medium">
                {filterTag} <X size={8} />
              </button>
            )}
          </div>
        )}

        {/* Notes list */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-bg-section border border-border flex items-center justify-center">
                <Film size={24} className="text-text-muted" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-text-primary">{query || filterType || filterTag ? 'No matching notes' : 'No film notes yet'}</p>
                <p className="text-xs text-text-muted">{query || filterType || filterTag ? 'Try different search terms or filters.' : 'Add notes to break down plays and track what to improve.'}</p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(note => (
              <FilmNoteCard key={note.id} note={note} games={games} onDelete={deleteNote} toast={toast} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}

function FilmNoteCard({ note, games, onDelete, toast }) {
  const [expanded, setExpanded] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const typeConfig = PLAY_TYPES.find(pt => pt.key === note.play_type) || PLAY_TYPES[7]
  const linkedGame = note.game_id ? games.find(g => g.id === note.game_id) : null

  async function handleDelete() {
    const { error } = await onDelete(note.id)
    if (!error) toast('Note deleted')
  }

  return (
    <Card className="space-y-2">
      <div className="flex items-start gap-3" onClick={() => setExpanded(!expanded)}>
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${typeConfig.color}`}>
          <Film size={14} />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-text-primary">{note.title}</p>
            {expanded ? <ChevronUp size={14} className="text-text-muted shrink-0" /> : <ChevronDown size={14} className="text-text-muted shrink-0" />}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${typeConfig.color}`}>{typeConfig.label}</span>
            {note.quarter && (
              <span className="text-[9px] text-text-muted flex items-center gap-0.5"><Clock size={8} />{note.quarter}{note.timestamp_label ? ` ${note.timestamp_label}` : ''}</span>
            )}
            {note.rating > 0 && (
              <span className="text-[9px] text-gold flex items-center gap-0.5">
                {Array.from({ length: note.rating }, (_, i) => <Star key={i} size={8} className="fill-gold" />)}
              </span>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="space-y-2 pt-2 border-t border-border">
          {note.body && <p className="text-xs text-text-secondary leading-relaxed">{note.body}</p>}

          {linkedGame && (
            <div className="text-[10px] text-text-muted bg-bg-section rounded-lg px-2.5 py-1.5">
              Linked: {linkedGame.opponent ? `vs ${linkedGame.opponent}` : 'Game'} — {new Date(linkedGame.game_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({linkedGame.points} PTS)
            </div>
          )}

          {(note.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-bg-section border border-border text-[9px] text-text-muted">{t}</span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-text-muted">
              {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {confirming ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-danger">Delete?</span>
                <button onClick={handleDelete} className="text-danger"><Check size={14} /></button>
                <button onClick={() => setConfirming(false)} className="text-text-muted"><X size={14} /></button>
              </div>
            ) : (
              <button onClick={() => setConfirming(true)} className="text-text-muted hover:text-danger">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
