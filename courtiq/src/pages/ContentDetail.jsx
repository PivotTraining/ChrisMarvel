import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Clock, Dumbbell, Heart, Apple, Star,
  Bookmark, BookmarkCheck, MessageCircle, Tag,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useTrainingContent } from '../hooks/useTrainingContent'
import PageShell from '../components/ui/PageShell'
import Card from '../components/ui/Card'

const DIFFICULTY_COLORS = {
  Beginner: 'text-success bg-success/10',
  Intermediate: 'text-warning bg-warning/10',
  Advanced: 'text-danger bg-danger/10',
}

export default function ContentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const { savedIds, toggleSave, recordView } = useTrainingContent()

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('training_content')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setItem(data)
        recordView(data.id)
      }
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!item) {
    return (
      <PageShell>
        <div className="flex flex-col items-center py-16 text-center space-y-3">
          <p className="text-sm text-text-muted">Content not found.</p>
          <button onClick={() => navigate(-1)} className="text-blue text-sm font-medium">Go back</button>
        </div>
      </PageShell>
    )
  }

  const TypeIcon = item.content_type === 'drill' ? Dumbbell
    : item.content_type === 'recovery' ? Heart
    : Apple

  const isSaved = savedIds.has(item.id)

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
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
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-muted capitalize">{item.content_type}</p>
            <h1 className="text-lg font-bold text-text-primary truncate">{item.title}</h1>
          </div>
          <button
            onClick={() => toggleSave(item.id)}
            className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center transition-colors"
            aria-label={isSaved ? "Unsave" : "Save"}
          >
            {isSaved
              ? <BookmarkCheck size={18} className="text-blue" />
              : <Bookmark size={18} className="text-text-muted" />
            }
          </button>
        </div>

        {/* Image */}
        {item.image_url && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-bg-section">
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2">
          {item.difficulty && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${DIFFICULTY_COLORS[item.difficulty]}`}>
              {item.difficulty}
            </span>
          )}
          {item.category && (
            <span className="text-xs text-text-secondary bg-bg-section px-2.5 py-1 rounded-lg">
              {item.category}
            </span>
          )}
          {item.duration_minutes && (
            <span className="text-xs text-text-muted flex items-center gap-1 bg-bg-section px-2.5 py-1 rounded-lg">
              <Clock size={12} /> {item.duration_minutes} min
            </span>
          )}
          {item.is_featured && (
            <span className="text-xs text-gold flex items-center gap-1 bg-gold/10 px-2.5 py-1 rounded-lg">
              <Star size={12} className="fill-gold" /> Featured
            </span>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <Card className="space-y-3">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Description</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
          </Card>
        )}

        {/* Coaching Cue */}
        {item.coaching_cue && (
          <Card className="space-y-3 border-blue/20 bg-blue/5">
            <div className="flex items-center gap-2">
              <MessageCircle size={14} className="text-blue" />
              <h2 className="text-sm font-semibold text-blue uppercase tracking-wider">Coaching Cue</h2>
            </div>
            <p className="text-sm text-text-primary leading-relaxed italic">"{item.coaching_cue}"</p>
          </Card>
        )}

        {/* Equipment */}
        {item.equipment && item.equipment.length > 0 && (
          <Card className="space-y-3">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Equipment Needed</h2>
            <div className="flex flex-wrap gap-2">
              {item.equipment.map(eq => (
                <span key={eq} className="text-xs text-text-secondary bg-bg-section px-3 py-1.5 rounded-lg capitalize">
                  {eq}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag size={12} className="text-text-muted" />
              <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Tags</h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map(tag => (
                <span key={tag} className="text-[10px] text-text-muted bg-bg-section px-2 py-1 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  )
}
