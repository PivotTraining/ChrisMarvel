import { NavLink } from 'react-router-dom'
import { Home, ClipboardList, Target, BarChart3, User } from 'lucide-react'
import { hapticSelection } from '../lib/native'

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Log', path: '/log', icon: ClipboardList },
  { label: 'Train', path: '/train', icon: Target },
  { label: 'Stats', path: '/analytics', icon: BarChart3 },
  { label: 'Profile', path: '/profile', icon: User },
]

export default function BottomNav() {
  return (
    <nav aria-label="Main navigation" role="navigation" className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-primary/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-center justify-around px-1 py-2" role="list">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onClick={() => hapticSelection()}
            aria-label={label}
            role="listitem"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors duration-200 ${
                isActive
                  ? 'text-blue'
                  : 'text-text-muted hover:text-text-secondary'
              }`
            }
          >
            <Icon size={21} aria-hidden="true" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
