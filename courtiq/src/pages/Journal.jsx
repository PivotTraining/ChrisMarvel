import { useNavigate } from 'react-router-dom'
import { BookOpen, Plus, Smile, Frown, Meh, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react'
import { useJournal } from '../hooks/useJournal'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import EmptyState from '../components/ui/EmptyState'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const moodConfig = {
  Great: { icon: ThumbsUp, color: 'text-success', bg: 'bg-success/10' },
  Good: { icon: Smile, color: 'text-blue', bg: 'bg-blue/10' },
  Okay: { icon: Meh, color: 'text-warning', bg: 'bg-warning/10' },
  Bad: { icon: Frown, color: 'text-danger', bg: 'bg-danger/10' },
  Terrible: { icon: ThumbsDown, color: 'text-danger', bg: 'bg-danger/10' },
}

function MentalScoreBadge({ score }) {
  if (!score) return null
  const num = Number(score)
  const color = num >= 7.5 ? 'text-success' : num >= 5 ? 'text-warning' : 'text-danger'
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-text-muted">Mental</span>
      <span className={`text-xs font-bold ${color}`}>{num.toFixed(1)}</span>
    </div>
  )
}

export default function Journal() {
  const navigate = useNavigate()
  const { entries, loading } = useJournal()

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Journal"
          subtitle="Track your mindset and recovery."
          action={
            <Button size="sm" onClick={() => navigate('/journal/new')}>
              <Plus size={16} />
              New
            </Button>
          }
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No journal entries"
            description="Check in daily to track your mood, sleep, and mental game."
            action={
              <Button size="sm" onClick={() => navigate('/journal/new')}>
                <Plus size={16} />
                Write First Entry
              </Button>
            }
          />
        ) : (
          <section className="space-y-3">
            {entries.map(entry => {
              const mood = moodConfig[entry.mood] || moodConfig.Okay
              const MoodIcon = mood.icon
              const date = new Date(entry.entry_date + 'T12:00:00')
              const formatted = date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })

              return (
                <Card key={entry.id} onClick={() => navigate(`/journal/${entry.id}`)} className="space-y-3 cursor-pointer card-hover">
                  {/* Top row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${mood.bg} flex items-center justify-center`}>
                        <MoodIcon size={18} className={mood.color} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{entry.mood}</p>
                        <div className="flex items-center gap-1">
                          <Calendar size={10} className="text-text-muted" />
                          <span className="text-[10px] text-text-muted">{formatted}</span>
                        </div>
                      </div>
                    </div>
                    <MentalScoreBadge score={entry.mental_game_score} />
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 text-xs">
                    {entry.energy_level && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-text-muted">Energy</span>
                        <span className="font-semibold text-text-primary">{entry.energy_level}/10</span>
                      </div>
                    )}
                    {entry.sleep_hours && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-text-muted">Sleep</span>
                        <span className="font-semibold text-text-primary">{entry.sleep_hours}h</span>
                      </div>
                    )}
                    {entry.confidence && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-text-muted">Confidence</span>
                        <span className="font-semibold text-text-primary">{entry.confidence}/10</span>
                      </div>
                    )}
                  </div>

                  {/* Highlights */}
                  {entry.highlights && (
                    <p className="text-xs text-text-secondary line-clamp-2">{entry.highlights}</p>
                  )}
                </Card>
              )
            })}
          </section>
        )}
      </div>
    </PageShell>
  )
}
