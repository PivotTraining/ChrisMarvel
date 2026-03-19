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
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{
        backgroundColor: '#13131A',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className="flex flex-col items-center gap-0.5 px-2 py-1"
        >
          {({ isActive }) => (
            <>
              <Icon
                size={22}
                className="transition-colors duration-200"
                style={{
                  color: isActive ? '#F97316' : '#94A3B8',
                  fill: isActive ? '#F97316' : 'none',
                }}
              />
              <span
                className="text-[10px] font-medium transition-all duration-200"
                style={{
                  color: isActive ? '#F97316' : '#94A3B8',
                  opacity: isActive ? 1 : 0,
                  maxHeight: isActive ? '1rem' : '0',
                  overflow: 'hidden',
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
