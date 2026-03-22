import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { trackError } from './lib/monitoring'

// Catch unhandled errors
window.addEventListener('error', (event) => {
  trackError(event.error || event.message, { type: 'unhandled_error' })
})

window.addEventListener('unhandledrejection', (event) => {
  trackError(event.reason, { type: 'unhandled_rejection' })
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
