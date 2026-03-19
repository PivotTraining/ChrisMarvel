import Card from './ui/Card';

function BadgeSkeleton() {
  return (
    <div className="flex-shrink-0 w-24 flex flex-col items-center gap-2">
      <div className="animate-pulse rounded-full bg-bg-surface-hover h-14 w-14" />
      <div className="animate-pulse rounded-lg bg-bg-surface-hover h-3 w-16" />
      <div className="animate-pulse rounded-lg bg-bg-surface-hover h-2.5 w-12" />
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function BadgeShowcase({ badges = [], loading = false }) {
  if (loading) {
    return (
      <section className="mb-8">
        <h2 className="font-display font-semibold text-lg text-text-primary mb-3">
          Recent Badges
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {Array.from({ length: 4 }, (_, i) => (
            <BadgeSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="font-display font-semibold text-lg text-text-primary mb-3">
        Recent Badges
      </h2>

      {badges.length === 0 ? (
        <Card padding="md">
          <p className="text-text-secondary text-sm text-center py-2">
            Complete challenges to earn badges
          </p>
        </Card>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {badges.map((userBadge) => {
            const badge = userBadge.badges || userBadge;
            return (
              <div
                key={userBadge.id}
                className="flex-shrink-0 w-24 rounded-2xl bg-bg-surface border border-border-subtle p-3 flex flex-col items-center gap-1.5 transition-colors hover:bg-bg-surface-hover"
                style={{
                  boxShadow: '0 0 12px rgba(139, 92, 246, 0.15)',
                }}
              >
                <span className="text-3xl leading-none" role="img" aria-label={badge.name}>
                  {badge.icon}
                </span>
                <span className="text-xs font-medium text-text-primary text-center leading-tight line-clamp-2">
                  {badge.name}
                </span>
                <span className="text-[10px] text-text-secondary">
                  {formatDate(userBadge.earned_at)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
