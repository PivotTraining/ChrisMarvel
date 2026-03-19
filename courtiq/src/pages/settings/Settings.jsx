import { LogOut } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { signOut, profile } = useAuth();

  return (
    <PageWrapper>
      <h1 className="font-display font-bold text-2xl text-text-primary mb-6">
        Settings
      </h1>

      {/* Profile info */}
      <Card className="mb-6">
        <p className="text-sm font-body text-text-secondary">Signed in as</p>
        <p className="text-base font-body font-medium text-text-primary mt-1">
          {profile?.full_name || profile?.first_name || 'Player'}
        </p>
      </Card>

      {/* Sign out */}
      <Button
        variant="outline"
        fullWidth
        onClick={signOut}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </PageWrapper>
  );
}
