import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Target,
  Crosshair,
  BookHeart,
  BarChart3,
  TrendingUp,
  Flame,
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import WeeklyChallenges from '../../components/WeeklyChallenges';
import BadgeShowcase from '../../components/BadgeShowcase';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats, getWeeklyChallenges, getUserBadges } from '../../lib/api';
import {
  DEMO_DASHBOARD_STATS,
  DEMO_CHALLENGES,
  DEMO_BADGES,
} from '../../lib/demoData';
import { getGreeting } from '../../lib/dateUtils';

const quickActions = [
  { label: 'Log Game', path: '/games', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-400/15' },
  { label: 'Start Drill', path: '/drills', icon: Target, color: 'text-blue-400', bg: 'bg-blue-400/15' },
  { label: 'Track Shots', path: '/shots', icon: Crosshair, color: 'text-emerald-400', bg: 'bg-emerald-400/15' },
  { label: 'Journal Entry', path: '/journal', icon: BookHeart, color: 'text-rose-400', bg: 'bg-rose-400/15' },
];

export default function Home() {
  const { user, profile, demoMode } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const [challengesLoading, setChallengesLoading] = useState(true);
  const [badges, setBadges] = useState([]);
  const [badgesLoading, setBadgesLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    // Demo mode: use mock data
    if (demoMode) {
      setStats(DEMO_DASHBOARD_STATS);
      setChallenges(DEMO_CHALLENGES);
      setBadges(DEMO_BADGES);
      setLoading(false);
      setChallengesLoading(false);
      setBadgesLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchStats() {
      try {
        const data = await getDashboardStats(user.id);
        if (!cancelled) setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function fetchChallenges() {
      try {
        const data = await getWeeklyChallenges(user.id);
        if (!cancelled) setChallenges(data);
      } catch (err) {
        console.error('Failed to fetch weekly challenges:', err);
      } finally {
        if (!cancelled) setChallengesLoading(false);
      }
    }

    async function fetchBadges() {
      try {
        const data = await getUserBadges(user.id);
        if (!cancelled) setBadges(data);
      } catch (err) {
        console.error('Failed to fetch badges:', err);
      } finally {
        if (!cancelled) setBadgesLoading(false);
      }
    }

    fetchStats();
    fetchChallenges();
    fetchBadges();

    return () => {
      cancelled = true;
    };
  }, [user?.id, demoMode]);

  const firstName =
    profile?.first_name || profile?.full_name?.split(' ')[0] || 'Player';

  const allZero =
    !stats ||
    (stats.gamesPlayed === 0 &&
      stats.totalDrills === 0 &&
      stats.totalShots === 0 &&
      stats.journalEntries === 0);

  return (
    <PageWrapper>
      {/* ── Hero Banner ────────────────────────────────── */}
      <section className="mb-6 -mx-4 -mt-2">
        <div className="relative h-40 overflow-hidden rounded-b-2xl">
          <img
            src="https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Basketball game"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
            <h1 className="font-display font-bold text-2xl text-text-primary drop-shadow-lg">
              {getGreeting()}, {firstName}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              {profile?.current_streak > 0 && (
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-body text-white/90 font-semibold drop-shadow">
                    {profile.current_streak} day streak
                  </span>
                </div>
              )}
              {demoMode && (
                <span className="px-2 py-0.5 rounded-full bg-accent-primary/30 text-accent-primary text-xs font-medium backdrop-blur-sm">
                  Demo
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Level & XP ─────────────────────────────────── */}
      {profile?.xp != null && (
        <section className="mb-6">
          <Card padding="md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-body font-medium text-text-primary">
                Level {profile.level}
              </span>
              <span className="text-xs text-text-muted">{profile.xp} XP</span>
            </div>
            <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-primary to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(((profile.xp % 500) / 500) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-text-muted mt-1">
              {500 - (profile.xp % 500)} XP to Level {(profile.level || 1) + 1}
            </p>
          </Card>
        </section>
      )}

      {/* ── Quick Actions ────────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="h-5 w-5 text-accent-primary" />
          <h2 className="font-display font-semibold text-lg text-text-primary">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ label, path, icon: Icon, color, bg }) => (
            <Card
              key={path}
              padding="md"
              onClick={() => navigate(path)}
              className="cursor-pointer active:scale-[0.97] transition-transform"
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className={`${bg} rounded-xl p-3`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <span className="text-sm font-body font-medium text-text-primary">
                  {label}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Stats Overview ───────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-5 w-5 text-accent-primary" />
          <h2 className="font-display font-semibold text-lg text-text-primary">
            Your Stats
          </h2>
        </div>

        {loading ? (
          <SkeletonLoader variant="card" count={4} />
        ) : allZero ? (
          <EmptyState
            icon={<TrendingUp className="h-10 w-10" />}
            title="No stats yet"
            description="Start logging games, drills, and shots to see your progress here."
            actionLabel="Log Your First Game"
            onAction={() => navigate('/games')}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {/* Games */}
            <Card padding="md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <span className="font-body text-xs font-medium text-text-muted uppercase tracking-wide">
                    Games
                  </span>
                </div>
                <span className="font-display text-2xl font-bold text-text-primary">
                  {stats.wins}–{stats.losses}
                </span>
                <span className="text-xs text-text-secondary">
                  {stats.winPct}% win rate
                </span>
                <span className="text-xs text-text-secondary">
                  {stats.avgPoints} pts / game
                </span>
              </div>
            </Card>

            {/* Shooting */}
            <Card padding="md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <Crosshair className="h-4 w-4 text-emerald-400" />
                  <span className="font-body text-xs font-medium text-text-muted uppercase tracking-wide">
                    Shooting
                  </span>
                </div>
                <span className="font-display text-2xl font-bold text-text-primary">
                  {stats.shootingPct}%
                </span>
                <span className="text-xs text-text-secondary">
                  {stats.madeShots}/{stats.totalShots} made
                </span>
              </div>
            </Card>

            {/* Drills */}
            <Card padding="md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-blue-400" />
                  <span className="font-body text-xs font-medium text-text-muted uppercase tracking-wide">
                    Drills
                  </span>
                </div>
                <span className="font-display text-2xl font-bold text-text-primary">
                  {stats.totalDrills}
                </span>
                <span className="text-xs text-text-secondary">
                  {stats.totalDrillMinutes} min trained
                </span>
              </div>
            </Card>

            {/* Journal */}
            <Card padding="md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <BookHeart className="h-4 w-4 text-rose-400" />
                  <span className="font-body text-xs font-medium text-text-muted uppercase tracking-wide">
                    Journal
                  </span>
                </div>
                <span className="font-display text-2xl font-bold text-text-primary">
                  {stats.journalEntries}
                </span>
                <span className="text-xs text-text-secondary">
                  entries
                </span>
              </div>
            </Card>
          </div>
        )}
      </section>

      {/* ── Weekly Challenges ─────────────────────────── */}
      <WeeklyChallenges challenges={challenges} loading={challengesLoading} />

      {/* ── Badge Showcase ────────────────────────────── */}
      <BadgeShowcase badges={badges} loading={badgesLoading} />
    </PageWrapper>
  );
}
