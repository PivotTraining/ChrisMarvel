import { Component } from 'react'
import { Activity, WifiOff, RefreshCw } from 'lucide-react'
import { trackError } from '../lib/monitoring'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })

    // Structured console logging
    trackError(error, {
      component: errorInfo?.componentStack,
      boundary: this.props.name || 'root',
    })

    // TODO: Send to Sentry when configured
    // Sentry.captureException(error, {
    //   extra: {
    //     componentStack: errorInfo?.componentStack,
    //     boundary: this.props.name || 'root',
    //   },
    // })
  }

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleRefresh = () => {
    window.location.href = '/'
  }

  isNetworkError() {
    const { error } = this.state
    if (!error) return false
    const msg = (error.message || '').toLowerCase()
    return (
      msg.includes('fetch') ||
      msg.includes('network') ||
      msg.includes('failed to load') ||
      msg.includes('timeout') ||
      msg.includes('cors') ||
      error.name === 'TypeError' && msg.includes('failed')
    )
  }

  render() {
    if (this.state.hasError) {
      const isNetwork = this.isNetworkError()

      return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
          <div className="text-center space-y-6 max-w-xs">
            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
                isNetwork
                  ? 'bg-warning/10 border border-warning/20'
                  : 'bg-danger/10 border border-danger/20'
              }`}
            >
              {isNetwork ? (
                <WifiOff size={28} className="text-warning" />
              ) : (
                <Activity size={28} className="text-danger" />
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <p className="text-lg font-bold text-text-primary">
                {isNetwork ? 'Connection problem' : 'Something went wrong'}
              </p>
              <p className="text-sm text-text-muted">
                {isNetwork
                  ? 'Could not reach the server. Check your internet connection and try again.'
                  : 'The app hit an unexpected error. You can try again or refresh the page.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleTryAgain}
                className="flex items-center justify-center gap-2 bg-blue hover:bg-blue-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <button
                onClick={this.handleRefresh}
                className="text-sm text-text-muted hover:text-text-secondary transition-colors"
              >
                Refresh page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
