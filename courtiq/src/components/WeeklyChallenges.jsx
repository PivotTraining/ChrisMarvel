import { Target, Trophy, CheckCircle2 } from 'lucide-react';
import Card from './ui/Card';

function ChallengeSkeleton() {
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="animate-pulse rounded-lg bg-bg-surface-hover h-4 w-2/3" />
        <div className="animate-pulse rounded-full bg-bg-surface-hover h-6 w-16" />
      </div>
      <div className="animate-pulse rounded-full bg-bg-surface-hover h-2 w-full" />
      <div className="animate-pulse rounded-lg bg-bg-surface-hover h-3 w-1/4" />
    </div>
  );
}

export default function WeeklyChallenges({ challenges = [], loading = false }) {
  if (loading) {
    return (
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-5 w-5 text-accent-primary" />
          <h2 className="font-display font-semibold text-lg text-text-primary">
            Weekly Challenges
          </h2>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <ChallengeSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  const activeChallenges = challenges.slice(0, 3);

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Target className="h-5 w-5 text-accent-primary" />
        <h2 className="font-display font-semibold text-lg text-text-primary">
          Weekly Challenges
        </h2>
      </div>

      {activeChallenges.length === 0 ? (
        <Card padding="md">
          <p className="text-text-secondary text-sm text-center py-2">
            No challenges this week
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {activeChallenges.map((challenge) => {
            const progress =
              challenge.target_value > 0
                ? Math.min(
                    Math.round(
                      (challenge.current_value / challenge.target_value) * 100
                    ),
                    100
                  )
                : 0;

            return (
              <Card key={challenge.id} padding="md" className="rounded-2xl">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {challenge.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Target className="h-5 w-5 text-accent-primary flex-shrink-0" />
                    )}
                    <span
                      className={`font-body text-sm font-medium truncate ${
                        challenge.completed
                          ? 'text-text-secondary line-through'
                          : 'text-text-primary'
                      }`}
                    >
                      {challenge.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-400/15 rounded-full px-2 py-0.5 flex-shrink-0 ml-2">
                    <Trophy className="h-3 w-3 text-amber-400" />
                    <span className="text-xs font-medium text-amber-400">
                      {challenge.xp_reward} XP
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-bg-primary rounded-full h-2 mb-1.5">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      challenge.completed
                        ? 'bg-emerald-400'
                        : 'bg-accent-primary'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <span className="text-xs text-text-secondary">
                  {challenge.current_value} / {challenge.target_value}
                </span>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
