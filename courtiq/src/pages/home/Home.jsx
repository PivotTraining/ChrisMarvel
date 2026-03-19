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
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../lib/api';
import { getGreeting } from '../../lib/dateUtils';

const quickActions = [
  { label: 'Log Game', path: '/games', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-400/15' },
  { label: 'Start Drill', path: '/drills', icon: Target, color: 'text-blue-400', bg: 'bg-blue-400/15' },
  { label: 'Track Shots', path: '/shots', icon: Crosshair, color: 'text-emerald-400', bg: 'bg-emerald-400/15' },
  { label: 'Journal Entry', path: '/journal', icon: BookHeart, color: 'text-rose-400', bg: 'bg-rose-400/15' },
];

export default function Home() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

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

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

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
      {/* ── Greeting ─────────────────────────────────── */}
      <section className="mb-8">
        <h1 className="font-display font-bold text-2xl text-text-primary">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-text-secondary font-body text-sm mt-1">
          Welcome to CourtIQ
        </p>
      </section>

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
      <section>
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
    </PageWrapper>
  );
}
