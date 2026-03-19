import { useState, useEffect, useMemo, useCallback } from 'react';
import { Activity, Plus, Trash2, Clock, Dumbbell, X, Calendar } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import FilterChips from '../../components/ui/FilterChips';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import StarRating from '../../components/ui/StarRating';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getDrillSessions, createDrillSession, deleteDrillSession } from '../../lib/api';
import { formatDate } from '../../lib/dateUtils';

const CATEGORIES = [
  { value: 'Ball Handling', label: 'Ball Handling' },
  { value: 'Shooting', label: 'Shooting' },
  { value: 'Finishing', label: 'Finishing' },
  { value: 'Defense', label: 'Defense' },
  { value: 'Passing', label: 'Passing' },
  { value: 'Conditioning', label: 'Conditioning' },
  { value: 'Custom', label: 'Custom' },
];

const INTENSITY_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  ...CATEGORIES,
];

const CATEGORY_COLORS = {
  'Ball Handling': 'text-accent-primary bg-accent-primary/15',
  'Shooting': 'text-success bg-success/15',
  'Finishing': 'text-danger bg-danger/15',
  'Defense': 'text-accent-secondary bg-accent-primary/15',
  'Passing': 'text-text-primary bg-bg-surface-elevated',
  'Conditioning': 'text-danger bg-danger/15',
  'Custom': 'text-text-secondary bg-bg-surface-elevated',
};

const INTENSITY_COLORS = {
  High: 'text-danger bg-danger/15',
  Medium: 'text-accent-secondary bg-accent-primary/15',
  Low: 'text-success bg-success/15',
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const INITIAL_FORM = {
  session_date: todayISO(),
  category: '',
  drill_name: '',
  sets: '',
  reps: '',
  duration_minutes: '',
  intensity: '',
  rating: 0,
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
      const data = await getDrillSessions(user.id, { limit: 200, offset: 0 });
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
    () => (filter === 'all' ? drills : drills.filter(d => d.category === filter)),
    [drills, filter],
  );

  const stats = useMemo(() => {
    const totalDrills = drills.length;
    const totalMinutes = drills.reduce((sum, d) => sum + (d.duration_minutes || 0), 0);
    const categoryCounts = {};
    drills.forEach(d => {
      categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
    });
    const mostPracticed =
      Object.keys(categoryCounts).length > 0
        ? Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0]
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
    if (!form.session_date) errors.session_date = 'Date is required';
    if (!form.category) errors.category = 'Select a category';
    if (!form.drill_name.trim()) errors.drill_name = 'Enter a drill name';
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
        session_date: form.session_date,
        category: form.category,
        drill_name: form.drill_name.trim(),
        sets: form.sets ? parseInt(form.sets, 10) : null,
        reps: form.reps ? parseInt(form.reps, 10) : null,
        duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes, 10) : null,
        intensity: form.intensity || null,
        rating: form.rating || null,
        notes: form.notes.trim() || null,
        is_custom_drill: form.category === 'Custom',
      };
      const created = await createDrillSession(drill);
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
      await deleteDrillSession(deleteId);
      setDrills(prev => prev.filter(d => d.id !== deleteId));
      showToast('Drill deleted', 'success');
    } catch {
      showToast('Failed to delete drill', 'error');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
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
              if (showForm) {
                setForm(INITIAL_FORM);
                setFormErrors({});
              }
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
                {stats.mostPracticed || '—'}
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
                  value={form.session_date}
                  onChange={e => updateField('session_date', e.target.value)}
                  error={formErrors.session_date}
                />
                <Select
                  label="Category"
                  options={CATEGORIES}
                  placeholder="Select category"
                  value={form.category}
                  onChange={e => updateField('category', e.target.value)}
                  error={formErrors.category}
                />
              </div>

              <Input
                label="Drill Name"
                placeholder="e.g. Crossover combos, Free throws"
                value={form.drill_name}
                onChange={e => updateField('drill_name', e.target.value)}
                error={formErrors.drill_name}
              />

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Sets (optional)"
                  type="number"
                  min="1"
                  value={form.sets}
                  onChange={e => updateField('sets', e.target.value)}
                />
                <Input
                  label="Reps (optional)"
                  type="number"
                  min="1"
                  value={form.reps}
                  onChange={e => updateField('reps', e.target.value)}
                />
                <Input
                  label="Duration (min)"
                  type="number"
                  min="1"
                  value={form.duration_minutes}
                  onChange={e => updateField('duration_minutes', e.target.value)}
                />
              </div>

              <Select
                label="Intensity (optional)"
                options={INTENSITY_OPTIONS}
                placeholder="Select intensity"
                value={form.intensity}
                onChange={e => updateField('intensity', e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Rating (optional)</label>
                <StarRating
                  value={form.rating}
                  onChange={star => updateField('rating', star)}
                  size={28}
                />
              </div>

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
              description="Try selecting a different category."
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
                        {drill.drill_name}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[drill.category] || 'text-text-secondary bg-bg-surface-elevated'}`}
                      >
                        {drill.category}
                      </span>
                      {drill.intensity && (
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${INTENSITY_COLORS[drill.intensity] || ''}`}
                        >
                          {drill.intensity}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-text-secondary flex-wrap">
                      {drill.duration_minutes != null && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {drill.duration_minutes} min
                        </span>
                      )}
                      {(drill.sets != null || drill.reps != null) && (
                        <span className="flex items-center gap-1">
                          <Dumbbell className="w-3.5 h-3.5" />
                          {drill.sets != null && `${drill.sets} sets`}
                          {drill.sets != null && drill.reps != null && ' x '}
                          {drill.reps != null && `${drill.reps} reps`}
                        </span>
                      )}
                      {drill.rating != null && drill.rating > 0 && (
                        <StarRating value={drill.rating} onChange={() => {}} size={14} />
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(drill.session_date)}
                      </span>
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
