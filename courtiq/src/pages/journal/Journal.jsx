import { BookHeart } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import EmptyState from '../../components/ui/EmptyState';

export default function Journal() {
  return (
    <PageWrapper>
      <h1 className="font-display font-bold text-2xl text-text-primary mb-6">
        Journal
      </h1>
      <EmptyState
        icon={<BookHeart className="h-10 w-10" />}
        title="Coming Soon"
        description="Reflect on your sessions and track your basketball journey. Check back soon!"
      />
    </PageWrapper>
  );
}
