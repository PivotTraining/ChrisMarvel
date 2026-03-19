import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Dumbbell, Clock, Calendar, Trash2, X } from 'lucide-react';
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
import { getTrainingSessions, createTrainingSession, deleteTrainingSession } from '../../lib/api';
import { formatDate } from '../../lib/dateUtils';

const TRAINING_TYPES = [
  { value: 'full_practice', label: 'Full Practice' },
  { value: 'scrimmage', label: 'Scrimmage' },
  { value: 'individual_workout', label: 'Individual Workout' },
  { value: 'team_practice', label: 'Team Practice' },
  { value: 'open_gym', label: 'Open Gym' },
  { value: 'camp_clinic', label: 'Camp/Clinic' },
];

const TYPE_LABEL_MAP = TRAINING_TYPES.reduce((acc, t) => {
  acc[t.value] = t.label;
  return acc;
}, {});

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  ...TRAINING_TYPES,
];

function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}

export default function Train() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [formDate, setFormDate] = useState(getTodayISO());
  const [formType, setFormType] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formFocusAreas, setFormFocusAreas] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const fetchSessions = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await getTrainingSessions(user.id, { limit: 100, offset: 0 });
      setSessions(data || []);
    } catch {
      showToast('Failed to load training sessions', 'error');
    } finally {
      setLoading(false);
    }
  }, [user?.id, showToast]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const filteredSessions = useMemo(() => {
    if (filter === 'all') return sessions;
    return sessions.filter((s) => s.type === filter);
  }, [sessions, filter]);

  const stats = useMemo(() => {
    if (!sessions.length) return { total: 0, hours: 0, topType: '-' };
    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    const typeCounts = {};
    sessions.forEach((s) => {
      typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
    });
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return {
      total: sessions.length,
      hours: (totalMinutes / 60).toFixed(1),
      topType: TYPE_LABEL_MAP[topType] || '-',
    };
  }, [sessions]);

  function resetForm() {
    setFormDate(getTodayISO());
    setFormType('');
    setFormDuration('');
    setFormFocusAreas('');
    setFormNotes('');
    setFormErrors({});
  }

  function validateForm() {
    const errors = {};
    if (!formDate) errors.date = 'Date is required';
    if (!formType) errors.type = 'Select a training type';
    if (!formDuration || Number(formDuration) <= 0) errors.duration = 'Enter a valid duration';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      const newSession = await createTrainingSession({
        user_id: user.id,
        date: formDate,
        type: formType,
        duration_minutes: parseInt(formDuration, 10),
        focus_areas: formFocusAreas,
        notes: formNotes,
      });
      setSessions((prev) => [newSession, ...prev]);
      showToast('Session logged successfully', 'success');
      resetForm();
      setShowForm(false);
    } catch {
      showToast('Failed to log session', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      setDeleting(true);
      await deleteTrainingSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      showToast('Session deleted', 'success');
    } catch {
      showToast('Failed to delete session', 'error');
    } finally {
      setDeleting(false);
      setDeleteConfirmId(null);
    }
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary tracking-tight">
            Train
          </h1>
          <p className="text-text-secondary font-body mt-1">
            Track your training sessions and monitor progress.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setShowForm((prev) => !prev);
            if (showForm) resetForm();
          }}
          className="flex items-center gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Log Session'}
        </Button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <Card className="mb-6" padding="lg">
          <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
            Log Training Session
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Date"
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                error={formErrors.date}
              />
              <Select
                label="Training Type"
                options={TRAINING_TYPES}
                placeholder="Select type..."
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                error={formErrors.type}
              />
              <Input
                label="Duration (minutes)"
                type="number"
                min="1"
                placeholder="e.g. 90"
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
                error={formErrors.duration}
              />
            </div>
            <Input
              label="Focus Areas"
              placeholder="e.g. Ball handling, Shooting, Defense"
              value={formFocusAreas}
              onChange={(e) => setFormFocusAreas(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1 font-body">
                Notes (optional)
              </label>
              <textarea
                className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-text-primary font-body text-sm placeholder:text-text-muted focus:outline-none focus:border-border-active focus:ring-1 focus:ring-accent-primary resize-y min-h-[80px]"
                placeholder="How did the session go?"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" loading={submitting} disabled={submitting}>
                Save Session
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Stats */}
      {!loading && sessions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card padding="md" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/15 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-text-muted text-xs font-body uppercase tracking-wide">
                Total Sessions
              </p>
              <p className="text-text-primary font-display text-2xl font-bold">{stats.total}</p>
            </div>
          </Card>
          <Card padding="md" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/15 flex items-center justify-center">
              <Clock className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-text-muted text-xs font-body uppercase tracking-wide">
                Total Hours
              </p>
              <p className="text-text-primary font-display text-2xl font-bold">{stats.hours}</p>
            </div>
          </Card>
          <Card padding="md" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/15 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-text-muted text-xs font-body uppercase tracking-wide">
                Most Common
              </p>
              <p className="text-text-primary font-display text-lg font-bold">{stats.topType}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Filter */}
      {!loading && sessions.length > 0 && (
        <div className="mb-4">
          <FilterChips options={FILTER_OPTIONS} selected={filter} onChange={setFilter} />
        </div>
      )}

      {/* Loading */}
      {loading && <SkeletonLoader variant="card" count={4} />}

      {/* Empty state */}
      {!loading && sessions.length === 0 && (
        <EmptyState
          icon={Dumbbell}
          title="No training sessions yet"
          description="Start logging your workouts to track your basketball development."
          actionLabel="Log Your First Session"
          onAction={() => setShowForm(true)}
        />
      )}

      {/* No filter results */}
      {!loading && filteredSessions.length === 0 && sessions.length > 0 && (
        <EmptyState
          icon={Dumbbell}
          title="No sessions match this filter"
          description="Try selecting a different training type."
        />
      )}

      {/* Sessions list */}
      {!loading && filteredSessions.length > 0 && (
        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <Card
              key={session.id}
              padding="md"
              className="group hover:bg-bg-surface-hover transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display text-lg font-semibold text-text-primary">
                      {TYPE_LABEL_MAP[session.type] || session.type}
                    </h3>
                    <span className="text-xs font-body text-text-muted bg-bg-surface-elevated px-2 py-0.5 rounded-full">
                      {session.duration_minutes} min
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm font-body">
                    {formatDate(session.date)}
                  </p>
                  {session.focus_areas && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {session.focus_areas.split(',').map((area, i) => (
                        <span
                          key={i}
                          className="text-xs font-body text-accent-secondary bg-accent-primary/10 px-2 py-0.5 rounded-full"
                        >
                          {area.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  {session.notes && (
                    <p className="text-text-muted text-sm font-body mt-2 line-clamp-2">
                      {session.notes}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {deleteConfirmId === session.id ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setDeleteConfirmId(null)}
                        disabled={deleting}
                        className="text-sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleDelete(session.id)}
                        loading={deleting}
                        disabled={deleting}
                        className="!bg-danger text-sm"
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(session.id)}
                      className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/15 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label="Delete session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
