import { useState } from 'react'
import { BookOpen, ArrowLeft, Bookmark, Check, Clock, Search } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import { useToast } from '../../context/ToastContext'
import useContentLibrary from '../../hooks/useContentLibrary'

const barlow = { fontFamily: "'Barlow Condensed', sans-serif" }
const dmSans = { fontFamily: "'DM Sans', sans-serif" }

const TYPE_COLORS = { Drill: '#F97316', Recovery: '#3B82F6', Nutrition: '#22C55E' }
const TYPES = ['All', 'Drill', 'Recovery', 'Nutrition']
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Elite']
const DIFF_VARIANTS = { Beginner: 'beginner', Intermediate: 'intermediate', Advanced: 'elite', Elite: 'elite' }

function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] || '#9CA3AF'
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap"
      style={{ backgroundColor: `${color}20`, color, borderColor: `${color}40`, ...dmSans }}>
      {type}
    </span>
  )
}

function Pill({ label, active, onClick }) {
  return (
    <button onClick={onClick} className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer"
      style={{
        backgroundColor: active ? 'var(--accent-primary)' : 'var(--bg-surface)',
        color: active ? '#fff' : 'var(--text-secondary)',
        border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
        ...dmSans,
      }}>
      {label}
    </button>
  )
}

function ContentCard({ item, saved, completed, onTap, onToggleSave }) {
  return (
    <Card hover onClick={onTap}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <TypeBadge type={item.content_type} />
        <div className="flex items-center gap-2 flex-shrink-0">
          {completed && <Check className="w-4 h-4" style={{ color: 'var(--success)' }} />}
          <button onClick={e => { e.stopPropagation(); onToggleSave() }} className="cursor-pointer p-0.5"
            style={{ color: saved ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
            <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)', ...barlow }}>{item.title}</h3>
      <p className="text-xs mb-2 line-clamp-2" style={{ color: 'var(--text-muted)', ...dmSans }}>{item.description}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={DIFF_VARIANTS[item.difficulty] || 'default'}>{item.difficulty}</Badge>
        {item.duration_minutes && (
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)', ...dmSans }}>
            <Clock className="w-3 h-3" />{item.duration_minutes}m
          </span>
        )}
      </div>
    </Card>
  )
}

function DetailView({ item, saved, completed, onBack, onToggleSave, onComplete }) {
  const color = TYPE_COLORS[item.content_type] || '#9CA3AF'
  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm cursor-pointer"
        style={{ color: 'var(--text-secondary)', ...dmSans }}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div>
        <TypeBadge type={item.content_type} />
        <h1 className="text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)', ...barlow }}>{item.title}</h1>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={DIFF_VARIANTS[item.difficulty] || 'default'}>{item.difficulty}</Badge>
        {item.duration_minutes && (
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)', ...dmSans }}>
            <Clock className="w-3 h-3" />{item.duration_minutes} min
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', ...dmSans }}>{item.description}</p>
      <Card padding="sm" className="border-l-4" style={{ borderLeftColor: color }}>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', ...dmSans }}>
          <span style={{ color, fontWeight: 700 }}>Coaching Tip: </span>{item.coaching_cue}
        </p>
      </Card>
      {item.equipment_needed?.length > 0 && (
        <div>
          <h4 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)', ...barlow }}>Equipment</h4>
          <div className="flex flex-wrap gap-1.5">
            {item.equipment_needed.map(e => <Badge key={e}>{e}</Badge>)}
          </div>
        </div>
      )}
      {item.tags?.length > 0 && (
        <div>
          <h4 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)', ...barlow }}>Tags</h4>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map(t => <Badge key={t} variant="default">{t}</Badge>)}
          </div>
        </div>
      )}
      <div className="flex gap-3 mt-2">
        {completed ? (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--success)', ...dmSans }}>
            <Check className="w-5 h-5" /> Completed
          </div>
        ) : (
          <Button onClick={onComplete}>Mark as Completed</Button>
        )}
        <Button variant="outline" onClick={onToggleSave}>
          <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
          {saved ? 'Saved' : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default function Training() {
  const { content, loading, fetchContent, savedIds, saveContent, unsaveContent, markCompleted, completedIds, activeFilter } = useContentLibrary()
  const { showToast } = useToast()
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  const updateFilter = (key, value) => fetchContent({ ...activeFilter, [key]: value })

  const handleSearch = (e) => {
    setSearch(e.target.value)
    fetchContent({ ...activeFilter, searchQuery: e.target.value })
  }

  const toggleSave = (id) => {
    if (savedIds.has(id)) { unsaveContent(id); showToast('Removed from saved', 'info') }
    else { saveContent(id); showToast('Saved to library', 'success') }
  }

  const handleComplete = (id) => {
    markCompleted(id)
    showToast('Marked as completed!', 'success')
  }

  if (selected) {
    return (
      <PageWrapper>
        <DetailView item={selected} saved={savedIds.has(selected.id)} completed={completedIds.has(selected.id)}
          onBack={() => setSelected(null)} onToggleSave={() => toggleSave(selected.id)}
          onComplete={() => handleComplete(selected.id)} />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)', ...barlow }}>Training</h1>
      <div className="flex gap-2 mb-3 flex-wrap">
        {TYPES.map(t => (
          <Pill key={t} label={t === 'All' ? 'All' : `${t}s`} active={activeFilter.contentType === t}
            onClick={() => updateFilter('contentType', t)} />
        ))}
      </div>
      <div className="flex gap-2 mb-3 flex-wrap">
        {DIFFICULTIES.map(d => (
          <Pill key={d} label={d} active={activeFilter.difficulty === d}
            onClick={() => updateFilter('difficulty', d)} />
        ))}
      </div>
      <div className="mb-4">
        <Input placeholder="Search drills, recovery..." value={search} onChange={handleSearch} />
      </div>
      {loading ? (
        <SkeletonLoader variant="card" count={4} />
      ) : content.length === 0 ? (
        <EmptyState icon={BookOpen} title="No Content Found" description="Try adjusting your filters or search." />
      ) : (
        <div className="grid gap-3">
          {content.map(item => (
            <ContentCard key={item.id} item={item} saved={savedIds.has(item.id)} completed={completedIds.has(item.id)}
              onTap={() => setSelected(item)} onToggleSave={() => toggleSave(item.id)} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
