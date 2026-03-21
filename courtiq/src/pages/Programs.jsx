import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Dumbbell, Calendar, CheckCircle2, Clock, Play, Pause, Trash2, ChevronRight, Sparkles, Zap } from 'lucide-react'
import { usePrograms } from '../hooks/usePrograms'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'
import { getTemplates } from '../lib/programTemplates'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const DIFFICULTY_COLORS = {
  Beginner: 'text-success bg-success/10 border-success/20',
  Intermediate: 'text-blue bg-blue/10 border-blue-border',
  Advanced: 'text-warning bg-warning/10 border-warning/20',
  Elite: 'text-danger bg-danger/10 border-danger/20',
}

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'text-success', icon: Play },
  paused: { label: 'Paused', color: 'text-warning', icon: Pause },
  completed: { label: 'Completed', color: 'text-blue', icon: CheckCircle2 },
  archived: { label: 'Archived', color: 'text-text-muted', icon: Clock },
}

export default function Programs() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { programs, loading, createProgram, updateProgram, deleteProgram } = usePrograms()
  const toast = useToast()
  const templates = getTemplates()

  const [mode, setMode] = useState(null) // null | 'templates' | 'custom'
  const [customName, setCustomName] = useState('')
  const [customWeeks, setCustomWeeks] = useState(4)
  const [customDays, setCustomDays] = useState(5)
  const [customDiff, setCustomDiff] = useState('Intermediate')
  const [creating, setCreating] = useState(false)

  async function handleTemplateSelect(template) {
    setCreating(true)
    const { data, error } = await createProgram({
      name: template.name,
      description: template.description,
      difficulty: template.difficulty,
      duration_weeks: template.duration_weeks,
      focus_areas: template.focus_areas,
      status: 'active',
    })
    setCreating(false)
    if (error) {
      toast(error.message || 'Failed to create program')
    } else {
      toast('Program created!')
      setMode(null)
      navigate(`/programs/${data.id}?template=${template.id}`)
    }
  }

  async function handleCustomCreate(e) {
    e.preventDefault()
    if (!customName.trim()) return
    setCreating(true)
    const { data, error } = await createProgram({
      name: customName.trim(),
      difficulty: customDiff,
      duration_weeks: customWeeks,
      focus_areas: [],
      status: 'active',
    })
    setCreating(false)
    if (error) {
      toast(error.message || 'Failed to create')
    } else {
      toast('Program created!')
      setMode(null)
      navigate(`/programs/${data.id}?custom=${customDays}`)
    }
  }

  async function handleDelete(id) {
    const { error } = await deleteProgram(id)
    if (!error) toast('Program deleted')
  }

  async function toggleStatus(id, current) {
    const next = current === 'active' ? 'paused' : 'active'
    await updateProgram(id, { status: next })
  }

  const activePrograms = programs.filter(p => p.status === 'active' || p.status === 'paused')
  const pastPrograms = programs.filter(p => p.status === 'completed' || p.status === 'archived')

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors" aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <SectionHeader
            title="Training Programs"
            subtitle="Structured multi-week training plans."
          />
        </div>

        {/* Action buttons */}
        {!mode && (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" fullWidth onClick={() => setMode('templates')}>
              <Sparkles size={16} />
              Templates
            </Button>
            <Button variant="secondary" fullWidth onClick={() => setMode('custom')}>
              <Plus size={16} />
              Custom
            </Button>
          </div>
        )}

        {/* Template picker */}
        {mode === 'templates' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Choose a Template</h2>
              <button onClick={() => setMode(null)} className="text-xs text-text-muted hover:text-text-primary">Cancel</button>
            </div>
            {templates.map(t => (
              <Card key={t.id} onClick={() => !creating && handleTemplateSelect(t)} className="space-y-2 cursor-pointer card-hover">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.description}</p>
                  </div>
                  <ChevronRight size={16} className="text-text-muted shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[t.difficulty]}`}>
                    {t.difficulty}
                  </span>
                  <span className="text-[10px] text-text-muted flex items-center gap-1">
                    <Calendar size={10} /> {t.duration_weeks} weeks
                  </span>
                  {t.focus_areas.map(f => (
                    <span key={f} className="text-[10px] text-text-muted bg-bg-section px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
              </Card>
            ))}
          </section>
        )}

        {/* Custom program form */}
        {mode === 'custom' && (
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-primary">Custom Program</h2>
              <button onClick={() => setMode(null)} className="text-xs text-text-muted hover:text-text-primary">Cancel</button>
            </div>
            <form onSubmit={handleCustomCreate} className="space-y-3">
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder="Program name"
                maxLength={50}
                className="w-full rounded-xl bg-bg-section border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <p className="text-xs text-text-muted">Weeks</p>
                  <div className="flex gap-1.5">
                    {[2, 4, 6, 8].map(w => (
                      <button key={w} type="button" onClick={() => setCustomWeeks(w)} className={`flex-1 py-2 rounded-lg text-xs font-medium ${customWeeks === w ? 'bg-blue text-white' : 'bg-bg-section border border-border text-text-secondary'}`}>
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-text-muted">Days/Week</p>
                  <div className="flex gap-1.5">
                    {[3, 4, 5, 6].map(d => (
                      <button key={d} type="button" onClick={() => setCustomDays(d)} className={`flex-1 py-2 rounded-lg text-xs font-medium ${customDays === d ? 'bg-blue text-white' : 'bg-bg-section border border-border text-text-secondary'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-text-muted">Difficulty</p>
                <div className="flex gap-1.5">
                  {['Beginner', 'Intermediate', 'Advanced', 'Elite'].map(d => (
                    <button key={d} type="button" onClick={() => setCustomDiff(d)} className={`flex-1 py-2 rounded-lg text-[10px] font-medium ${customDiff === d ? 'bg-blue text-white' : 'bg-bg-section border border-border text-text-secondary'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" fullWidth disabled={creating || !customName.trim()}>
                {creating ? 'Creating...' : 'Create Program'}
              </Button>
            </form>
          </Card>
        )}

        {/* Active Programs */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : programs.length === 0 && !mode ? (
          <Card>
            <div className="flex flex-col items-center py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue/10 border border-blue-border flex items-center justify-center">
                <Dumbbell size={24} className="text-blue" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-text-primary">No programs yet</p>
                <p className="text-xs text-text-muted">Pick a template or create a custom training plan.</p>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {activePrograms.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Active</h2>
                {activePrograms.map(program => {
                  const config = STATUS_CONFIG[program.status]
                  const StatusIcon = config.icon
                  return (
                    <Card key={program.id} className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-text-primary truncate">{program.name}</p>
                            <StatusIcon size={12} className={config.color} />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[program.difficulty]}`}>
                              {program.difficulty}
                            </span>
                            <span className="text-[10px] text-text-muted">{program.duration_weeks} weeks</span>
                          </div>
                        </div>
                        <button onClick={() => navigate(`/programs/${program.id}`)} className="p-2 rounded-lg text-text-muted hover:text-text-primary">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" className="flex-1" onClick={() => navigate(`/programs/${program.id}`)}>
                          <Dumbbell size={14} />
                          Open
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toggleStatus(program.id, program.status)}>
                          {program.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(program.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </section>
            )}

            {pastPrograms.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Past Programs</h2>
                {pastPrograms.map(program => (
                  <Card key={program.id} onClick={() => navigate(`/programs/${program.id}`)} className="flex items-center gap-3 cursor-pointer card-hover">
                    <div className="w-8 h-8 rounded-lg bg-bg-section border border-border flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} className="text-text-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{program.name}</p>
                      <p className="text-[10px] text-text-muted">{program.duration_weeks} weeks · {program.difficulty}</p>
                    </div>
                    <ChevronRight size={16} className="text-text-muted" />
                  </Card>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </PageShell>
  )
}
