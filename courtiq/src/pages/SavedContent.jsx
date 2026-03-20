import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Dumbbell, Heart, Apple, Clock, BookmarkCheck, Bookmark, Star,
} from 'lucide-react'
import { useTrainingContent } from '../hooks/useTrainingContent'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'

const DIFFICULTY_COLORS = {
  Beginner: 'text-success bg-success/10',
  Intermediate: 'text-warning bg-warning/10',
  Advanced: 'text-danger bg-danger/10',
}

export default function SavedContent() {
  const navigate = useNavigate()
  const { content, savedIds, loading, toggleSave } = useTrainingContent()

  const saved = content.filter(c => savedIds.has(c.id))

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <SectionHeader title="Saved" subtitle={`${saved.length} saved item${saved.length !== 1 ? 's' : ''}`} />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : saved.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center py-10 text-center space-y-3">
              <Bookmark size={24} className="text-text-muted" />
              <p className="text-sm text-text-muted">No saved content yet.</p>
              <button
                onClick={() => navigate('/library')}
                className="text-blue text-sm font-medium"
              >
                Browse Library
              </button>
            </div>
          </Card>
        ) : (
          <section className="space-y-3">
            {saved.map(item => {
              const TypeIcon = item.content_type === 'drill' ? Dumbbell
                : item.content_type === 'recovery' ? Heart
                : Apple

              return (
                <Card key={item.id} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-bg-section border border-border flex items-center justify-center shrink-0">
                      <TypeIcon size={18} className="text-text-muted" />
                    </div>
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => navigate(`/library/${item.id}`)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-text-primary line-clamp-1">{item.title}</p>
                        {item.is_featured && <Star size={12} className="text-gold fill-gold shrink-0 mt-0.5" />}
                      </div>
                      {item.description && (
                        <p className="text-xs text-text-muted line-clamp-2 mt-1">{item.description}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSave(item.id) }}
                      className="p-1.5 rounded-lg hover:bg-bg-section transition-colors shrink-0"
                      aria-label="Unsave"
                    >
                      <BookmarkCheck size={16} className="text-blue" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 pl-13">
                    {item.difficulty && (
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${DIFFICULTY_COLORS[item.difficulty]}`}>
                        {item.difficulty}
                      </span>
                    )}
                    {item.category && (
                      <span className="text-[10px] text-text-muted">{item.category}</span>
                    )}
                    {item.duration_minutes && (
                      <span className="text-[10px] text-text-muted flex items-center gap-0.5">
                        <Clock size={9} /> {item.duration_minutes}m
                      </span>
                    )}
                  </div>
                </Card>
              )
            })}
          </section>
        )}
      </div>
    </PageShell>
  )
}
