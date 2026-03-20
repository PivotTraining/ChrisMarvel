import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dumbbell, Heart, Apple, Star, Clock, Bookmark, BookmarkCheck,
  ChevronRight, Sparkles, Filter,
} from 'lucide-react'
import { useTrainingContent } from '../hooks/useTrainingContent'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'

const TYPE_TABS = [
  { value: null, label: 'All' },
  { value: 'drill', label: 'Drills', icon: Dumbbell },
  { value: 'recovery', label: 'Recovery', icon: Heart },
  { value: 'nutrition', label: 'Nutrition', icon: Apple },
]

const DIFFICULTY_COLORS = {
  Beginner: 'text-success bg-success/10',
  Intermediate: 'text-warning bg-warning/10',
  Advanced: 'text-danger bg-danger/10',
}

export default function Library() {
  const navigate = useNavigate()
  const [activeType, setActiveType] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const { content, featured, categories, savedIds, loading, toggleSave } = useTrainingContent(activeType)

  const filtered = activeCategory
    ? content.filter(c => c.category === activeCategory)
    : content

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Library"
          subtitle="Drills, recovery, and nutrition guides."
        />

        {/* Type Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {TYPE_TABS.map(({ value, label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => { setActiveType(value); setActiveCategory(null) }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeType === value
                  ? 'bg-blue text-white'
                  : 'bg-bg-card border border-border text-text-secondary hover:border-blue-border'
              }`}
            >
              {Icon && <Icon size={14} />}
              {label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                !activeCategory
                  ? 'bg-blue/10 text-blue border border-blue/20'
                  : 'bg-bg-section border border-border text-text-muted'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                  activeCategory === cat
                    ? 'bg-blue/10 text-blue border border-blue/20'
                    : 'bg-bg-section border border-border text-text-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Featured */}
        {!activeCategory && featured.length > 0 && activeType === null && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-gold" />
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Featured</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {featured.slice(0, 4).map(item => (
                <Card
                  key={item.id}
                  onClick={() => navigate(`/library/${item.id}`)}
                  className="min-w-[200px] max-w-[220px] shrink-0 cursor-pointer space-y-3"
                >
                  {item.image_url && (
                    <div className="w-full h-24 rounded-xl overflow-hidden bg-bg-section">
                      <img src={item.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-text-primary line-clamp-1">{item.title}</p>
                    <div className="flex items-center gap-2">
                      {item.difficulty && (
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${DIFFICULTY_COLORS[item.difficulty]}`}>
                          {item.difficulty}
                        </span>
                      )}
                      {item.duration_minutes && (
                        <span className="text-[10px] text-text-muted flex items-center gap-0.5">
                          <Clock size={9} /> {item.duration_minutes}m
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Content List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center py-8 text-center space-y-3">
              <Filter size={22} className="text-text-muted" />
              <p className="text-sm text-text-muted">No content found for this filter.</p>
            </div>
          </Card>
        ) : (
          <section className="space-y-3">
            {filtered.map(item => {
              const isSaved = savedIds.has(item.id)
              const TypeIcon = item.content_type === 'drill' ? Dumbbell
                : item.content_type === 'recovery' ? Heart
                : Apple

              return (
                <Card key={item.id} className="space-y-3">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-bg-section border border-border flex items-center justify-center shrink-0">
                      <TypeIcon size={18} className="text-text-muted" />
                    </div>

                    {/* Content */}
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

                    {/* Bookmark */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSave(item.id) }}
                      className="p-1.5 rounded-lg hover:bg-bg-section transition-colors shrink-0"
                    >
                      {isSaved
                        ? <BookmarkCheck size={16} className="text-blue" />
                        : <Bookmark size={16} className="text-text-muted" />
                      }
                    </button>
                  </div>

                  {/* Meta */}
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
