import { useState, useEffect, useCallback } from 'react';
import {
  Trophy, Plus, Trash2, Calendar, MapPin, StickyNote, X,
  ChevronDown, ChevronUp, Target, Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getGames, createGame, deleteGame } from '../../lib/api';
import { formatDate } from '../../lib/dateUtils';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Slider from '../../components/ui/Slider';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import FilterChips from '../../components/ui/FilterChips';
import SkeletonLoader from '../../components/ui/SkeletonLoader';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Win', label: 'Wins' },
  { value: 'Loss', label: 'Losses' },
  { value: 'Draw', label: 'Draws' },
];

const GAME_TYPE_OPTIONS = [
  { value: 'League', label: 'League' },
  { value: 'Tournament', label: 'Tournament' },
  { value: 'Pickup', label: 'Pickup' },
  { value: 'Practice', label: 'Practice' },
  { value: 'Scrimmage', label: 'Scrimmage' },
];

const RESULT_OPTIONS = [
  { value: 'Win', label: 'Win' },
  { value: 'Loss', label: 'Loss' },
  { value: 'Draw', label: 'Draw' },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const INITIAL_FORM = {
  game_date: todayISO(),
  opponent: '',
  location: '',
  game_type: 'League',
  result: 'Win',
  minutes_played: '',
  points: '',
  rebounds: '',
  assists: '',
  steals: '',
  blocks: '',
  turnovers: '',
  fouls: '',
  fg_made: '',
  fg_attempted: '',
  three_made: '',
  three_attempted: '',
  ft_made: '',
  ft_attempted: '',
  energy_level: 5,
  performance_rating: 5,
  notes: '',
};

function resultBadgeStyle(result) {
  switch (result) {
    case 'Win':
      return 'bg-success/15 text-success';
    case 'Loss':
      return 'bg-danger/15 text-danger';
    case 'Draw':
      return 'bg-white/10 text-text-secondary';
    default:
      return 'bg-white/10 text-text-secondary';
  }
}

function resultLabel(result) {
  switch (result) {
    case 'Win': return 'W';
    case 'Loss': return 'L';
    case 'Draw': return 'D';
    default: return '?';
  }
}

function FormSection({ title, icon: Icon, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border-subtle rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-bg-surface-hover/50 hover:bg-bg-surface-hover transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-text-primary uppercase tracking-wide font-display">
          {Icon && <Icon className="w-4 h-4 text-accent-primary" />}
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        )}
      </button>
      {open && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

export default function Games() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchGames = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getGames(user.id, { limit: 100, offset: 0 });
      setGames(data || []);
    } catch {
      showToast('Failed to load games', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Filtering
  const filteredGames =
    filter === 'all' ? games : games.filter((g) => g.result === filter);

  // Summary stats
  const totalGames = games.length;
  const wins = games.filter((g) => g.result === 'Win').length;
  const losses = games.filter((g) => g.result === 'Loss').length;
  const avgPoints =
    totalGames > 0
      ? Math.round(games.reduce((sum, g) => sum + (g.points || 0), 0) / totalGames)
      : 0;

  // ── Form helpers ────────────────────────────────────────
  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  }

  function handleSliderChange(name) {
    return (e) => {
      setFormData((prev) => ({ ...prev, [name]: Number(e.target.value) }));
    };
  }

  function validateForm() {
    const errors = {};
    if (!formData.game_date) errors.game_date = 'Date is required';
    if (!formData.result) errors.result = 'Result is required';
    return errors;
  }

  function resetForm() {
    setShowForm(false);
    setFormData(INITIAL_FORM);
    setFormErrors({});
  }

  function intOrNull(val) {
    const n = parseInt(val, 10);
    return isNaN(n) ? null : n;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        user_id: user.id,
        game_date: formData.game_date,
        opponent: formData.opponent.trim() || null,
        location: formData.location.trim() || null,
        game_type: formData.game_type,
        result: formData.result,
        minutes_played: intOrNull(formData.minutes_played),
        points: intOrNull(formData.points) ?? 0,
        rebounds: intOrNull(formData.rebounds) ?? 0,
        assists: intOrNull(formData.assists) ?? 0,
        steals: intOrNull(formData.steals) ?? 0,
        blocks: intOrNull(formData.blocks) ?? 0,
        turnovers: intOrNull(formData.turnovers) ?? 0,
        fouls: intOrNull(formData.fouls) ?? 0,
        fg_made: intOrNull(formData.fg_made),
        fg_attempted: intOrNull(formData.fg_attempted),
        three_made: intOrNull(formData.three_made),
        three_attempted: intOrNull(formData.three_attempted),
        ft_made: intOrNull(formData.ft_made),
        ft_attempted: intOrNull(formData.ft_attempted),
        energy_level: formData.energy_level,
        performance_rating: formData.performance_rating,
        notes: formData.notes.trim() || null,
      };

      const newGame = await createGame(payload);
      setGames((prev) => [newGame, ...prev]);
      resetForm();
      showToast('Game logged successfully', 'success');
    } catch {
      showToast('Failed to log game', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteGame(id);
      setGames((prev) => prev.filter((g) => g.id !== id));
      setDeleteConfirmId(null);
      showToast('Game deleted', 'success');
    } catch {
      showToast('Failed to delete game', 'error');
    }
  }

  // ── Render ──────────────────────────────────────────────
  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary uppercase tracking-wide">
            Games
          </h1>
          <p className="text-text-secondary font-body mt-1">
            Track your game results and performance
          </p>
        </div>
        {!showForm && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Log Game
          </Button>
        )}
      </div>

      {/* ── Inline Form ── */}
      {showForm && (
        <Card className="mb-6" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-text-primary uppercase tracking-wide">
              Log a Game
            </h2>
            <button
              onClick={resetForm}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ── Basic Info ── */}
            <FormSection title="Basic Info" icon={Calendar} defaultOpen>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                  name="game_date"
                  value={formData.game_date}
                  onChange={handleFormChange}
                  error={formErrors.game_date}
                />
                <Input
                  label="Opponent"
                  name="opponent"
                  placeholder="e.g. East Side Eagles"
                  value={formData.opponent}
                  onChange={handleFormChange}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Game Type"
                  name="game_type"
                  value={formData.game_type}
                  onChange={handleFormChange}
                  options={GAME_TYPE_OPTIONS}
                />
                <Select
                  label="Result"
                  name="result"
                  value={formData.result}
                  onChange={handleFormChange}
                  options={RESULT_OPTIONS}
                  error={formErrors.result}
                />
                <Input
                  label="Minutes Played"
                  type="number"
                  name="minutes_played"
                  min="0"
                  max="60"
                  placeholder="0"
                  value={formData.minutes_played}
                  onChange={handleFormChange}
                />
              </div>
              <Input
                label="Location"
                name="location"
                placeholder="e.g. Central Park Courts"
                value={formData.location}
                onChange={handleFormChange}
              />
            </FormSection>

            {/* ── Box Score ── */}
            <FormSection title="Box Score" icon={Trophy} defaultOpen={false}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Input
                  label="Points"
                  type="number"
                  name="points"
                  min="0"
                  placeholder="0"
                  value={formData.points}
                  onChange={handleFormChange}
                />
                <Input
                  label="Rebounds"
                  type="number"
                  name="rebounds"
                  min="0"
                  placeholder="0"
                  value={formData.rebounds}
                  onChange={handleFormChange}
                />
                <Input
                  label="Assists"
                  type="number"
                  name="assists"
                  min="0"
                  placeholder="0"
                  value={formData.assists}
                  onChange={handleFormChange}
                />
                <Input
                  label="Steals"
                  type="number"
                  name="steals"
                  min="0"
                  placeholder="0"
                  value={formData.steals}
                  onChange={handleFormChange}
                />
                <Input
                  label="Blocks"
                  type="number"
                  name="blocks"
                  min="0"
                  placeholder="0"
                  value={formData.blocks}
                  onChange={handleFormChange}
                />
                <Input
                  label="Turnovers"
                  type="number"
                  name="turnovers"
                  min="0"
                  placeholder="0"
                  value={formData.turnovers}
                  onChange={handleFormChange}
                />
                <Input
                  label="Fouls"
                  type="number"
                  name="fouls"
                  min="0"
                  placeholder="0"
                  value={formData.fouls}
                  onChange={handleFormChange}
                />
              </div>
            </FormSection>

            {/* ── Shooting ── */}
            <FormSection title="Shooting" icon={Target} defaultOpen={false}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-2 font-body">
                    Field Goals
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      name="fg_made"
                      min="0"
                      placeholder="Made"
                      value={formData.fg_made}
                      onChange={handleFormChange}
                    />
                    <span className="text-text-muted">/</span>
                    <Input
                      type="number"
                      name="fg_attempted"
                      min="0"
                      placeholder="Att"
                      value={formData.fg_attempted}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-2 font-body">
                    3-Pointers
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      name="three_made"
                      min="0"
                      placeholder="Made"
                      value={formData.three_made}
                      onChange={handleFormChange}
                    />
                    <span className="text-text-muted">/</span>
                    <Input
                      type="number"
                      name="three_attempted"
                      min="0"
                      placeholder="Att"
                      value={formData.three_attempted}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-2 font-body">
                    Free Throws
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      name="ft_made"
                      min="0"
                      placeholder="Made"
                      value={formData.ft_made}
                      onChange={handleFormChange}
                    />
                    <span className="text-text-muted">/</span>
                    <Input
                      type="number"
                      name="ft_attempted"
                      min="0"
                      placeholder="Att"
                      value={formData.ft_attempted}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
              </div>
            </FormSection>

            {/* ── Self-Assessment ── */}
            <FormSection title="Self-Assessment" icon={Activity} defaultOpen={false}>
              <Slider
                label="Energy Level"
                value={formData.energy_level}
                onChange={handleSliderChange('energy_level')}
                min={1}
                max={10}
              />
              <Slider
                label="Performance Rating"
                value={formData.performance_rating}
                onChange={handleSliderChange('performance_rating')}
                min={1}
                max={10}
              />
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1 font-body">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="How did the game go?"
                  value={formData.notes}
                  onChange={handleFormChange}
                  className="w-full rounded-lg bg-bg-surface border border-border-subtle px-3 py-2 text-text-primary font-body text-sm placeholder:text-text-muted focus:outline-none focus:border-border-active transition-colors resize-none"
                />
              </div>
            </FormSection>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" loading={submitting} disabled={submitting}>
                Save Game
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* ── Summary Stats ── */}
      {!loading && totalGames > 0 && (
        <Card className="mb-6" padding="md">
          <div className="grid grid-cols-3 divide-x divide-border-subtle text-center">
            <div>
              <p className="text-text-muted text-xs font-body uppercase tracking-wider">Games</p>
              <p className="text-text-primary font-display text-2xl font-bold mt-0.5">
                {totalGames}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs font-body uppercase tracking-wider">Record</p>
              <p className="text-text-primary font-display text-2xl font-bold mt-0.5">
                <span className="text-success">{wins}</span>
                {' - '}
                <span className="text-danger">{losses}</span>
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs font-body uppercase tracking-wider">Avg Pts</p>
              <p className="text-text-primary font-display text-2xl font-bold mt-0.5">
                {avgPoints}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ── Filters ── */}
      {!loading && totalGames > 0 && (
        <div className="mb-4">
          <FilterChips options={FILTER_OPTIONS} selected={filter} onChange={setFilter} />
        </div>
      )}

      {/* ── Loading ── */}
      {loading && <SkeletonLoader variant="card" count={4} />}

      {/* ── Empty State ── */}
      {!loading && totalGames === 0 && (
        <EmptyState
          icon={Trophy}
          title="No games logged yet"
          description="Start tracking your games to see your stats and progress over time."
          actionLabel="Log Your First Game"
          onAction={() => setShowForm(true)}
        />
      )}

      {/* ── Filtered Empty ── */}
      {!loading && totalGames > 0 && filteredGames.length === 0 && (
        <EmptyState
          icon={Trophy}
          title={`No ${filter === 'Win' ? 'wins' : filter === 'Loss' ? 'losses' : 'draws'} found`}
          description="Try changing your filter to see other results."
        />
      )}

      {/* ── Games List ── */}
      {!loading && filteredGames.length > 0 && (
        <div className="space-y-3">
          {filteredGames.map((game) => (
            <Card
              key={game.id}
              className="hover:bg-bg-surface-hover transition-colors"
              padding="md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Result badge */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-lg ${resultBadgeStyle(game.result)}`}
                  >
                    {resultLabel(game.result)}
                  </div>

                  {/* Game info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {game.opponent && (
                        <span className="font-display text-lg font-semibold text-text-primary truncate">
                          vs {game.opponent}
                        </span>
                      )}
                      <span className="font-display text-lg font-bold text-text-primary">
                        {game.points ?? 0} pts
                      </span>
                      <Badge variant="default">{game.game_type || 'League'}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-text-muted text-sm font-body flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(game.game_date)}
                      </span>
                      {game.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {game.location}
                        </span>
                      )}
                      {game.notes && (
                        <span className="flex items-center gap-1">
                          <StickyNote className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[150px]">{game.notes}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete */}
                <div className="flex-shrink-0 ml-4">
                  {deleteConfirmId === game.id ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        className="!bg-danger hover:!bg-danger/80 text-sm px-3 py-1"
                        onClick={() => handleDelete(game.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-sm px-3 py-1"
                        onClick={() => setDeleteConfirmId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(game.id)}
                      className="text-text-muted hover:text-danger transition-colors p-1.5 rounded-lg hover:bg-danger/15"
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
