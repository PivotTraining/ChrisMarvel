import { Component } from 'react'
import { Activity } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
          <div className="text-center space-y-6 max-w-xs">
            <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto">
              <Activity size={28} className="text-danger" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-bold text-text-primary">Something went wrong</p>
              <p className="text-sm text-text-muted">The app hit an unexpected error. Try refreshing the page.</p>
            </div>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/' }}
              className="bg-blue hover:bg-blue-dark text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
