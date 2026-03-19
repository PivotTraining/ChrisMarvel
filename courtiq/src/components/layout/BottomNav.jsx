import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Target,
  Crosshair,
  Trophy,
  BookHeart,
} from 'lucide-react';

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/train', label: 'Train', icon: BookOpen },
  { to: '/drills', label: 'Drills', icon: Target },
  { to: '/shots', label: 'Shots', icon: Crosshair },
  { to: '/games', label: 'Games', icon: Trophy },
  { to: '/journal', label: 'Journal', icon: BookHeart },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-bg-surface border-t border-border-subtle">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 transition-colors duration-200 ${
                isActive ? 'text-accent-primary' : 'text-text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className="h-5 w-5"
                  fill={isActive ? 'currentColor' : 'none'}
                  strokeWidth={isActive ? 1.5 : 2}
                />
                <span className="text-[10px] font-body font-medium leading-tight">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
