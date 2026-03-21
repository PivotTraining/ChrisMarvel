import { Trophy, Star, Lock, Calendar, Target, Flame, Award, Zap } from 'lucide-react'
import { useBadges } from '../hooks/useBadges'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'

const iconMap = {
  trophy: Trophy,
  star: Star,
  target: Target,
  flame: Flame,
  award: Award,
  zap: Zap,
}

function ProgressBar({ current, target }) {
  const pct = Math.min((current / target) * 100, 100)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-text-muted">{current}/{target}</span>
        <span className="font-medium text-text-secondary">{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-bg-section overflow-hidden">
        <div
          className="h-full rounded-full bg-blue transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function Badges() {
  const { badges, earnedBadges, earnedBadgeIds, challenges, loading } = useBadges()

  const earned = earnedBadges.map(eb => ({
    ...eb.badge,
    earned_at: eb.earned_at,
  }))

  const locked = badges.filter(b => !earnedBadgeIds.has(b.id))

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Achievements"
          subtitle={`${earned.length} badge${earned.length !== 1 ? 's' : ''} earned`}
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Weekly Challenges */}
            {challenges.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                  Weekly Challenges
                </h2>
                <div className="space-y-3">
                  {challenges.filter(c => !c.completed).map(challenge => (
                    <Card key={challenge.id} className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-text-primary">{challenge.title}</p>
                          {challenge.description && (
                            <p className="text-xs text-text-muted">{challenge.description}</p>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full shrink-0">
                          +{challenge.xp_reward} XP
                        </span>
                      </div>
                      <ProgressBar current={challenge.current_value} target={challenge.target_value} />
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Earned Badges */}
            {earned.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                  Earned
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {earned.map(badge => {
                    const Icon = iconMap[badge.icon] || Trophy
                    const date = new Date(badge.earned_at)
                    const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

                    return (
                      <Card key={badge.id} className="flex flex-col items-center text-center py-5 px-3 space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                          <Icon size={22} className="text-gold" />
                        </div>
                        <p className="text-[11px] font-semibold text-text-primary leading-tight">{badge.name}</p>
                        <div className="flex items-center gap-1">
                          <Calendar size={8} className="text-text-muted" />
                          <span className="text-[9px] text-text-muted">{formatted}</span>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Locked Badges */}
            {locked.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                  Locked
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {locked.map(badge => (
                    <Card key={badge.id} className="flex flex-col items-center text-center py-5 px-3 space-y-2 opacity-50">
                      <div className="w-12 h-12 rounded-xl bg-bg-section border border-border flex items-center justify-center">
                        <Lock size={18} className="text-text-muted" />
                      </div>
                      <p className="text-[11px] font-semibold text-text-primary leading-tight">{badge.name}</p>
                      {badge.description && (
                        <p className="text-[9px] text-text-muted leading-tight">{badge.description}</p>
                      )}
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {badges.length === 0 && (
              <Card>
                <div className="flex flex-col items-center py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-bg-section border border-border flex items-center justify-center">
                    <Trophy size={22} className="text-text-muted" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-text-primary">No badges available</p>
                    <p className="text-xs text-text-muted">Badges will appear as you use CourtIQ.</p>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </PageShell>
  )
}
