import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { useOffline } from '../../context/OfflineContext'

export default function Header() {
  const { isOnline } = useOffline()

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
      style={{
        backgroundColor: '#13131A',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <h1
        className="text-xl tracking-wide"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
      >
        Court<span style={{ color: '#F97316' }}>IQ</span>
      </h1>

      <div className="flex items-center gap-3">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          title={isOnline ? 'Online' : 'Offline'}
          style={{ backgroundColor: isOnline ? '#22C55E' : '#EAB308' }}
        />
        <Link to="/settings" className="text-slate-400 hover:text-white transition-colors">
          <Settings size={20} />
        </Link>
      </div>
    </header>
  )
}
