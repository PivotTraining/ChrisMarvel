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

// Register PWA service worker on web only — skip on native iOS/Android
// where it interferes with Capacitor's WKWebView asset handler.
//
// IMPORTANT: the previous version listened for `controllerchange` and
// reloaded unconditionally. On a first visit (no SW previously controlling
// the page) workbox's `clientsClaim` fires controllerchange immediately,
// which caused the page to reload itself forever — the "spinning forever"
// loading bug. We now:
//   1. Only reload if a SW was already controlling the page at startup
//      (i.e. this is a returning user with a stale bundle, not a first-
//      time visit where the SW is just taking over for the first time)
//   2. Hard-kill the reload loop with a sessionStorage guard
if (!window.Capacitor?.isNativePlatform?.()) {
  const hadControllerAtStartup = !!navigator.serviceWorker?.controller

  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true })
  }).catch(() => {})

  let refreshing = false
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (!hadControllerAtStartup) return // first install — no need to reload
    if (refreshing) return
    if (sessionStorage.getItem('courtiq_sw_reloaded') === '1') return
    refreshing = true
    sessionStorage.setItem('courtiq_sw_reloaded', '1')
    window.location.reload()
  })

  // Clear the reload guard after a successful load so the next real update
  // can reload once. Runs on the next tick after the app mounts.
  window.addEventListener('load', () => {
    setTimeout(() => sessionStorage.removeItem('courtiq_sw_reloaded'), 2000)
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
