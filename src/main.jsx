import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Initialize Capacitor native plugins on app start
async function initNative() {
  if (!window.Capacitor?.isNativePlatform?.()) return
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#0F1117' })
  } catch { /* web build — ignore */ }
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen')
    await SplashScreen.hide({ fadeOutDuration: 300 })
  } catch { /* web build — ignore */ }
}

initNative()

// Auto-reload when a new service worker takes control, so users on an
// already-open tab pick up fresh builds without a manual hard-refresh.
// Paired with workbox skipWaiting + clientsClaim in vite.config.js.
if ('serviceWorker' in navigator && !window.Capacitor?.isNativePlatform?.()) {
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
