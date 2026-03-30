import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Target, Crosshair, Trophy, BookHeart } from 'lucide-react'

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/training', icon: BookOpen, label: 'Train' },
  { to: '/drills', icon: Target, label: 'Drills' },
  { to: '/shots', icon: Crosshair, label: 'Shots' },
  { to: '/games', icon: Trophy, label: 'Games' },
  { to: '/journal', icon: BookHeart, label: 'Journal' },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        backgroundColor: 'rgba(19, 19, 26, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '0.5rem 0.25rem',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
    >
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5"
          style={{ textDecoration: 'none', minWidth: '3rem' }}
        >
          {({ isActive }) => (
            <>
              <Icon
                size={21}
                className="transition-colors duration-200"
                style={{
                  color: isActive ? '#F97316' : '#64748B',
                  fill: isActive ? '#F97316' : 'none',
                }}
              />
              <span
                className="font-medium transition-all duration-200"
                style={{
                  fontSize: '0.625rem',
                  color: isActive ? '#F97316' : '#64748B',
                  opacity: isActive ? 1 : 0.7,
                  letterSpacing: '0.01em',
                }}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
