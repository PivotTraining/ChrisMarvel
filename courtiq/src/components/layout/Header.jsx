import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useOffline } from '../../context/OfflineContext';

export default function Header() {
  const { isOffline } = useOffline();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 bg-bg-surface border-b border-border-subtle">
      <div className="max-w-lg mx-auto h-full flex items-center justify-between px-4">
        {/* Wordmark */}
        <Link to="/" className="font-display font-bold text-2xl tracking-tight">
          <span className="text-text-primary">Court</span>
          <span className="text-accent-primary">IQ</span>
        </Link>

        {/* Right side: status dot + settings */}
        <div className="flex items-center gap-3">
          {/* Online / Offline indicator */}
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isOffline ? 'bg-yellow-400' : 'bg-green-400'
            }`}
            title={isOffline ? 'Offline' : 'Online'}
          />

          {/* Settings link */}
          <Link
            to="/settings"
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors duration-200"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
