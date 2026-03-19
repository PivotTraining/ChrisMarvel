import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Plus, Trash2, ChevronDown, ChevronUp, Brain, Moon, Zap, Star } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import Select from '../../components/ui/Select';
import Slider from '../../components/ui/Slider';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getJournalEntries, createJournalEntry, deleteJournalEntry } from '../../lib/api';
import { DEMO_JOURNAL_ENTRIES } from '../../lib/demoData';
import { formatDate } from '../../lib/dateUtils';

const ENTRIES_PER_PAGE = 20;

const MOOD_OPTIONS = [
  { value: 'Great', label: 'Great' },
  { value: 'Good', label: 'Good' },
  { value: 'Okay', label: 'Okay' },
  { value: 'Bad', label: 'Bad' },
  { value: 'Terrible', label: 'Terrible' },
];

const MOOD_CONFIG = {
  Great: { emoji: '🔥', colorClass: 'text-success', bgClass: 'bg-success/15' },
  Good: { emoji: '😊', colorClass: 'text-accent-primary', bgClass: 'bg-accent-primary/15' },
  Okay: { emoji: '😐', colorClass: 'text-accent-secondary', bgClass: 'bg-accent-secondary/15' },
  Bad: { emoji: '😞', colorClass: 'text-warning', bgClass: 'bg-warning/15' },
  Terrible: { emoji: '😩', colorClass: 'text-danger', bgClass: 'bg-danger/15' },
};

function getMoodDisplay(mood) {
  return MOOD_CONFIG[mood] || MOOD_CONFIG.Okay;
}

function getInitialForm() {
  return {
    entry_date: new Date().toISOString().split('T')[0],
    mood: 'Good',
    energy_level: 5,
    sleep_hours: '',
    sleep_quality: 5,
    confidence: 5,
    focus: 5,
    motivation: 5,
    stress: 5,
    highlights: '',
    improvements: '',
    goals_for_tomorrow: '',
    gratitude: '',
    notes: '',
  };
}

function SectionHeading({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-3 pt-2">
      {Icon && <Icon size={16} className="text-accent-primary" />}
      <h3 className="font-display text-text-primary text-sm font-semibold uppercase tracking-wider">
        {children}
      </h3>
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      <label className="block font-body text-text-secondary text-sm mb-1">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border-subtle bg-bg-surface text-text-primary font-body text-sm p-3 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-border-active resize-y placeholder:text-text-muted transition-all duration-200"
      />
    </div>
  );
}

function DetailRow({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div>
      <span className="font-body text-text-muted text-xs uppercase tracking-wider">{label}</span>
      <p className="font-body text-text-secondary text-sm whitespace-pre-line mt-0.5">{value}</p>
    </div>
  );
}

function EntryCard({ entry, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const moodDisplay = getMoodDisplay(entry.mood);

  function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    onDelete(entry.id);
  }

  return (
    <Card className="bg-bg-surface" padding="md">
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded); }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-display text-text-primary text-lg font-semibold">
              {formatDate(entry.entry_date)}
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${moodDisplay.colorClass} ${moodDisplay.bgClass}`}>
              {moodDisplay.emoji} {entry.mood}
            </span>
            {entry.energy_level != null && (
              <span className="inline-flex items-center gap-1 font-body text-sm text-text-secondary">
                <Zap size={14} className="text-accent-secondary" />
                {entry.energy_level}/10
              </span>
            )}
            {entry.mental_game_score != null && (
              <span className="inline-flex items-center gap-1 font-body text-sm text-text-secondary">
                <Brain size={14} className="text-accent-primary" />
                {Number(entry.mental_game_score).toFixed(1)}
              </span>
            )}
          </div>

          {entry.highlights && !expanded && (
            <p className="font-body text-text-muted text-sm mt-2 line-clamp-1">
              {entry.highlights}
            </p>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="flex items-center gap-1 mt-2 text-accent-primary text-xs font-body hover:underline cursor-pointer"
          >
            {expanded ? (
              <>Less detail <ChevronUp size={12} /></>
            ) : (
              <>More detail <ChevronDown size={12} /></>
            )}
          </button>
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

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border-subtle space-y-4">
          {/* Sleep section */}
          {(entry.sleep_hours != null || entry.sleep_quality != null) && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Moon size={14} className="text-accent-secondary" />
                <span className="font-body text-text-primary text-sm font-semibold">Sleep</span>
              </div>
              <div className="flex gap-4 flex-wrap">
                {entry.sleep_hours != null && (
                  <span className="font-body text-text-secondary text-sm">
                    {entry.sleep_hours} hrs
                  </span>
                )}
                {entry.sleep_quality != null && (
                  <span className="font-body text-text-secondary text-sm">
                    Quality: {entry.sleep_quality}/10
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Mental game section */}
          {(entry.confidence != null || entry.focus != null || entry.motivation != null || entry.stress != null) && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain size={14} className="text-accent-primary" />
                <span className="font-body text-text-primary text-sm font-semibold">Mental Game</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {entry.confidence != null && (
                  <div className="text-center p-2 rounded-lg bg-bg-primary">
                    <div className="font-body text-text-muted text-xs">Confidence</div>
                    <div className="font-display text-text-primary font-semibold">{entry.confidence}/10</div>
                  </div>
                )}
                {entry.focus != null && (
                  <div className="text-center p-2 rounded-lg bg-bg-primary">
                    <div className="font-body text-text-muted text-xs">Focus</div>
                    <div className="font-display text-text-primary font-semibold">{entry.focus}/10</div>
                  </div>
                )}
                {entry.motivation != null && (
                  <div className="text-center p-2 rounded-lg bg-bg-primary">
                    <div className="font-body text-text-muted text-xs">Motivation</div>
                    <div className="font-display text-text-primary font-semibold">{entry.motivation}/10</div>
                  </div>
                )}
                {entry.stress != null && (
                  <div className="text-center p-2 rounded-lg bg-bg-primary">
                    <div className="font-body text-text-muted text-xs">Stress</div>
                    <div className="font-display text-text-primary font-semibold">{entry.stress}/10</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reflections section */}
          <div className="space-y-3">
            <DetailRow label="Highlights" value={entry.highlights} />
            <DetailRow label="Areas to Improve" value={entry.improvements} />
            <DetailRow label="Goals for Tomorrow" value={entry.goals_for_tomorrow} />
            <DetailRow label="Gratitude" value={entry.gratitude} />
            <DetailRow label="Notes" value={entry.notes} />
          </div>
        </div>
      )}
    </Card>
  );
}

export default function Journal() {
  const { user, demoMode } = useAuth();
  const { showToast } = useToast();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(getInitialForm);
  const [formError, setFormError] = useState('');

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    if (demoMode) { setEntries(DEMO_JOURNAL_ENTRIES); setLoading(false); return; }
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
  }, [user, demoMode, showToast]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  function updateForm(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (formError) setFormError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (demoMode) { showToast('Demo mode — changes not saved', 'info'); return; }

    if (!form.mood) {
      setFormError('Mood is required');
      return;
    }

    setFormError('');
    setSubmitting(true);

    try {
      const payload = {
        user_id: user.id,
        entry_date: form.entry_date,
        mood: form.mood,
        energy_level: Number(form.energy_level),
      };

      // Optional numeric fields
      if (form.sleep_hours !== '' && form.sleep_hours != null) {
        payload.sleep_hours = Number(form.sleep_hours);
      }
      if (form.sleep_quality != null) payload.sleep_quality = Number(form.sleep_quality);
      if (form.confidence != null) payload.confidence = Number(form.confidence);
      if (form.focus != null) payload.focus = Number(form.focus);
      if (form.motivation != null) payload.motivation = Number(form.motivation);
      if (form.stress != null) payload.stress = Number(form.stress);

      // Optional text fields
      if (form.highlights.trim()) payload.highlights = form.highlights.trim();
      if (form.improvements.trim()) payload.improvements = form.improvements.trim();
      if (form.goals_for_tomorrow.trim()) payload.goals_for_tomorrow = form.goals_for_tomorrow.trim();
      if (form.gratitude.trim()) payload.gratitude = form.gratitude.trim();
      if (form.notes.trim()) payload.notes = form.notes.trim();

      const newEntry = await createJournalEntry(payload);
      setEntries((prev) => [newEntry, ...prev]);
      setForm(getInitialForm());
      setShowForm(false);
      showToast('Journal entry saved', 'success');
    } catch {
      showToast('Failed to save entry', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (demoMode) { showToast('Demo mode — changes not saved', 'info'); return; }
    try {
      await deleteJournalEntry(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      showToast('Entry deleted', 'success');
    } catch {
      showToast('Failed to delete entry', 'error');
    }
  }

  function handleCancel() {
    setShowForm(false);
    setFormError('');
    setForm(getInitialForm());
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

          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20">
              <p className="text-danger text-sm font-body">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basics Section */}
            <div>
              <SectionHeading icon={Star}>Basics</SectionHeading>
              <div className="space-y-4">
                <Input
                  label="Date"
                  type="date"
                  value={form.entry_date}
                  onChange={(e) => updateForm('entry_date', e.target.value)}
                />
                <Select
                  label="Mood"
                  value={form.mood}
                  onChange={(e) => updateForm('mood', e.target.value)}
                  options={MOOD_OPTIONS}
                />
                <Slider
                  label="Energy Level"
                  value={form.energy_level}
                  onChange={(e) => updateForm('energy_level', Number(e.target.value))}
                  min={1}
                  max={10}
                />
              </div>
            </div>

            {/* Sleep Section */}
            <div>
              <SectionHeading icon={Moon}>Sleep</SectionHeading>
              <div className="space-y-4">
                <Input
                  label="Sleep Hours"
                  type="number"
                  value={form.sleep_hours}
                  onChange={(e) => updateForm('sleep_hours', e.target.value)}
                  min="0"
                  max="24"
                  step="0.5"
                  placeholder="e.g. 7.5"
                />
                <Slider
                  label="Sleep Quality"
                  value={form.sleep_quality}
                  onChange={(e) => updateForm('sleep_quality', Number(e.target.value))}
                  min={1}
                  max={10}
                />
              </div>
            </div>

            {/* Mental Game Section */}
            <div>
              <SectionHeading icon={Brain}>Mental Game</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Slider
                  label="Confidence"
                  value={form.confidence}
                  onChange={(e) => updateForm('confidence', Number(e.target.value))}
                  min={1}
                  max={10}
                />
                <Slider
                  label="Focus"
                  value={form.focus}
                  onChange={(e) => updateForm('focus', Number(e.target.value))}
                  min={1}
                  max={10}
                />
                <Slider
                  label="Motivation"
                  value={form.motivation}
                  onChange={(e) => updateForm('motivation', Number(e.target.value))}
                  min={1}
                  max={10}
                />
                <Slider
                  label="Stress"
                  value={form.stress}
                  onChange={(e) => updateForm('stress', Number(e.target.value))}
                  min={1}
                  max={10}
                />
              </div>
            </div>

            {/* Reflections Section */}
            <div>
              <SectionHeading icon={BookOpen}>Reflections</SectionHeading>
              <div className="space-y-4">
                <TextareaField
                  label="Highlights"
                  value={form.highlights}
                  onChange={(e) => updateForm('highlights', e.target.value)}
                  placeholder="What went well today?"
                />
                <TextareaField
                  label="Areas to Improve"
                  value={form.improvements}
                  onChange={(e) => updateForm('improvements', e.target.value)}
                  placeholder="What could you do better?"
                />
                <TextareaField
                  label="Goals for Tomorrow"
                  value={form.goals_for_tomorrow}
                  onChange={(e) => updateForm('goals_for_tomorrow', e.target.value)}
                  placeholder="What do you want to accomplish tomorrow?"
                />
                <TextareaField
                  label="Gratitude"
                  value={form.gratitude}
                  onChange={(e) => updateForm('gratitude', e.target.value)}
                  placeholder="What are you grateful for?"
                />
                <TextareaField
                  label="Notes"
                  value={form.notes}
                  onChange={(e) => updateForm('notes', e.target.value)}
                  placeholder="Any additional thoughts..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary" loading={submitting} disabled={submitting}>
                Save Entry
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
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
          icon={<BookOpen size={48} />}
          title="No journal entries yet"
          description="Start tracking your basketball mindset by adding your first journal entry."
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
