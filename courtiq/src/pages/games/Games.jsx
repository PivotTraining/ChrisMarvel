import { useState, useEffect, useCallback } from 'react';
import { Trophy, Plus, Trash2, Calendar, MapPin, StickyNote, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getGames, createGame, deleteGame } from '../../lib/api';
import { formatDate } from '../../lib/dateUtils';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import FilterChips from '../../components/ui/FilterChips';
import SkeletonLoader from '../../components/ui/SkeletonLoader';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'W', label: 'Wins' },
  { value: 'L', label: 'Losses' },
];

function getResultFromScores(userScore, opponentScore) {
  const us = parseInt(userScore, 10);
  const os = parseInt(opponentScore, 10);
  if (isNaN(us) || isNaN(os)) return null;
  if (us > os) return 'W';
  if (us < os) return 'L';
  return 'T';
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const INITIAL_FORM = {
  date: todayISO(),
  opponent: '',
  user_score: '',
  opponent_score: '',
  location: '',
  notes: '',
};

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

  const filteredGames = filter === 'all'
    ? games
    : games.filter((g) => g.result === filter);

  // Stats
  const totalGames = games.length;
  const wins = games.filter((g) => g.result === 'W').length;
  const losses = games.filter((g) => g.result === 'L').length;
  const winPct = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  // Form handling
  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  }

  function validateForm() {
    const errors = {};
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.opponent.trim()) errors.opponent = 'Opponent is required';
    if (formData.user_score === '' || isNaN(parseInt(formData.user_score, 10)) || parseInt(formData.user_score, 10) < 0)
      errors.user_score = 'Enter a valid score';
    if (formData.opponent_score === '' || isNaN(parseInt(formData.opponent_score, 10)) || parseInt(formData.opponent_score, 10) < 0)
      errors.opponent_score = 'Enter a valid score';
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const userScore = parseInt(formData.user_score, 10);
    const opponentScore = parseInt(formData.opponent_score, 10);
    const result = getResultFromScores(userScore, opponentScore);

    setSubmitting(true);
    try {
      const newGame = await createGame({
        user_id: user.id,
        date: formData.date,
        opponent: formData.opponent.trim(),
        user_score: userScore,
        opponent_score: opponentScore,
        result,
        location: formData.location.trim() || null,
        notes: formData.notes.trim() || null,
      });
      setGames((prev) => [newGame, ...prev]);
      setFormData(INITIAL_FORM);
      setShowForm(false);
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

  const previewResult = getResultFromScores(formData.user_score, formData.opponent_score);

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

      {/* Inline Form */}
      {showForm && (
        <Card className="mb-6" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-text-primary uppercase tracking-wide">
              Log a Game
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setFormData(INITIAL_FORM);
                setFormErrors({});
              }}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                error={formErrors.date}
              />
              <Input
                label="Opponent"
                name="opponent"
                placeholder="e.g. East Side Eagles"
                value={formData.opponent}
                onChange={handleFormChange}
                error={formErrors.opponent}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Score"
                type="number"
                name="user_score"
                min="0"
                placeholder="0"
                value={formData.user_score}
                onChange={handleFormChange}
                error={formErrors.user_score}
              />
              <Input
                label="Opponent Score"
                type="number"
                name="opponent_score"
                min="0"
                placeholder="0"
                value={formData.opponent_score}
                onChange={handleFormChange}
                error={formErrors.opponent_score}
              />
            </div>

            {previewResult && (
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-sm font-body">Result:</span>
                <span
                  className={`text-sm font-bold ${
                    previewResult === 'W'
                      ? 'text-success'
                      : previewResult === 'L'
                      ? 'text-danger'
                      : 'text-text-secondary'
                  }`}
                >
                  {previewResult === 'W' ? 'Win' : previewResult === 'L' ? 'Loss' : 'Tie'}
                </span>
              </div>
            )}

            <Input
              label="Location (optional)"
              name="location"
              placeholder="e.g. Central Park Courts"
              value={formData.location}
              onChange={handleFormChange}
            />

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1 font-body">
                Notes (optional)
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

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" loading={submitting} disabled={submitting}>
                Save Game
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setFormData(INITIAL_FORM);
                  setFormErrors({});
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Stats Bar */}
      {!loading && totalGames > 0 && (
        <Card className="mb-6" padding="md">
          <div className="grid grid-cols-3 divide-x divide-border-subtle text-center">
            <div>
              <p className="text-text-muted text-xs font-body uppercase tracking-wider">Games</p>
              <p className="text-text-primary font-display text-2xl font-bold mt-0.5">{totalGames}</p>
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
              <p className="text-text-muted text-xs font-body uppercase tracking-wider">Win %</p>
              <p className="text-text-primary font-display text-2xl font-bold mt-0.5">{winPct}%</p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      {!loading && totalGames > 0 && (
        <div className="mb-4">
          <FilterChips options={FILTER_OPTIONS} selected={filter} onChange={setFilter} />
        </div>
      )}

      {/* Loading State */}
      {loading && <SkeletonLoader variant="card" count={4} />}

      {/* Empty State */}
      {!loading && totalGames === 0 && (
        <EmptyState
          icon={Trophy}
          title="No games logged yet"
          description="Start tracking your games to see your stats and progress over time."
          actionLabel="Log Your First Game"
          onAction={() => setShowForm(true)}
        />
      )}

      {/* Filtered Empty */}
      {!loading && totalGames > 0 && filteredGames.length === 0 && (
        <EmptyState
          icon={Trophy}
          title={`No ${filter === 'W' ? 'wins' : 'losses'} found`}
          description="Try changing your filter to see other results."
        />
      )}

      {/* Games List */}
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
                  {/* Result Badge */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-lg ${
                      game.result === 'W'
                        ? 'bg-success/15 text-success'
                        : game.result === 'L'
                        ? 'bg-danger/15 text-danger'
                        : 'bg-bg-surface-elevated text-text-secondary'
                    }`}
                  >
                    {game.result}
                  </div>

                  {/* Game Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display text-lg font-semibold text-text-primary truncate">
                        vs {game.opponent}
                      </span>
                      <span className="font-display text-lg font-bold text-text-primary">
                        {game.user_score} - {game.opponent_score}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-text-muted text-sm font-body">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(game.date)}
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
