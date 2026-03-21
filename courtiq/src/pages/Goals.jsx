import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Target, Trash2, Check, Trophy } from 'lucide-react'
import { useGoals } from '../hooks/useGoals'
import { useToast } from '../contexts/ToastContext'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Skeleton from '../components/ui/Skeleton'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const CATEGORIES = [
  { value: 'games', label: 'Games' },
  { value: 'drills', label: 'Drills' },
  { value: 'shots', label: 'Shots' },
  { value: 'streak', label: 'Streak' },
  { value: 'custom', label: 'Custom' },
]

function GoalCard({ goal, onUpdate, onDelete }) {
  const progress = goal.target_value > 0
    ? Math.min(Math.round((goal.current_value / goal.target_value) * 100), 100)
    : 0
  const isComplete = goal.status === 'completed'

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1 min-w-0">
          <p className={`text-sm font-semibold ${isComplete ? 'text-success line-through' : 'text-text-primary'}`}>
            {goal.title}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-text-muted bg-bg-section px-2 py-0.5 rounded-full capitalize">
              {goal.category}
            </span>
            {goal.deadline && (
              <span className="text-[10px] text-text-muted">
                Due {new Date(goal.deadline + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {!isComplete && (
            <button
              onClick={() => onUpdate(goal.id, { status: 'completed', current_value: goal.target_value })}
              className="p-1.5 rounded-lg hover:bg-success/10 text-text-muted hover:text-success transition-colors"
              aria-label="Mark complete"
            >
              <Check size={14} />
            </button>
          )}
          <button
            onClick={() => onDelete(goal.id)}
            className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-colors"
            aria-label="Delete goal"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {!isComplete && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">{goal.current_value} / {goal.target_value}</span>
            <span className="text-xs font-semibold text-blue">{progress}%</span>
          </div>
          <div className="h-2 bg-bg-section rounded-full overflow-hidden">
            <div
              className="h-full bg-blue rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Increment buttons for active goals */}
      {!isComplete && (
        <div className="flex gap-2">
          {[1, 5].map(inc => (
            <button
              key={inc}
              onClick={() => {
                const newVal = Math.min(goal.current_value + inc, goal.target_value)
                const updates = { current_value: newVal }
                if (newVal >= goal.target_value) updates.status = 'completed'
                onUpdate(goal.id, updates)
              }}
              className="flex-1 py-1.5 rounded-lg bg-bg-section border border-border text-xs font-medium text-text-secondary hover:border-blue-border transition-colors"
            >
              +{inc}
            </button>
          ))}
        </div>
      )}
    </Card>
  )
}

export default function Goals() {
  const navigate = useNavigate()
  const { goals, loading, addGoal, updateGoal, deleteGoal } = useGoals()
  const toast = useToast()
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    title: '',
    target_value: '',
    category: 'custom',
    deadline: '',
  })

  function set(field) {
    return (value) => setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSubmitting(true)
    const { error } = await addGoal({
      title: form.title.trim(),
      target_value: Number(form.target_value) || 1,
      category: form.category,
      deadline: form.deadline || null,
    })
    setSubmitting(false)
    if (!error) {
      toast('Goal created!')
      setForm({ title: '', target_value: '', category: 'custom', deadline: '' })
      setShowForm(false)
    }
  }

  async function handleUpdate(id, updates) {
    const { error } = await updateGoal(id, updates)
    if (!error && updates.status === 'completed') {
      toast('Goal completed!', 'success')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    await deleteGoal(deleteId)
    setDeleteId(null)
    toast('Goal removed', 'info')
  }

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')

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
          <SectionHeader
            title="Goals"
            subtitle="Set targets and track your progress."
          />
        </div>

        {/* Add Goal Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} fullWidth>
            <Plus size={16} />
            New Goal
          </Button>
        )}

        {/* Add Goal Form */}
        {showForm && (
          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">New Goal</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                label="Goal"
                placeholder="e.g. Log 5 games this week"
                value={form.title}
                onChange={e => set('title')(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Target"
                  type="number"
                  min="1"
                  placeholder="10"
                  value={form.target_value}
                  onChange={e => set('target_value')(e.target.value)}
                />
                <Input
                  label="Deadline"
                  type="date"
                  value={form.deadline}
                  onChange={e => set('deadline')(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => set('category')(cat.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        form.category === cat.value
                          ? 'bg-blue text-white'
                          : 'bg-bg-section border border-border text-text-secondary hover:border-blue-border'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="secondary" fullWidth onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" fullWidth disabled={submitting}>
                  {submitting ? 'Creating…' : 'Create'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Active Goals */}
        {loading ? (
          <Skeleton count={2} />
        ) : activeGoals.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Active ({activeGoals.length})
            </h2>
            <div className="space-y-3">
              {activeGoals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onUpdate={handleUpdate}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          </section>
        ) : !showForm ? (
          <Card>
            <div className="flex flex-col items-center py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-bg-section border border-border flex items-center justify-center">
                <Target size={22} className="text-text-muted" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-text-primary">No active goals</p>
                <p className="text-xs text-text-muted">Set a goal to stay focused and motivated.</p>
              </div>
            </div>
          </Card>
        ) : null}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
              <Trophy size={14} className="text-gold" />
              Completed ({completedGoals.length})
            </h2>
            <div className="space-y-3">
              {completedGoals.slice(0, 5).map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onUpdate={handleUpdate}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Goal?"
        message="This goal will be permanently removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </PageShell>
  )
}
