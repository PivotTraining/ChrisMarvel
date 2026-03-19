import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dumbbell,
  Heart,
  Apple,
  Clock,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Star,
  Tag,
  Wrench,
  Library,
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import FilterChips from '../../components/ui/FilterChips';
import Badge from '../../components/ui/Badge';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  getTrainingContent,
  getSavedContent,
  saveContent,
  unsaveContent,
} from '../../lib/api';

const TABS = [
  { value: 'browse', label: 'Browse' },
  { value: 'saved', label: 'Saved' },
];

const CONTENT_TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'drill', label: 'Drills' },
  { value: 'recovery', label: 'Recovery' },
  { value: 'nutrition', label: 'Nutrition' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

const CONTENT_TYPE_ICONS = {
  drill: Dumbbell,
  recovery: Heart,
  nutrition: Apple,
};

const DIFFICULTY_BADGE_VARIANT = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
};

function ContentCard({ item, isSaved, onToggleSave, savingId }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = CONTENT_TYPE_ICONS[item.content_type] || Dumbbell;
  const saving = savingId === item.id;

  return (
    <Card padding="md" className="relative">
      {/* Featured indicator */}
      {item.is_featured && (
        <div className="absolute top-3 right-3">
          <Star className="w-4 h-4 text-accent-secondary fill-accent-secondary" />
        </div>
      )}

      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-accent-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-4.5 h-4.5 text-accent-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-display text-base font-semibold text-text-primary leading-tight">
              {item.title}
            </h3>
            {item.difficulty && (
              <Badge variant={DIFFICULTY_BADGE_VARIANT[item.difficulty] || 'default'}>
                {item.difficulty}
              </Badge>
            )}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 mb-2">
            {item.duration_minutes && (
              <span className="flex items-center gap-1 text-xs font-body text-text-muted">
                <Clock className="w-3.5 h-3.5" />
                {item.duration_minutes} min
              </span>
            )}
            <span className="text-xs font-body text-text-muted capitalize">
              {item.content_type}
            </span>
          </div>

          {/* Description preview */}
          {item.description && (
            <p className="text-sm font-body text-text-secondary line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1 text-accent-primary text-sm font-body hover:underline cursor-pointer"
        >
          {expanded ? (
            <>
              Show less <ChevronUp size={14} />
            </>
          ) : (
            <>
              View details <ChevronDown size={14} />
            </>
          )}
        </button>

        <button
          onClick={() => onToggleSave(item.id)}
          disabled={saving}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            saving
              ? 'opacity-50 cursor-not-allowed'
              : isSaved
                ? 'text-accent-primary hover:bg-accent-primary/10'
                : 'text-text-muted hover:text-accent-primary hover:bg-accent-primary/10'
          }`}
          aria-label={isSaved ? 'Unsave content' : 'Save content'}
        >
          {isSaved ? (
            <BookmarkCheck className="w-5 h-5" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border-subtle space-y-3">
          {/* Full description */}
          {item.description && (
            <p className="text-sm font-body text-text-secondary leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Coaching cue */}
          {item.coaching_cue && (
            <div className="bg-accent-primary/5 border border-accent-primary/10 rounded-lg p-3">
              <p className="text-xs font-body text-text-muted uppercase tracking-wide mb-1">
                Coaching Cue
              </p>
              <p className="text-sm font-body text-text-primary leading-relaxed">
                {item.coaching_cue}
              </p>
            </div>
          )}

          {/* Equipment */}
          {item.equipment && item.equipment.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-body text-text-muted uppercase tracking-wide mb-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Equipment
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.equipment.map((eq, i) => (
                  <span
                    key={i}
                    className="text-xs font-body text-text-secondary bg-bg-surface-elevated px-2.5 py-1 rounded-full border border-border-subtle"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-body text-text-muted uppercase tracking-wide mb-1.5">
                <Tag className="w-3.5 h-3.5" />
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs font-body text-accent-secondary bg-accent-primary/10 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default function Train() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('browse');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const [content, setContent] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [savingId, setSavingId] = useState(null);

  // Fetch browse content
  const fetchContent = useCallback(async () => {
    try {
      setLoadingContent(true);
      const params = { limit: 50, offset: 0 };
      if (contentTypeFilter !== 'all') params.category = contentTypeFilter;
      if (difficultyFilter !== 'all') params.difficulty = difficultyFilter;
      const data = await getTrainingContent(params);
      setContent(data || []);
    } catch {
      showToast('Failed to load training content', 'error');
    } finally {
      setLoadingContent(false);
    }
  }, [contentTypeFilter, difficultyFilter, showToast]);

  // Fetch saved content
  const fetchSaved = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoadingSaved(true);
      const data = await getSavedContent(user.id);
      setSavedItems(data || []);
    } catch {
      showToast('Failed to load saved content', 'error');
    } finally {
      setLoadingSaved(false);
    }
  }, [user?.id, showToast]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  // Set of saved content IDs for quick lookup
  const savedContentIds = useMemo(() => {
    const ids = new Set();
    savedItems.forEach((s) => {
      const contentId = s.content_id || s.training_content?.id;
      if (contentId) ids.add(contentId);
    });
    return ids;
  }, [savedItems]);

  // Filtered saved items for Saved tab
  const filteredSavedItems = useMemo(() => {
    let items = savedItems
      .map((s) => s.training_content)
      .filter(Boolean);

    if (contentTypeFilter !== 'all') {
      items = items.filter((item) => item.content_type === contentTypeFilter);
    }
    if (difficultyFilter !== 'all') {
      items = items.filter((item) => item.difficulty === difficultyFilter);
    }
    return items;
  }, [savedItems, contentTypeFilter, difficultyFilter]);

  async function handleToggleSave(contentId) {
    if (!user?.id) return;
    const alreadySaved = savedContentIds.has(contentId);
    try {
      setSavingId(contentId);
      if (alreadySaved) {
        await unsaveContent(user.id, contentId);
        setSavedItems((prev) =>
          prev.filter((s) => (s.content_id || s.training_content?.id) !== contentId)
        );
        showToast('Removed from saved', 'success');
      } else {
        await saveContent(user.id, contentId);
        showToast('Saved to library', 'success');
        // Refresh saved items to get the full joined record
        fetchSaved();
      }
    } catch {
      showToast(alreadySaved ? 'Failed to unsave' : 'Failed to save', 'error');
    } finally {
      setSavingId(null);
    }
  }

  const isLoading = activeTab === 'browse' ? loadingContent : loadingSaved;
  const displayItems = activeTab === 'browse' ? content : filteredSavedItems;

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-text-primary tracking-tight">
          Train
        </h1>
        <p className="text-text-secondary font-body mt-1">
          Browse drills, recovery tips, and nutrition content.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-surface border border-border-subtle rounded-xl p-1 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`
              flex-1 rounded-lg px-4 py-2 text-sm font-medium font-body
              transition-all duration-200 cursor-pointer
              ${
                activeTab === tab.value
                  ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20'
                  : 'text-text-secondary hover:text-text-primary'
              }
            `}
          >
            {tab.label}
            {tab.value === 'saved' && savedItems.length > 0 && (
              <span
                className={`ml-1.5 text-xs ${
                  activeTab === 'saved' ? 'text-white/70' : 'text-text-muted'
                }`}
              >
                ({savedItems.length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-2 mb-4">
        <FilterChips
          options={CONTENT_TYPE_OPTIONS}
          selected={contentTypeFilter}
          onChange={setContentTypeFilter}
        />
        <FilterChips
          options={DIFFICULTY_OPTIONS}
          selected={difficultyFilter}
          onChange={setDifficultyFilter}
        />
      </div>

      {/* Loading */}
      {isLoading && <SkeletonLoader variant="card" count={4} />}

      {/* Empty states */}
      {!isLoading && displayItems.length === 0 && activeTab === 'browse' && (
        <EmptyState
          icon={<Library className="w-12 h-12" />}
          title="No content found"
          description="Try adjusting your filters to discover more training content."
        />
      )}

      {!isLoading && displayItems.length === 0 && activeTab === 'saved' && (
        <EmptyState
          icon={<Bookmark className="w-12 h-12" />}
          title="No saved content yet"
          description="Browse the training library and bookmark content you want to come back to."
          actionLabel="Browse Content"
          onAction={() => setActiveTab('browse')}
        />
      )}

      {/* Content list */}
      {!isLoading && displayItems.length > 0 && (
        <div className="space-y-3">
          {displayItems.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              isSaved={savedContentIds.has(item.id)}
              onToggleSave={handleToggleSave}
              savingId={savingId}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
