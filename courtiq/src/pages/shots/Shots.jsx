import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Target,
  Plus,
  Square,
  TrendingUp,
  Percent,
  Trophy,
  ChevronLeft,
  Trash2,
  Crosshair,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getShotLogs, createShotLogsBatch, deleteShotLog } from '../../lib/api';
import { DEMO_SHOT_LOGS } from '../../lib/demoData';
import { formatDate } from '../../lib/dateUtils';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import FilterChips from '../../components/ui/FilterChips';
import SkeletonLoader from '../../components/ui/SkeletonLoader';

// ── Constants ──────────────────────────────────────────

const ZONES = [
  { id: 'left_corner_3', label: 'L Corner 3', row: 0, col: 0 },
  { id: 'paint', label: 'Paint', row: 0, col: 1 },
  { id: 'right_corner_3', label: 'R Corner 3', row: 0, col: 2 },
  { id: 'left_wing_3', label: 'L Wing 3', row: 1, col: 0 },
  { id: 'free_throw', label: 'Free Throw', row: 1, col: 1 },
  { id: 'right_wing_3', label: 'R Wing 3', row: 1, col: 2 },
  { id: 'mid_left', label: 'Mid Left', row: 2, col: 0 },
  { id: 'top_key_3', label: 'Top Key 3', row: 2, col: 1 },
  { id: 'mid_right', label: 'Mid Right', row: 2, col: 2 },
  { id: 'left_elbow', label: 'L Elbow', row: 3, col: 0 },
  { id: 'right_elbow', label: 'R Elbow', row: 3, col: 2 },
];

const ZONE_MAP = Object.fromEntries(ZONES.map((z) => [z.id, z.label]));

const SHOT_TYPES = [
  { value: 'Catch & Shoot', label: 'Catch & Shoot' },
  { value: 'Off Dribble', label: 'Off Dribble' },
  { value: 'Post Up', label: 'Post Up' },
  { value: 'Free Throw', label: 'Free Throw' },
  { value: 'Floater', label: 'Floater' },
  { value: 'Hook Shot', label: 'Hook Shot' },
];

const CONTEXT_OPTIONS = [
  { value: 'Practice', label: 'Practice' },
  { value: 'Game', label: 'Game' },
  { value: 'Warmup', label: 'Warmup' },
];

const FILTER_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  ...SHOT_TYPES,
];

const FILTER_ZONE_OPTIONS = [
  { value: 'all', label: 'All Zones' },
  ...ZONES.map((z) => ({ value: z.id, label: z.label })),
];

// ── Helpers ────────────────────────────────────────────

function pct(made, total) {
  if (total === 0) return 0;
  return Math.round((made / total) * 100);
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function groupByDate(shots) {
  const groups = {};
  for (const shot of shots) {
    const key = shot.session_date;
    if (!groups[key]) groups[key] = [];
    groups[key].push(shot);
  }
  return Object.entries(groups).sort(([a], [b]) => (a > b ? -1 : 1));
}

// ── Component ──────────────────────────────────────────

export default function Shots() {
  const { user, demoMode } = useAuth();
  const { showToast } = useToast();

  // Log view state
  const [shots, setShots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterZone, setFilterZone] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Mode toggle
  const [mode, setMode] = useState('log'); // 'log' | 'track'

  // Quick Track state
  const [trackZone, setTrackZone] = useState(null);
  const [trackShotType, setTrackShotType] = useState('Catch & Shoot');
  const [trackContext, setTrackContext] = useState('Practice');
  const [trackShots, setTrackShots] = useState([]);
  const [saving, setSaving] = useState(false);

  // ── Fetch shots ──────────────────────────────────────

  const fetchShots = useCallback(async () => {
    if (!user) return;
    if (demoMode) { setShots(DEMO_SHOT_LOGS); setLoading(false); return; }
    setLoading(true);
    try {
      const data = await getShotLogs(user.id, { limit: 200, offset: 0 });
      setShots(data || []);
    } catch {
      showToast('Failed to load shot logs', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, demoMode, showToast]);

  useEffect(() => {
    fetchShots();
  }, [fetchShots]);

  // ── Summary stats ────────────────────────────────────

  const summaryStats = useMemo(() => {
    const total = shots.length;
    const made = shots.filter((s) => s.made).length;
    const overall = pct(made, total);

    // Best zone
    let bestZone = null;
    let bestZonePct = -1;
    const zoneIds = [...new Set(shots.map((s) => s.zone_id))];
    for (const zid of zoneIds) {
      const zShots = shots.filter((s) => s.zone_id === zid);
      if (zShots.length >= 3) {
        const zMade = zShots.filter((s) => s.made).length;
        const zPct = pct(zMade, zShots.length);
        if (zPct > bestZonePct) {
          bestZonePct = zPct;
          bestZone = ZONE_MAP[zid] || zid;
        }
      }
    }

    return { total, made, overall, bestZone, bestZonePct };
  }, [shots]);

  // ── Filtered & grouped shots ─────────────────────────

  const filteredGrouped = useMemo(() => {
    let filtered = shots;
    if (filterType !== 'all') {
      filtered = filtered.filter((s) => s.shot_type === filterType);
    }
    if (filterZone !== 'all') {
      filtered = filtered.filter((s) => s.zone_id === filterZone);
    }
    return groupByDate(filtered);
  }, [shots, filterType, filterZone]);

  // ── Delete shot ──────────────────────────────────────

  const handleDelete = async (id) => {
    if (demoMode) { showToast('Demo mode — changes not saved', 'info'); setDeleteConfirm(null); return; }
    try {
      await deleteShotLog(id);
      setShots((prev) => prev.filter((s) => s.id !== id));
      showToast('Shot deleted', 'success');
    } catch {
      showToast('Failed to delete shot', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  // ── Quick Track handlers ─────────────────────────────

  const handleTrackResult = (made) => {
    if (!trackZone) {
      showToast('Select a zone first', 'error');
      return;
    }
    setTrackShots((prev) => [
      ...prev,
      {
        zone_id: trackZone,
        shot_type: trackShotType,
        made,
        context: trackContext,
        session_date: todayISO(),
        _id: Date.now(),
      },
    ]);
  };

  const handleEndSession = async () => {
    if (trackShots.length === 0) {
      showToast('No shots to save', 'error');
      return;
    }
    if (demoMode) { showToast('Demo mode — changes not saved', 'info'); return; }
    setSaving(true);
    try {
      const payload = trackShots.map(({ _id, ...rest }) => ({
        ...rest,
        user_id: user.id,
      }));
      await createShotLogsBatch(payload);
      showToast(`Saved ${trackShots.length} shots`, 'success');
      setTrackShots([]);
      setTrackZone(null);
      setMode('log');
      await fetchShots();
    } catch {
      showToast('Failed to save session', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardSession = () => {
    setTrackShots([]);
    setTrackZone(null);
    setMode('log');
    showToast('Session discarded', 'success');
  };

  // Quick Track running stats
  const trackStats = useMemo(() => {
    const total = trackShots.length;
    const made = trackShots.filter((s) => s.made).length;
    return { total, made, pct: pct(made, total) };
  }, [trackShots]);

  // ── Quick Track Mode ─────────────────────────────────

  if (mode === 'track') {
    return (
      <PageWrapper>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (trackShots.length > 0) {
                  // Don't navigate away — confirm first
                  return;
                }
                setMode('log');
              }}
              className="p-2 rounded-lg bg-bg-surface hover:bg-bg-surface-hover transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-text-secondary" />
            </button>
            <h1 className="font-display text-2xl font-bold text-text-primary uppercase tracking-wide">
              Quick Track
            </h1>
          </div>

          {/* Running Tally */}
          <div className="grid grid-cols-3 gap-3">
            <Card glass padding="md" className="text-center">
              <p className="text-text-muted text-xs font-body uppercase tracking-wider mb-1">Shots</p>
              <p className="font-display text-3xl font-bold text-text-primary">{trackStats.total}</p>
            </Card>
            <Card glass padding="md" className="text-center">
              <p className="text-text-muted text-xs font-body uppercase tracking-wider mb-1">Makes</p>
              <p className="font-display text-3xl font-bold text-success">{trackStats.made}</p>
            </Card>
            <Card glass padding="md" className="text-center">
              <p className="text-text-muted text-xs font-body uppercase tracking-wider mb-1">Pct</p>
              <p className="font-display text-3xl font-bold text-accent-primary">{trackStats.pct}%</p>
            </Card>
          </div>

          {/* Context & Shot Type selectors */}
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Shot Type"
              value={trackShotType}
              onChange={(e) => setTrackShotType(e.target.value)}
              options={SHOT_TYPES}
            />
            <Select
              label="Context"
              value={trackContext}
              onChange={(e) => setTrackContext(e.target.value)}
              options={CONTEXT_OPTIONS}
            />
          </div>

          {/* Court Zone Selector */}
          <div className="space-y-2">
            <p className="text-text-secondary font-body text-sm">Select zone:</p>
            <div className="grid grid-cols-3 gap-2">
              {ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setTrackZone(zone.id)}
                  className={`p-3 rounded-xl text-xs font-display font-semibold uppercase tracking-wide transition-all ${
                    trackZone === zone.id
                      ? 'bg-accent-primary text-white ring-2 ring-accent-primary ring-offset-2 ring-offset-bg-primary scale-95'
                      : 'bg-bg-surface hover:bg-bg-surface-hover text-text-primary border border-border-subtle'
                  }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Made / Missed Buttons */}
          <div className="space-y-2">
            <p className="text-text-secondary font-body text-sm text-center">
              {trackZone
                ? `${ZONE_MAP[trackZone]} \u2014 ${trackShotType}`
                : 'Pick a zone, then tap Made or Missed'}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleTrackResult(true)}
                disabled={!trackZone}
                className="p-5 rounded-xl bg-success/15 hover:bg-success/25 border border-success/30 transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100"
              >
                <span className="font-display text-xl font-bold text-success uppercase">Made</span>
              </button>
              <button
                onClick={() => handleTrackResult(false)}
                disabled={!trackZone}
                className="p-5 rounded-xl bg-danger/15 hover:bg-danger/25 border border-danger/30 transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100"
              >
                <span className="font-display text-xl font-bold text-danger uppercase">Missed</span>
              </button>
            </div>
          </div>

          {/* Recent shots feed */}
          {trackShots.length > 0 && (
            <Card glass padding="md" className="space-y-2">
              <p className="text-text-muted text-xs font-body uppercase tracking-wider mb-2">
                Session Shots
              </p>
              <div className="flex flex-wrap gap-2">
                {trackShots
                  .slice(-24)
                  .reverse()
                  .map((shot) => (
                    <span
                      key={shot._id}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-body font-medium ${
                        shot.made ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                      }`}
                    >
                      {ZONE_MAP[shot.zone_id] || shot.zone_id}
                      <span>{shot.made ? '\u2713' : '\u2717'}</span>
                    </span>
                  ))}
              </div>
            </Card>
          )}

          {/* End / Discard Session */}
          <div className="space-y-2">
            <Button variant="primary" fullWidth loading={saving} onClick={handleEndSession}>
              <Square className="w-4 h-4 mr-2" />
              End Session ({trackShots.length} shots)
            </Button>
            {trackShots.length > 0 && (
              <Button variant="ghost" fullWidth onClick={handleDiscardSession}>
                Discard Session
              </Button>
            )}
          </div>
        </div>
      </PageWrapper>
    );
  }

  // ── Shot Log View ────────────────────────────────────

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-text-primary uppercase tracking-wide">
            Shot Tracker
          </h1>
          <Button variant="primary" onClick={() => setMode('track')}>
            <Crosshair className="w-4 h-4 mr-2" />
            Quick Track
          </Button>
        </div>

        {loading ? (
          <SkeletonLoader variant="card" count={3} />
        ) : shots.length === 0 ? (
          <EmptyState
            icon={<Target className="w-12 h-12" />}
            title="No Shots Logged Yet"
            description="Start a quick track session to log shots and track your shooting from every zone."
            actionLabel="Start Tracking"
            onAction={() => setMode('track')}
          />
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card glass padding="md" className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4 text-accent-secondary" />
                </div>
                <p className="text-text-muted text-xs font-body uppercase tracking-wider mb-1">
                  Total Shots
                </p>
                <p className="font-display text-2xl font-bold text-text-primary">
                  {summaryStats.total}
                </p>
              </Card>
              <Card glass padding="md" className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Percent className="w-4 h-4 text-accent-secondary" />
                </div>
                <p className="text-text-muted text-xs font-body uppercase tracking-wider mb-1">
                  Overall %
                </p>
                <p className="font-display text-2xl font-bold text-accent-primary">
                  {summaryStats.overall}%
                </p>
              </Card>
              <Card glass padding="md" className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-4 h-4 text-accent-secondary" />
                </div>
                <p className="text-text-muted text-xs font-body uppercase tracking-wider mb-1">
                  Best Zone
                </p>
                <p className="font-display text-sm font-bold text-text-primary leading-tight">
                  {summaryStats.bestZone || '\u2014'}
                </p>
                {summaryStats.bestZone && (
                  <p className="text-xs text-success font-body">{summaryStats.bestZonePct}%</p>
                )}
              </Card>
            </div>

            {/* Filters */}
            <div className="space-y-2">
              <FilterChips
                options={FILTER_TYPE_OPTIONS}
                selected={filterType}
                onChange={setFilterType}
              />
              <FilterChips
                options={FILTER_ZONE_OPTIONS}
                selected={filterZone}
                onChange={setFilterZone}
              />
            </div>

            {/* Zone Breakdown */}
            <Card glass padding="md" className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-accent-secondary" />
                <p className="text-text-muted text-xs font-body uppercase tracking-wider">
                  Zone Breakdown
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ZONES.map((zone) => {
                  const zShots = shots.filter((s) => s.zone_id === zone.id);
                  if (zShots.length === 0) return null;
                  const zMade = zShots.filter((s) => s.made).length;
                  return (
                    <div
                      key={zone.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-bg-surface"
                    >
                      <span className="text-xs font-body text-text-secondary">{zone.label}</span>
                      <span className="text-xs font-display font-bold text-text-primary">
                        {zMade}/{zShots.length}{' '}
                        <span className="text-accent-primary">({pct(zMade, zShots.length)}%)</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Grouped Shot Logs */}
            <div className="space-y-4">
              {filteredGrouped.length === 0 ? (
                <p className="text-text-muted text-center py-8 font-body">
                  No shots match these filters.
                </p>
              ) : (
                filteredGrouped.map(([date, dateShots]) => {
                  const dateMade = dateShots.filter((s) => s.made).length;
                  return (
                    <div key={date} className="space-y-2">
                      {/* Date header */}
                      <div className="flex items-center justify-between">
                        <p className="font-display text-base font-semibold text-text-primary">
                          {formatDate(date)}
                        </p>
                        <span className="text-xs font-body text-text-muted">
                          {dateMade}/{dateShots.length} ({pct(dateMade, dateShots.length)}%)
                        </span>
                      </div>

                      {/* Individual shots */}
                      <div className="space-y-2">
                        {dateShots.map((shot) => (
                          <Card key={shot.id} glass padding="sm" className="flex items-center gap-3">
                            {/* Made/missed indicator */}
                            <div
                              className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                shot.made ? 'bg-success' : 'bg-danger'
                              }`}
                            />

                            {/* Shot info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-display font-semibold text-text-primary truncate">
                                {ZONE_MAP[shot.zone_id] || shot.zone_id}
                              </p>
                              <p className="text-xs font-body text-text-muted truncate">
                                {shot.shot_type}
                                {shot.context && shot.context !== 'Practice'
                                  ? ` \u00B7 ${shot.context}`
                                  : ''}
                                {shot.notes ? ` \u00B7 ${shot.notes}` : ''}
                              </p>
                            </div>

                            {/* Made / Missed label */}
                            <span
                              className={`text-xs font-body font-medium px-2 py-0.5 rounded-full ${
                                shot.made
                                  ? 'bg-success/15 text-success'
                                  : 'bg-danger/15 text-danger'
                              }`}
                            >
                              {shot.made ? 'Made' : 'Missed'}
                            </span>

                            {/* Delete */}
                            {deleteConfirm === shot.id ? (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={() => handleDelete(shot.id)}
                                  className="text-xs px-2 py-1 rounded-lg bg-danger/15 text-danger hover:bg-danger/25 transition-colors"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="text-xs px-2 py-1 rounded-lg bg-bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(shot.id)}
                                className="p-1.5 rounded-lg hover:bg-bg-surface-hover transition-colors flex-shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-text-muted hover:text-danger" />
                              </button>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
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
