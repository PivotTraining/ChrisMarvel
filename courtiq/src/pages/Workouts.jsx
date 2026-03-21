import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layers, Plus, Clock, Trash2, Play, X, Dumbbell, ChevronDown } from 'lucide-react'
import { useWorkouts } from '../hooks/useWorkouts'
import { useDrills } from '../hooks/useDrills'
import { useToast } from '../contexts/ToastContext'
import { DRILL_CATEGORIES } from '../lib/constants'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'

export default function Workouts() {
  const navigate = useNavigate()
  const { templates, loading, addTemplate, deleteTemplate } = useWorkouts()
  const { addDrillSession } = useDrills()
  const toast = useToast()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Custom')
  const [estimatedMinutes, setEstimatedMinutes] = useState('')
  const [drills, setDrills] = useState([{ name: '', duration: '' }])
  const [saving, setSaving] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [runningId, setRunningId] = useState(null)

  function addDrillRow() {
    setDrills(prev => [...prev, { name: '', duration: '' }])
  }

  function updateDrill(index, field, value) {
    setDrills(prev => prev.map((d, i) => i === index ? { ...d, [field]: value } : d))
  }

  function removeDrill(index) {
    setDrills(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSave(e) {
    e.preventDefault()
    const validDrills = drills.filter(d => d.name.trim())
    if (!name.trim() || validDrills.length === 0) return

    setSaving(true)
    const { error } = await addTemplate({
      name: name.trim(),
      description: description.trim() || null,
      category,
      estimated_minutes: estimatedMinutes ? parseInt(estimatedMinutes, 10) : null,
      drills: validDrills.map(d => ({
        name: d.name.trim(),
        duration: d.duration.trim() || null,
      })),
    })
    setSaving(false)

    if (!error) {
      toast('Template saved!')
      setShowForm(false)
      setName('')
      setDescription('')
      setCategory('Custom')
      setEstimatedMinutes('')
      setDrills([{ name: '', duration: '' }])
    } else {
      toast('Failed to save template', 'error')
    }
  }

  async function handleRun(template) {
    setRunningId(template.id)
    const today = new Date().toISOString().split('T')[0]
    const templateDrills = template.drills || []

    for (const drill of templateDrills) {
      await addDrillSession({
        session_date: today,
        drill_name: drill.name,
        category: template.category || 'Custom',
        intensity: 'Medium',
        notes: `From template: ${template.name}`,
      })
    }

    setRunningId(null)
    toast(`${templateDrills.length} drill${templateDrills.length !== 1 ? 's' : ''} logged!`)
  }

  async function handleDelete(id) {
    await deleteTemplate(id)
    setConfirmId(null)
    toast('Template deleted', 'info')
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Workouts"
          subtitle="Save and reuse drill templates."
          action={
            <Button size="sm" onClick={() => setShowForm(!showForm)}>
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? 'Cancel' : 'New'}
            </Button>
          }
        />

        {/* Create Template Form */}
        {showForm && (
          <Card className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">New Template</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Template name"
                className="w-full rounded-lg bg-bg-section border border-border px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
                required
              />
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full rounded-lg bg-bg-section border border-border px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full rounded-lg bg-bg-section border border-border px-3 py-2.5 text-sm text-text-primary appearance-none focus:outline-none focus:border-blue-border transition-colors"
                  >
                    {DRILL_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
                <input
                  type="number"
                  value={estimatedMinutes}
                  onChange={e => setEstimatedMinutes(e.target.value)}
                  placeholder="Est. minutes"
                  min="1"
                  className="rounded-lg bg-bg-section border border-border px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
                />
              </div>

              {/* Drill List */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-text-muted uppercase">Drills</p>
                {drills.map((drill, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={drill.name}
                      onChange={e => updateDrill(i, 'name', e.target.value)}
                      placeholder={`Drill ${i + 1}`}
                      className="flex-1 rounded-lg bg-bg-section border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
                    />
                    <input
                      type="text"
                      value={drill.duration}
                      onChange={e => updateDrill(i, 'duration', e.target.value)}
                      placeholder="Duration"
                      className="w-24 rounded-lg bg-bg-section border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
                    />
                    {drills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDrill(i)}
                        className="p-2 rounded-lg hover:bg-bg-section text-text-muted transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDrillRow}
                  className="text-xs text-blue font-medium hover:text-blue-dark transition-colors"
                >
                  + Add drill
                </button>
              </div>

              <Button type="submit" fullWidth disabled={saving || !name.trim() || !drills.some(d => d.name.trim())}>
                {saving ? 'Saving...' : 'Save Template'}
              </Button>
            </form>
          </Card>
        )}

        {/* Templates List */}
        {loading ? (
          <Skeleton count={3} />
        ) : templates.length === 0 && !showForm ? (
          <Card>
            <div className="flex flex-col items-center py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-bg-section border border-border flex items-center justify-center">
                <Layers size={22} className="text-text-muted" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-text-primary">No templates yet</p>
                <p className="text-xs text-text-muted">Create a workout template to reuse your favorite drill combos.</p>
              </div>
              <Button size="sm" onClick={() => setShowForm(true)}>
                <Plus size={14} />
                Create Template
              </Button>
            </div>
          </Card>
        ) : (
          <section className="space-y-3">
            {templates.map(template => {
              const drillList = template.drills || []
              return (
                <Card key={template.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-primary truncate">{template.name}</p>
                      {template.description && (
                        <p className="text-xs text-text-muted truncate">{template.description}</p>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-medium text-blue bg-blue/10 px-2 py-0.5 rounded">
                          {template.category}
                        </span>
                        <span className="text-[10px] text-text-muted flex items-center gap-1">
                          <Dumbbell size={10} />
                          {drillList.length} drill{drillList.length !== 1 ? 's' : ''}
                        </span>
                        {template.estimated_minutes && (
                          <span className="text-[10px] text-text-muted flex items-center gap-1">
                            <Clock size={10} />
                            {template.estimated_minutes}m
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Drill names */}
                  <div className="flex flex-wrap gap-1.5">
                    {drillList.map((d, i) => (
                      <span key={i} className="text-[10px] text-text-secondary bg-bg-section px-2 py-1 rounded">
                        {d.name}{d.duration ? ` · ${d.duration}` : ''}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1 border-t border-border">
                    <Button
                      size="sm"
                      onClick={() => handleRun(template)}
                      disabled={runningId === template.id}
                      className="flex-1"
                    >
                      <Play size={14} />
                      {runningId === template.id ? 'Logging...' : 'Log All'}
                    </Button>
                    {confirmId === template.id ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setConfirmId(null)} className="text-[10px] text-text-muted">Cancel</button>
                        <button onClick={() => handleDelete(template.id)} className="text-[10px] font-semibold text-danger">Delete</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(template.id)}
                        className="p-1.5 rounded-lg hover:bg-bg-section transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 size={13} className="text-text-muted" />
                      </button>
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
