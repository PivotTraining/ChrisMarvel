/**
 * Lightweight monitoring / analytics module.
 * Logs to the console in development and exposes a simple API
 * that can be wired to any third-party service (Sentry, Amplitude, etc.)
 * without changing call-sites.
 */

const isDev = import.meta.env.DEV

/**
 * Track a named event with optional properties.
 * @param {string} name  - Event name, e.g. "workout_completed"
 * @param {Record<string, any>} [properties] - Arbitrary metadata
 */
export function trackEvent(name, properties = {}) {
  if (isDev) {
    console.log(
      `%c[event] ${name}`,
      'color: #60a5fa; font-weight: bold;',
      properties
    )
  }

  // TODO: wire to analytics provider
  // e.g. posthog.capture(name, properties)
}

/**
 * Track an error with optional context.
 * @param {Error} error
 * @param {Record<string, any>} [context] - Extra info (component, userId, etc.)
 */
export function trackError(error, context = {}) {
  if (isDev) {
    console.error(
      `%c[error] ${error.message}`,
      'color: #f87171; font-weight: bold;',
      { error, ...context }
    )
  }

  // TODO: wire to error-tracking provider
  // e.g. Sentry.captureException(error, { extra: context })
}

/**
 * Track a page view.
 * @param {string} path - The route path, e.g. "/analytics"
 */
export function trackPageView(path) {
  if (isDev) {
    console.log(
      `%c[pageview] ${path}`,
      'color: #a78bfa; font-weight: bold;'
    )
  }

  // TODO: wire to analytics provider
  // e.g. posthog.capture('$pageview', { path })
}
