import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import Slider from '../../components/ui/Slider';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getJournalEntries, createJournalEntry, deleteJournalEntry } from '../../lib/api';
import { formatDate } from '../../lib/dateUtils';

const ENTRIES_PER_PAGE = 20;

function getMoodColor(value) {
  if (value >= 8) return 'text-success';
  if (value >= 5) return 'text-accent-primary';
  return 'text-danger';
}

function getEnergyColor(value) {
  if (value >= 8) return 'text-success';
  if (value >= 5) return 'text-accent-secondary';
  return 'text-danger';
}

function EntryCard({ entry, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const isLong = entry.content.length > 150;
  const displayContent = expanded || !isLong
    ? entry.content
    : entry.content.slice(0, 150) + '...';

  function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    onDelete(entry.id);
  }

  return (
    <Card className="bg-bg-surface" padding="md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <span className="font-display text-text-primary text-lg font-semibold">
              {formatDate(entry.date)}
            </span>
            <span className={`font-body text-sm font-medium ${getMoodColor(entry.mood)}`}>
              Mood {entry.mood}/10
            </span>
            <span className={`font-body text-sm font-medium ${getEnergyColor(entry.energy)}`}>
              Energy {entry.energy}/10
            </span>
          </div>

          <p className="font-body text-text-secondary text-sm whitespace-pre-line break-words leading-relaxed">
            {displayContent}
          </p>

          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-2 text-accent-primary text-sm font-body hover:underline cursor-pointer"
            >
              {expanded ? (
                <>Show less <ChevronUp size={14} /></>
              ) : (
                <>Read more <ChevronDown size={14} /></>
              )}
            </button>
          )}
        </div>

        <div className="flex-shrink-0">
          {confirming ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setConfirming(false)} className="text-xs">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleDelete} className="!bg-danger text-xs">
                Confirm
              </Button>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              className="text-text-muted hover:text-danger transition-colors cursor-pointer p-1"
              aria-label="Delete entry"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function Journal() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    date: today,
    content: '',
    mood: 5,
    energy: 5,
  });
  const [formError, setFormError] = useState('');

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getJournalEntries(user.id, {
        limit: ENTRIES_PER_PAGE,
        offset: 0,
      });
      setEntries(data || []);
    } catch {
      showToast('Failed to load journal entries', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.content.trim()) {
      setFormError('Content is required');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      const newEntry = await createJournalEntry({
        user_id: user.id,
        date: form.date,
        content: form.content.trim(),
        mood: form.mood,
        energy: form.energy,
      });
      setEntries((prev) => [newEntry, ...prev]);
      setForm({ date: today, content: '', mood: 5, energy: 5 });
      setShowForm(false);
      showToast('Journal entry saved', 'success');
    } catch {
      showToast('Failed to save entry', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteJournalEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      showToast('Entry deleted', 'success');
    } catch {
      showToast('Failed to delete entry', 'error');
    }
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-text-primary">Journal</h1>
        {!showForm && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            <Plus size={18} className="mr-1 inline-block" />
            New Entry
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="bg-bg-surface-elevated mb-6" padding="lg">
          <h2 className="font-display text-text-primary text-xl font-semibold mb-4">New Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />

            <div>
              <label className="block font-body text-text-secondary text-sm mb-1">
                Content
              </label>
              <textarea
                value={form.content}
                onChange={(e) => {
                  setForm((f) => ({ ...f, content: e.target.value }));
                  if (formError) setFormError('');
                }}
                rows={5}
                placeholder="How was your training today?"
                className="w-full rounded-lg border border-border-subtle bg-bg-primary text-text-primary font-body text-sm p-3 focus:outline-none focus:border-border-active resize-y placeholder:text-text-muted"
              />
              {formError && (
                <p className="text-danger text-sm mt-1 font-body">{formError}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Slider
                label="Mood"
                value={form.mood}
                onChange={(val) => setForm((f) => ({ ...f, mood: val }))}
                min={1}
                max={10}
              />
              <Slider
                label="Energy Level"
                value={form.energy}
                onChange={(val) => setForm((f) => ({ ...f, energy: val }))}
                min={1}
                max={10}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" loading={submitting} disabled={submitting}>
                Save Entry
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setFormError('');
                  setForm({ date: today, content: '', mood: 5, energy: 5 });
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <SkeletonLoader variant="card" count={4} />
      ) : entries.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No journal entries yet"
          description="Start tracking your basketball training by adding your first journal entry."
          actionLabel="New Entry"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
