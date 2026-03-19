import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Crosshair, BookHeart } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../lib/api';
import { getGreeting } from '../../lib/dateUtils';

const quickActions = [
  { label: 'Log Game', path: '/games', icon: Trophy, color: 'bg-accent-primary' },
  { label: 'Start Drill', path: '/drills', icon: Target, color: 'bg-accent-secondary' },
  { label: 'Track Shots', path: '/shots', icon: Crosshair, color: 'bg-success/15' },
  { label: 'Journal Entry', path: '/journal', icon: BookHeart, color: 'bg-danger/15' },
];

export default function Home() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      try {
        const data = await getDashboardStats(user.id);
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const firstName =
    profile?.first_name || profile?.full_name?.split(' ')[0] || 'Player';
  const greeting = getGreeting();

  const hasStats = stats && (
    stats.gamesPlayed > 0 ||
    stats.totalDrills > 0 ||
    stats.totalShots > 0 ||
    stats.journalEntries > 0
  );

  return (
    <PageWrapper>
      {/* Greeting */}
      <section className="mb-6">
        <h1 className="font-display font-bold text-2xl text-text-primary">
          {greeting}, {firstName}
        </h1>
        <p className="text-text-secondary font-body text-sm mt-1">
          Welcome to CourtIQ
        </p>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="font-display font-semibold text-lg text-text-primary mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ label, path, icon: Icon, color }) => (
            <Card
              key={path}
              padding="md"
              onClick={() => navigate(path)}
              className="cursor-pointer transition-colors hover:bg-bg-surface-hover"
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className={`${color} rounded-xl p-3`}>
                  <Icon className="h-6 w-6 text-text-primary" />
                </div>
                <span className="text-sm font-body font-medium text-text-primary">
                  {label}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Overview */}
      <section>
        <h2 className="font-display font-semibold text-lg text-text-primary mb-3">
          Your Stats
        </h2>

        {loading ? (
          <SkeletonLoader variant="card" count={4} />
        ) : hasStats ? (
          <div className="grid grid-cols-2 gap-3">
            {/* Games */}
            <Card padding="md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-4 w-4 text-accent-primary" />
                  <span className="font-body text-xs font-medium text-text-muted uppercase tracking-wide">
                    Games
                  </span>
                </div>
                <span className="font-display text-2xl font-bold text-text-primary">
                  {stats.wins}-{stats.losses}
                </span>
                <span className="text-xs text-text-secondary">
                  {stats.winPct}% win rate
                </span>
              </div>
            </Card>

            {/* Shooting */}
            <Card padding="md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <Crosshair className="h-4 w-4 text-accent-secondary" />
                  <span className="font-body text-xs font-medium text-text-muted uppercase tracking-wide">
                    Shooting
                  </span>
                </div>
                <span className="font-display text-2xl font-bold text-text-primary">
                  {stats.shootingPct}%
                </span>
                <span className="text-xs text-text-secondary">
                  {stats.totalShots} total shots
                </span>
              </div>
            </Card>

            {/* Drills */}
            <Card padding="md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-success" />
                  <span className="font-body text-xs font-medium text-text-muted uppercase tracking-wide">
                    Drills
                  </span>
                </div>
                <span className="font-display text-2xl font-bold text-text-primary">
                  {stats.totalDrills}
                </span>
                <span className="text-xs text-text-secondary">
                  {stats.totalDrillMinutes} minutes
                </span>
              </div>
            </Card>

            {/* Journal */}
            <Card padding="md">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <BookHeart className="h-4 w-4 text-danger" />
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
        ) : (
          <EmptyState
            icon={Trophy}
            title="No stats yet"
            description="Start logging games, drills, and shots to see your stats here."
            actionLabel="Log Your First Game"
            onAction={() => navigate('/games')}
          />
        )}
      </section>
    </PageWrapper>
  );
}
