import { Outlet } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
