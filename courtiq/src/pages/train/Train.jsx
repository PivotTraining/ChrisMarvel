import { BookOpen } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import EmptyState from '../../components/ui/EmptyState';

export default function Train() {
  return (
    <PageWrapper>
      <h1 className="font-display font-bold text-2xl text-text-primary mb-6">
        Training
      </h1>
      <EmptyState
        icon={<BookOpen className="h-10 w-10" />}
        title="Coming Soon"
        description="Training plans and workouts are on the way. Check back soon!"
      />
    </PageWrapper>
  );
}
