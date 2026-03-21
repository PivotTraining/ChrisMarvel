import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Target, Dumbbell, Crosshair, ShieldCheck, Zap, Send, Plus, Star, Calendar, BookOpen, Trash2 } from 'lucide-react'
import { useDrills } from '../hooks/useDrills'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import { useToast } from '../contexts/ToastContext'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'

const categoryIcons = {
  'Ball Handling': Zap,
  'Shooting': Crosshair,
  'Finishing': Target,
  'Defense': ShieldCheck,
  'Passing': Send,
  'Conditioning': Dumbbell,
  'Custom': Star,
}

const categoryColors = {
  'Ball Handling': 'text-blue',
  'Shooting': 'text-success',
  'Finishing': 'text-gold',
  'Defense': 'text-danger',
  'Passing': 'text-warning',
  'Conditioning': 'text-blue',
  'Custom': 'text-text-secondary',
}

export default function Train() {
  const navigate = useNavigate()
  const { sessions, loading, deleteDrillSession, refetch } = useDrills()
  const toast = useToast()
  const { pullProps, indicator } = usePullToRefresh(refetch)
  const [confirmId, setConfirmId] = useState(null)

  return (
    <PageShell>
      <div {...pullProps}>
      {indicator}
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Training"
          subtitle="Browse drills and log sessions."
          action={
            <Button size="sm" onClick={() => navigate('/train/new')}>
              <Plus size={16} />
              Log
            </Button>
          }
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button fullWidth onClick={() => navigate('/train/new')} size="sm">
            <Dumbbell size={16} />
            Log Drill
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate('/shots')} size="sm">
            <Crosshair size={16} />
            Shots
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate('/library')} size="sm">
            <BookOpen size={16} />
            Library
          </Button>
        </div>

        {/* Recent Sessions */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Recent Sessions
          </h2>

          {loading ? (
            <Skeleton count={3} />
          ) : sessions.length === 0 ? (
            <Card>
              <div className="flex flex-col items-center py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-bg-section border border-border flex items-center justify-center">
                  <Dumbbell size={22} className="text-text-muted" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-text-primary">No sessions yet</p>
                  <p className="text-xs text-text-muted">Log your first drill to see it here.</p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {sessions.map(session => {
                const Icon = categoryIcons[session.category] || Dumbbell
                const color = categoryColors[session.category] || 'text-text-secondary'
                const date = new Date(session.session_date + 'T12:00:00')
                const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

                return (
                  <Card key={session.id} onClick={() => navigate(`/train/${session.id}`)} className="flex items-center gap-4 cursor-pointer card-hover">
                    <div className={`w-11 h-11 rounded-xl bg-bg-section border border-border flex items-center justify-center shrink-0 ${color}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-text-primary truncate">{session.drill_name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-text-muted bg-bg-section px-2 py-0.5 rounded-full">
                          {session.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar size={10} className="text-text-muted" />
                          <span className="text-[10px] text-text-muted">{formatted}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {session.rating && (
                        <div className="flex items-center gap-0.5">
                          <Star size={12} className="text-gold fill-gold" />
                          <span className="text-xs font-bold text-text-primary">{session.rating}</span>
                        </div>
                      )}
                      {confirmId === session.id ? (
                        <div className="flex items-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setConfirmId(null) }} className="text-[10px] text-text-muted">Cancel</button>
                          <button onClick={(e) => { e.stopPropagation(); deleteDrillSession(session.id); setConfirmId(null); toast('Drill deleted', 'info') }} className="text-[10px] font-semibold text-danger">Delete</button>
                        </div>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); setConfirmId(session.id) }} className="p-1 rounded-lg hover:bg-bg-section transition-colors" aria-label="Delete">
                          <Trash2 size={13} className="text-text-muted" />
                        </button>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </section>
      </div>
      </div>
    </PageShell>
  )
}
