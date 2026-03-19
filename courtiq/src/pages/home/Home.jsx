import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Crosshair, BookHeart, BarChart3 } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { getGreeting } from '../../lib/dateUtils';

const quickActions = [
  { label: 'Log Game', icon: Trophy, path: '/games' },
  { label: 'Start Drill', icon: Target, path: '/drills' },
  { label: 'Track Shots', icon: Crosshair, path: '/shots' },
  { label: 'Journal Entry', icon: BookHeart, path: '/journal' },
];

export default function Home() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const firstName =
    profile?.first_name || profile?.full_name?.split(' ')[0] || 'Player';

  return (
    <PageWrapper>
      {/* Greeting */}
      <section className="mb-6">
        <h1 className="font-display font-bold text-2xl text-text-primary">
          {getGreeting()}, {firstName}
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
          {quickActions.map(({ label, icon: Icon, path }) => (
            <Card
              key={path}
              padding="md"
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-primary/15">
                <Icon className="h-5 w-5 text-accent-primary" />
              </div>
              <span className="text-sm font-body font-medium text-text-primary">
                {label}
              </span>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats placeholder */}
      <section>
        <EmptyState
          icon={<BarChart3 className="h-10 w-10" />}
          title="No Stats Yet"
          description="Start logging your first session to see stats here"
        />
      </section>
    </PageWrapper>
  );
}
