import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';

export default function Games() {
  return (
    <PageWrapper>
      <h1 className="font-display font-bold text-2xl text-text-primary mb-4">
        Game Stats
      </h1>
      <Card className="text-center py-10">
        <p className="text-text-muted font-body text-sm">
          Game stats coming soon. Stay tuned!
        </p>
      </Card>
    </PageWrapper>
  );
}
