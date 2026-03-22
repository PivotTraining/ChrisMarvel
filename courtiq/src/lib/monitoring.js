/**
 * Lightweight monitoring / analytics module.
 * - Development: logs to console
 * - Production: batches errors and events, sends to a configurable endpoint
 */

const IS_PROD = import.meta.env.PROD
const ANALYTICS_ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT

// Error tracking with context
const errorBuffer = []
let errorFlushTimer = null

export function trackError(error, context = {}) {
  const entry = {
    message: error?.message || String(error),
    stack: error?.stack,
    context,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  }

  if (!IS_PROD) {
    console.error('[CourtIQ Error]', entry)
    return
  }

  errorBuffer.push(entry)
  if (!errorFlushTimer) {
    errorFlushTimer = setTimeout(flushErrors, 5000)
  }
}

function flushErrors() {
  if (errorBuffer.length === 0) return
  const batch = errorBuffer.splice(0)
  errorFlushTimer = null

  if (ANALYTICS_ENDPOINT) {
    navigator.sendBeacon?.(
      `${ANALYTICS_ENDPOINT}/errors`,
      JSON.stringify({ errors: batch })
    ) || fetch(`${ANALYTICS_ENDPOINT}/errors`, {
      method: 'POST',
      body: JSON.stringify({ errors: batch }),
      keepalive: true,
    }).catch(() => {})
  }
}

// Analytics event tracking with batching
const eventBuffer = []
let eventFlushTimer = null

export function trackEvent(name, properties = {}) {
  const entry = {
    event: name,
    properties,
    timestamp: new Date().toISOString(),
    url: window.location.pathname,
  }

  if (!IS_PROD) {
    console.log('[CourtIQ Event]', name, properties)
    return
  }

  eventBuffer.push(entry)
  if (!eventFlushTimer) {
    eventFlushTimer = setTimeout(flushEvents, 10000)
  }
}

function flushEvents() {
  if (eventBuffer.length === 0) return
  const batch = eventBuffer.splice(0)
  eventFlushTimer = null

  if (ANALYTICS_ENDPOINT) {
    navigator.sendBeacon?.(
      `${ANALYTICS_ENDPOINT}/events`,
      JSON.stringify({ events: batch })
    ) || fetch(`${ANALYTICS_ENDPOINT}/events`, {
      method: 'POST',
      body: JSON.stringify({ events: batch }),
      keepalive: true,
    }).catch(() => {})
  }
}

// Page view tracking
export function trackPageView(path) {
  trackEvent('page_view', { path })
}

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushErrors()
      flushEvents()
    }
  })
}
