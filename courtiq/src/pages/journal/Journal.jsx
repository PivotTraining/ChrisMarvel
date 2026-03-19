import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';

export default function Journal() {
  return (
    <PageWrapper>
      <h1 className="font-display font-bold text-2xl text-text-primary mb-4">
        Journal
      </h1>
      <Card className="text-center py-10">
        <p className="text-text-muted font-body text-sm">
          Journal entries coming soon. Stay tuned!
        </p>
      </Card>
    </PageWrapper>
  );
}
