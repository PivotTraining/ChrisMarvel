import { Crosshair } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import EmptyState from '../../components/ui/EmptyState';

export default function Shots() {
  return (
    <PageWrapper>
      <h1 className="font-display font-bold text-2xl text-text-primary mb-6">
        Shot Tracker
      </h1>
      <EmptyState
        icon={<Crosshair className="h-10 w-10" />}
        title="Coming Soon"
        description="Log shots, view heatmaps, and track your shooting percentages. Check back soon!"
      />
    </PageWrapper>
  );
}
