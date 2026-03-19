import { Trophy } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import EmptyState from '../../components/ui/EmptyState';

export default function Games() {
  return (
    <PageWrapper>
      <h1 className="font-display font-bold text-2xl text-text-primary mb-6">
        Game Stats
      </h1>
      <EmptyState
        icon={<Trophy className="h-10 w-10" />}
        title="Coming Soon"
        description="Log games and review your performance stats. Check back soon!"
      />
    </PageWrapper>
  );
}
