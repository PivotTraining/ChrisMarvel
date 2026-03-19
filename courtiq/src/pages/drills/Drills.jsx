import { Target } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import EmptyState from '../../components/ui/EmptyState';

export default function Drills() {
  return (
    <PageWrapper>
      <h1 className="font-display font-bold text-2xl text-text-primary mb-6">
        Drill Tracker
      </h1>
      <EmptyState
        icon={<Target className="h-10 w-10" />}
        title="Coming Soon"
        description="Track your drills and see your improvement over time. Check back soon!"
      />
    </PageWrapper>
  );
}
