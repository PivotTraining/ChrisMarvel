import { useState, useEffect, useMemo, useCallback } from 'react';
import { Activity, Plus, Trash2, Clock, Dumbbell, X } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import FilterChips from '../../components/ui/FilterChips';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getDrills, createDrill, deleteDrill } from '../../lib/api';
import { formatDate } from '../../lib/dateUtils';

const DRILL_TYPES = [
  { value: 'ball_handling', label: 'Ball Handling' },
  { value: 'shooting', label: 'Shooting' },
  { value: 'footwork', label: 'Footwork' },
  { value: 'defense', label: 'Defense' },
  { value: 'conditioning', label: 'Conditioning' },
  { value: 'passing', label: 'Passing' },
];

const INTENSITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  ...DRILL_TYPES,
];

const DRILL_TYPE_LABELS = Object.fromEntries(DRILL_TYPES.map(t => [t.value, t.label]));
const INTENSITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' };

const today = () => new Date().toISOString().split('T')[0];

const INITIAL_FORM = {
  date: today(),
  drill_type: '',
  duration_minutes: '',
  reps: '',
  sets: '',
  intensity: '',
  notes: '',
};

export default function Drills() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [drills, setDrills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDrills = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getDrills(user.id, { limit: 200, offset: 0 });
      setDrills(data || []);
    } catch {
      showToast('Failed to load drills', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    fetchDrills();
  }, [fetchDrills]);

  const filteredDrills = useMemo(
    () => (filter === 'all' ? drills : drills.filter(d => d.drill_type === filter)),
    [drills, filter],
  );

  const stats = useMemo(() => {
    const totalDrills = drills.length;
    const totalMinutes = drills.reduce((sum, d) => sum + (d.duration_minutes || 0), 0);
    const typeCounts = {};
    drills.forEach(d => {
      typeCounts[d.drill_type] = (typeCounts[d.drill_type] || 0) + 1;
    });
    const mostPracticed =
      Object.keys(typeCounts).length > 0
        ? Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0]
        : null;
    return { totalDrills, totalMinutes, mostPracticed };
  }, [drills]);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.date) errors.date = 'Date is required';
    if (!form.drill_type) errors.drill_type = 'Select a drill type';
    if (!form.duration_minutes || Number(form.duration_minutes) <= 0)
      errors.duration_minutes = 'Enter a valid duration';
    if (!form.intensity) errors.intensity = 'Select intensity';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      const drill = {
        user_id: user.id,
        date: form.date,
        drill_type: form.drill_type,
        duration_minutes: parseInt(form.duration_minutes, 10),
        reps: form.reps ? parseInt(form.reps, 10) : null,
        sets: form.sets ? parseInt(form.sets, 10) : null,
        intensity: form.intensity,
        notes: form.notes || null,
      };
      const created = await createDrill(drill);
      setDrills(prev => [created, ...prev]);
      setForm(INITIAL_FORM);
      setFormErrors({});
      setShowForm(false);
      showToast('Drill logged successfully', 'success');
    } catch {
      showToast('Failed to log drill', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteDrill(deleteId);
      setDrills(prev => prev.filter(d => d.id !== deleteId));
      showToast('Drill deleted', 'success');
    } catch {
      showToast('Failed to delete drill', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const intensityColor = intensity => {
    if (intensity === 'high') return 'text-danger bg-danger/15';
    if (intensity === 'medium') return 'text-accent-secondary bg-accent-primary/15';
    return 'text-success bg-success/15';
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">Drills</h1>
            <p className="text-text-secondary text-sm mt-1">Track and review your training drills</p>
          </div>
          <Button
            variant={showForm ? 'ghost' : 'primary'}
            onClick={() => {
              setShowForm(prev => !prev);
              setFormErrors({});
            }}
            className="flex items-center gap-2"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'Log Drill'}
          </Button>
        </div>

        {/* Summary Stats */}
        {!loading && drills.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <Card padding="sm" className="text-center">
              <p className="text-text-muted text-xs uppercase tracking-wide font-body">Total Drills</p>
              <p className="font-display text-2xl font-bold text-text-primary mt-1">{stats.totalDrills}</p>
            </Card>
            <Card padding="sm" className="text-center">
              <p className="text-text-muted text-xs uppercase tracking-wide font-body">Total Minutes</p>
              <p className="font-display text-2xl font-bold text-text-primary mt-1">{stats.totalMinutes}</p>
            </Card>
            <Card padding="sm" className="text-center">
              <p className="text-text-muted text-xs uppercase tracking-wide font-body">Most Practiced</p>
              <p className="font-display text-lg font-bold text-accent-primary mt-1">
                {stats.mostPracticed ? DRILL_TYPE_LABELS[stats.mostPracticed] : '—'}
              </p>
            </Card>
          </div>
        )}

        {/* Inline Form */}
        {showForm && (
          <Card padding="lg" className="border border-border-active">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-display text-lg font-semibold text-text-primary">Log a Drill</h2>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                  value={form.date}
                  onChange={e => updateField('date', e.target.value)}
                  error={formErrors.date}
                />
                <Select
                  label="Drill Type"
                  options={DRILL_TYPES}
                  placeholder="Select type"
                  value={form.drill_type}
                  onChange={e => updateField('drill_type', e.target.value)}
                  error={formErrors.drill_type}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Duration (min)"
                  type="number"
                  min="1"
                  value={form.duration_minutes}
                  onChange={e => updateField('duration_minutes', e.target.value)}
                  error={formErrors.duration_minutes}
                />
                <Input
                  label="Reps (optional)"
                  type="number"
                  min="0"
                  value={form.reps}
                  onChange={e => updateField('reps', e.target.value)}
                />
                <Input
                  label="Sets (optional)"
                  type="number"
                  min="0"
                  value={form.sets}
                  onChange={e => updateField('sets', e.target.value)}
                />
              </div>

              <Select
                label="Intensity"
                options={INTENSITY_OPTIONS}
                placeholder="Select intensity"
                value={form.intensity}
                onChange={e => updateField('intensity', e.target.value)}
                error={formErrors.intensity}
              />

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Notes (optional)</label>
                <textarea
                  className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-border-active resize-none"
                  rows={3}
                  placeholder="Any notes about this drill..."
                  value={form.notes}
                  onChange={e => updateField('notes', e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm(INITIAL_FORM);
                    setFormErrors({});
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" loading={submitting} disabled={submitting}>
                  Save Drill
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Filters */}
        {!loading && drills.length > 0 && (
          <FilterChips options={FILTER_OPTIONS} selected={filter} onChange={setFilter} />
        )}

        {/* Drills List */}
        {loading ? (
          <SkeletonLoader variant="card" count={4} />
        ) : filteredDrills.length === 0 ? (
          drills.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No drills logged yet"
              description="Start tracking your training by logging your first drill."
              actionLabel="Log Drill"
              onAction={() => setShowForm(true)}
            />
          ) : (
            <EmptyState
              icon={Activity}
              title="No drills match this filter"
              description="Try selecting a different drill type."
            />
          )
        ) : (
          <div className="space-y-3">
            {filteredDrills.map(drill => (
              <Card
                key={drill.id}
                padding="md"
                className="hover:bg-bg-surface-hover transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-display font-semibold text-text-primary">
                        {DRILL_TYPE_LABELS[drill.drill_type] || drill.drill_type}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${intensityColor(drill.intensity)}`}
                      >
                        {INTENSITY_LABELS[drill.intensity] || drill.intensity}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {drill.duration_minutes} min
                      </span>
                      {drill.reps != null && (
                        <span className="flex items-center gap-1">
                          <Dumbbell className="w-3.5 h-3.5" />
                          {drill.reps} reps
                          {drill.sets != null && ` x ${drill.sets} sets`}
                        </span>
                      )}
                      <span>{formatDate(drill.date)}</span>
                    </div>

                    {drill.notes && (
                      <p className="text-sm text-text-muted truncate">{drill.notes}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeleteId(drill.id)}
                    className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger/15 transition-colors ml-3 shrink-0"
                    aria-label="Delete drill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card padding="lg" className="max-w-sm w-full mx-4 bg-bg-surface-elevated">
              <h3 className="font-display text-lg font-semibold text-text-primary">Delete Drill</h3>
              <p className="text-text-secondary text-sm mt-2">
                Are you sure you want to delete this drill? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="!bg-danger hover:!bg-danger/80"
                  onClick={handleDelete}
                  loading={deleting}
                  disabled={deleting}
                >
                  Delete
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
