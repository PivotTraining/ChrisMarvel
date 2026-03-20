import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Log from './pages/Log'
import Train from './pages/Train'
import Profile from './pages/Profile'
import Landing from './pages/Landing'

const basename = import.meta.env.BASE_URL

export default function App() {
  // For now, show the app directly (auth comes in a later phase)
  const isApp = true

  if (!isApp) {
    return (
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="log" element={<Log />} />
          <Route path="train" element={<Train />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
