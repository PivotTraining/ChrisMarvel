import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ArrowRight, ClipboardList, Target, BarChart3, Flame } from 'lucide-react'

const STEPS = [
  {
    title: 'Welcome to CourtIQ!',
    description: 'Your personal basketball performance tracker. Let\'s take a quick tour of the key features.',
    icon: Flame,
    color: 'text-gold',
    bg: 'bg-gold/10 border-gold/20',
  },
  {
    title: 'Log Your Games',
    description: 'Track every game with full stats — points, rebounds, assists, shooting splits, and more.',
    icon: ClipboardList,
    color: 'text-blue',
    bg: 'bg-blue/10 border-blue-border',
    action: { label: 'Go to Game Log', path: '/log' },
  },
  {
    title: 'Train & Improve',
    description: 'Log drills, use the timer, and save workout templates to stay consistent.',
    icon: Target,
    color: 'text-success',
    bg: 'bg-success/10 border-success/20',
    action: { label: 'Go to Training', path: '/train' },
  },
  {
    title: 'Track Your Progress',
    description: 'View analytics, shot heatmaps, scoring trends, and personal records over time.',
    icon: BarChart3,
    color: 'text-blue',
    bg: 'bg-blue/10 border-blue-border',
    action: { label: 'View Analytics', path: '/analytics' },
  },
]

const STORAGE_KEY = 'courtiq-tour-completed'

export default function OnboardingTour() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const completed = localStorage.getItem(STORAGE_KEY)
      if (!completed) {
        // Small delay so it doesn't flash on load
        const timer = setTimeout(() => setVisible(true), 800)
        return () => clearTimeout(timer)
      }
    } catch {}
  }, [])

  function dismiss() {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {}
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      dismiss()
    }
  }

  function handleAction(path) {
    dismiss()
    navigate(path)
  }

  if (!visible) return null

  const current = STEPS[step]
  const Icon = current.icon
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center px-4 pb-24 sm:pb-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismiss} />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-bg-card border border-border rounded-2xl shadow-2xl animate-fade-in-up overflow-hidden">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-text-muted hover:text-text-primary transition-colors z-10"
          aria-label="Close tour"
        >
          <X size={16} />
        </button>

        <div className="p-6 space-y-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl ${current.bg} border flex items-center justify-center`}>
            <Icon size={24} className={current.color} />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-text-primary">{current.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{current.description}</p>
          </div>

          {/* Action button */}
          {current.action && (
            <button
              onClick={() => handleAction(current.action.path)}
              className="text-xs font-medium text-blue hover:text-blue-dark transition-colors"
            >
              {current.action.label} →
            </button>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            {/* Progress dots */}
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === step ? 'bg-blue w-5' : i < step ? 'bg-blue/40' : 'bg-bg-section border border-border'
                  }`}
                />
              ))}
            </div>

            {/* Next / Done */}
            <button
              onClick={next}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue text-white text-xs font-semibold hover:bg-blue-dark transition-colors active:scale-95"
            >
              {isLast ? 'Get Started' : 'Next'}
              {!isLast && <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
