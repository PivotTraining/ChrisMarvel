import { useState, useEffect, useMemo, useCallback } from 'react';
import { Target, Plus, Square, TrendingUp, Percent, Trophy, ChevronLeft, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getShotSessions, createShotSession, deleteShotSession, createShot } from '../../lib/api';
import { formatDate } from '../../lib/dateUtils';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import FilterChips from '../../components/ui/FilterChips';
import SkeletonLoader from '../../components/ui/SkeletonLoader';

const SHOT_TYPES = [
  { value: 'layup', label: 'Layup' },
  { value: 'mid_range', label: 'Mid-Range' },
  { value: 'three_pointer', label: 'Three-Pointer' },
  { value: 'free_throw', label: 'Free Throw' },
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  ...SHOT_TYPES,
];

function calcPercentage(made, total) {
  if (total === 0) return 0;
  return Math.round((made / total) * 100);
}

function getSessionStats(session) {
  const shots = session.shots || [];
  const total = shots.length;
  const made = shots.filter((s) => s.made).length;
  return { total, made, pct: calcPercentage(made, total) };
}

export default function Shots() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Active session state
  const [activeSession, setActiveSession] = useState(null);
  const [activeShots, setActiveShots] = useState([]);
  const [pendingShotType, setPendingShotType] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch sessions
  const fetchSessions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getShotSessions(user.id, { limit: 50, offset: 0 });
      setSessions(data || []);
    } catch {
      showToast('Failed to load sessions', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Summary stats across all sessions
  const summaryStats = useMemo(() => {
    const allShots = sessions.flatMap((s) => s.shots || []);
    const total = allShots.length;
    const made = allShots.filter((s) => s.made).length;
    const pct = calcPercentage(made, total);

    let bestType = null;
    let bestPct = -1;
    for (const type of SHOT_TYPES) {
      const typeShots = allShots.filter((s) => s.shot_type === type.value);
      if (typeShots.length >= 1) {
        const typeMade = typeShots.filter((s) => s.made).length;
        const typePct = calcPercentage(typeMade, typeShots.length);
        if (typePct > bestPct) {
          bestPct = typePct;
          bestType = type.label;
        }
      }
    }

    return { total, made, pct, bestType, bestPct };
  }, [sessions]);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    if (filter === 'all') return sessions;
    return sessions.filter((session) => {
      const shots = session.shots || [];
      return shots.some((s) => s.shot_type === filter);
    });
  }, [sessions, filter]);

  // Start new session
  const handleStartSession = async () => {
    try {
      const session = await createShotSession({
        user_id: user.id,
        date: new Date().toISOString(),
        location: null,
        notes: null,
      });
      setActiveSession(session);
      setActiveShots([]);
      setPendingShotType(null);
      showToast('Session started', 'success');
    } catch {
      showToast('Failed to start session', 'error');
    }
  };

  // Record a shot type tap
  const handleShotTypeTap = (type) => {
    setPendingShotType(type);
  };

  // Record make/miss
  const handleResult = async (made) => {
    if (!pendingShotType || !activeSession) return;
    try {
      const shot = await createShot({
        session_id: activeSession.id,
        user_id: user.id,
        shot_type: pendingShotType,
        zone: null,
        made,
      });
      setActiveShots((prev) => [...prev, shot]);
      setPendingShotType(null);
    } catch {
      showToast('Failed to record shot', 'error');
    }
  };

  // End session
  const handleEndSession = async () => {
    setSaving(true);
    try {
      setActiveSession(null);
      setActiveShots([]);
      setPendingShotType(null);
      await fetchSessions();
      showToast('Session saved', 'success');
    } catch {
      showToast('Failed to save session', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete session
  const handleDeleteSession = async (id) => {
    try {
      await deleteShotSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      showToast('Session deleted', 'success');
    } catch {
      showToast('Failed to delete session', 'error');
    }
  };

  // Active session running stats
  const activeStats = useMemo(() => {
    const total = activeShots.length;
    const made = activeShots.filter((s) => s.made).length;
    return { total, made, pct: calcPercentage(made, total) };
  }, [activeShots]);

  // --- Active Session View ---
  if (activeSession) {
    return (
      <PageWrapper>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleEndSession}
              className="p-2 rounded-lg bg-bg-surface hover:bg-bg-surface-hover transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-text-secondary" />
            </button>
            <h1 className="font-display text-2xl font-bold text-text-primary uppercase tracking-wide">
              Active Session
            </h1>
          </div>

          {/* Running Tally */}
          <div className="grid grid-cols-3 gap-3">
            <Card glass padding="md" className="text-center">
              <p className="text-text-muted text-xs font-body uppercase tracking-wider mb-1">Shots</p>
              <p className="font-display text-3xl font-bold text-text-primary">{activeStats.total}</p>
            </Card>
            <Card glass padding="md" className="text-center">
              <p className="text-text-muted text-xs font-body uppercase tracking-wider mb-1">Makes</p>
              <p className="font-display text-3xl font-bold text-success">{activeStats.made}</p>
            </Card>
            <Card glass padding="md" className="text-center">
              <p className="text-text-muted text-xs font-body uppercase tracking-wider mb-1">Pct</p>
              <p className="font-display text-3xl font-bold text-accent-primary">{activeStats.pct}%</p>
            </Card>
          </div>

          {/* Shot Type Buttons */}
          <div className="space-y-3">
            <p className="text-text-secondary font-body text-sm">Tap a shot type:</p>
            <div className="grid grid-cols-2 gap-3">
              {SHOT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleShotTypeTap(type.value)}
                  className={`p-4 rounded-xl font-display text-lg font-semibold uppercase tracking-wide transition-all ${
                    pendingShotType === type.value
                      ? 'bg-accent-primary text-white ring-2 ring-accent-primary ring-offset-2 ring-offset-bg-primary scale-95'
                      : 'bg-bg-surface hover:bg-bg-surface-hover text-text-primary'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Make / Miss Buttons */}
          {pendingShotType && (
            <div className="space-y-3">
              <p className="text-text-secondary font-body text-sm text-center">
                {SHOT_TYPES.find((t) => t.value === pendingShotType)?.label} — Made or Missed?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleResult(true)}
                  className="p-5 rounded-xl bg-success/15 hover:bg-success/25 border border-success/30 transition-all active:scale-95"
                >
                  <span className="font-display text-xl font-bold text-success uppercase">Made</span>
                </button>
                <button
                  onClick={() => handleResult(false)}
                  className="p-5 rounded-xl bg-danger/15 hover:bg-danger/25 border border-danger/30 transition-all active:scale-95"
                >
                  <span className="font-display text-xl font-bold text-danger uppercase">Missed</span>
                </button>
              </div>
            </div>
          )}

          {/* Recent shots feed */}
          {activeShots.length > 0 && (
            <Card glass padding="md" className="space-y-2">
              <p className="text-text-muted text-xs font-body uppercase tracking-wider mb-2">Recent Shots</p>
              <div className="flex flex-wrap gap-2">
                {activeShots
                  .slice(-20)
                  .reverse()
                  .map((shot, i) => (
                    <span
                      key={shot.id || i}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-body font-medium ${
                        shot.made ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                      }`}
                    >
                      {SHOT_TYPES.find((t) => t.value === shot.shot_type)?.label}
                      <span>{shot.made ? '\u2713' : '\u2717'}</span>
                    </span>
                  ))}
              </div>
            </Card>
          )}

          {/* End Session */}
          <Button variant="primary" fullWidth loading={saving} onClick={handleEndSession}>
            <Square className="w-4 h-4 mr-2" />
            End Session
          </Button>
        </div>
      </PageWrapper>
    );
  }

  // --- Session List View ---
  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-text-primary uppercase tracking-wide">
            Shot Tracker
          </h1>
          <Button variant="primary" onClick={handleStartSession}>
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </div>

        {loading ? (
          <SkeletonLoader variant="card" count={3} />
        ) : sessions.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No Shot Sessions Yet"
            description="Start a new session to begin tracking your shots and improving your game."
            actionLabel="Start First Session"
            onAction={handleStartSession}
          />
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card glass padding="md" className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4 text-accent-secondary" />
                </div>
                <p className="text-text-muted text-xs font-body uppercase tracking-wider mb-1">Total Shots</p>
                <p className="font-display text-2xl font-bold text-text-primary">{summaryStats.total}</p>
              </Card>
              <Card glass padding="md" className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Percent className="w-4 h-4 text-accent-secondary" />
                </div>
                <p className="text-text-muted text-xs font-body uppercase tracking-wider mb-1">Overall %</p>
                <p className="font-display text-2xl font-bold text-accent-primary">{summaryStats.pct}%</p>
              </Card>
              <Card glass padding="md" className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-4 h-4 text-accent-secondary" />
                </div>
                <p className="text-text-muted text-xs font-body uppercase tracking-wider mb-1">Best Type</p>
                <p className="font-display text-sm font-bold text-text-primary leading-tight">
                  {summaryStats.bestType || '\u2014'}
                </p>
                {summaryStats.bestType && (
                  <p className="text-xs text-success font-body">{summaryStats.bestPct}%</p>
                )}
              </Card>
            </div>

            {/* Filters */}
            <FilterChips options={FILTER_OPTIONS} selected={filter} onChange={setFilter} />

            {/* Session List */}
            <div className="space-y-3">
              {filteredSessions.length === 0 ? (
                <p className="text-text-muted text-center py-8 font-body">
                  No sessions match this filter.
                </p>
              ) : (
                filteredSessions.map((session) => {
                  const stats = getSessionStats(session);
                  return (
                    <Card key={session.id} glass padding="md" className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-display text-lg font-semibold text-text-primary">
                            {formatDate(session.date)}
                          </p>
                          {session.location && (
                            <p className="text-text-muted text-sm font-body">{session.location}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="p-2 rounded-lg hover:bg-bg-surface-hover transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-text-muted hover:text-danger" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-text-muted text-xs font-body uppercase tracking-wider">Shots</p>
                          <p className="font-display text-xl font-bold text-text-primary">{stats.total}</p>
                        </div>
                        <div>
                          <p className="text-text-muted text-xs font-body uppercase tracking-wider">Makes</p>
                          <p className="font-display text-xl font-bold text-success">{stats.made}</p>
                        </div>
                        <div>
                          <p className="text-text-muted text-xs font-body uppercase tracking-wider">Pct</p>
                          <p className="font-display text-xl font-bold text-accent-primary">{stats.pct}%</p>
                        </div>
                      </div>

                      {/* Shot type breakdown */}
                      <div className="flex flex-wrap gap-2">
                        {SHOT_TYPES.map((type) => {
                          const typeShots = (session.shots || []).filter(
                            (s) => s.shot_type === type.value
                          );
                          if (typeShots.length === 0) return null;
                          const typeMade = typeShots.filter((s) => s.made).length;
                          return (
                            <span
                              key={type.value}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-bg-surface-hover text-xs font-body text-text-secondary"
                            >
                              {type.label}: {typeMade}/{typeShots.length}
                            </span>
                          );
                        })}
                      </div>

                      {session.notes && (
                        <p className="text-text-muted text-sm font-body italic">{session.notes}</p>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
