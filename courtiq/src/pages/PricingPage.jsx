import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Crown, Zap, Users, Shield } from 'lucide-react'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Everything you need to start tracking your game.',
    cta: 'Current Plan',
    ctaDisabled: true,
    highlight: false,
    icon: Zap,
    iconColor: 'text-blue',
    iconBg: 'bg-blue/10 border-blue-border',
    features: [
      'Game logging with full box score',
      'Shot tracking (11 court zones)',
      'Up to 50 drill sessions',
      'Basic analytics & averages',
      'Journal & goal tracking',
      'Drill library access',
      'Dark & light theme',
      'Offline mode (PWA)',
    ],
  },
  {
    name: 'Pro',
    price: '$7.99',
    period: '/month',
    description: 'Unlock the full toolkit to elevate your training.',
    cta: 'Upgrade to Pro',
    ctaDisabled: false,
    highlight: true,
    badge: 'Most Popular',
    icon: Crown,
    iconColor: 'text-gold',
    iconBg: 'bg-gold/10 border-gold/20',
    features: [
      'Everything in Free, plus:',
      'Unlimited drill sessions',
      'Advanced analytics & trends',
      'Shot heatmap & zone breakdowns',
      'AI-powered game insights',
      'Workout templates (unlimited)',
      'Data export (CSV & JSON)',
      'Shareable stat cards',
      'Priority support',
    ],
  },
  {
    name: 'Team',
    price: '$19.99',
    period: '/month',
    description: 'Built for coaches, trainers, and organized teams.',
    cta: 'Contact Sales',
    ctaDisabled: false,
    highlight: false,
    icon: Users,
    iconColor: 'text-success',
    iconBg: 'bg-success/10 border-success/20',
    features: [
      'Everything in Pro, plus:',
      'Up to 25 player profiles',
      'Team dashboard & roster',
      'Coach view & permissions',
      'Player comparison tools',
      'Team leaderboards',
      'Recruiting profile pages',
      'Custom branding',
      'Dedicated account manager',
    ],
  },
]

const COMPARISON = [
  { feature: 'Game Logging', free: true, pro: true, team: true },
  { feature: 'Shot Tracking', free: '11 zones', pro: '11 zones', team: '11 zones' },
  { feature: 'Drill Sessions', free: '50', pro: 'Unlimited', team: 'Unlimited' },
  { feature: 'Analytics', free: 'Basic', pro: 'Advanced', team: 'Advanced + Team' },
  { feature: 'Shot Heatmap', free: false, pro: true, team: true },
  { feature: 'AI Game Insights', free: false, pro: true, team: true },
  { feature: 'Workout Templates', free: '3', pro: 'Unlimited', team: 'Unlimited' },
  { feature: 'Data Export', free: false, pro: true, team: true },
  { feature: 'Shareable Stats', free: false, pro: true, team: true },
  { feature: 'Schedule Planner', free: true, pro: true, team: true },
  { feature: 'Goals & Streaks', free: true, pro: true, team: true },
  { feature: 'Journal', free: true, pro: true, team: true },
  { feature: 'Team Roster', free: false, pro: false, team: '25 players' },
  { feature: 'Coach View', free: false, pro: false, team: true },
  { feature: 'Leaderboards', free: false, pro: false, team: true },
  { feature: 'Recruiting Profile', free: false, pro: false, team: true },
  { feature: 'Custom Branding', free: false, pro: false, team: true },
  { feature: 'Support', free: 'Community', pro: 'Priority', team: 'Dedicated' },
]

export default function PricingPage() {
  const navigate = useNavigate()
  const [annual, setAnnual] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  function displayPrice(plan) {
    if (plan.price === '$0') return '$0'
    if (!annual) return plan.price
    const monthly = parseFloat(plan.price.replace('$', ''))
    return `$${(monthly * 10 / 12).toFixed(2)}`
  }

  function renderValue(val) {
    if (val === true) return <Check size={16} className="text-success mx-auto" />
    if (val === false) return <span className="text-text-muted">—</span>
    return <span className="text-text-secondary text-xs">{val}</span>
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Pricing</h1>
            <p className="text-sm text-text-muted">Choose the plan that fits your game.</p>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-bg-card border border-border rounded-xl p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                !annual ? 'bg-blue text-white' : 'text-text-secondary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                annual ? 'bg-blue text-white' : 'text-text-secondary'
              }`}
            >
              Annual <span className="text-[10px] text-success font-bold ml-1">-17%</span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {PLANS.map(plan => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-5 ${
                  plan.highlight
                    ? 'bg-bg-card border-2 border-blue ring-1 ring-blue/20'
                    : 'bg-bg-card border border-border'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="bg-blue text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className={`w-10 h-10 rounded-xl ${plan.iconBg} border flex items-center justify-center mb-3`}>
                  <Icon size={20} className={plan.iconColor} />
                </div>

                <h3 className="text-lg font-bold text-text-primary">{plan.name}</h3>
                <p className="text-xs text-text-muted mb-3">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-extrabold text-text-primary">{displayPrice(plan)}</span>
                  <span className="text-text-muted text-xs">{plan.period}</span>
                </div>
                {annual && plan.price !== '$0' && (
                  <p className="text-[10px] text-success font-medium -mt-3 mb-4">Save 2 months with annual billing</p>
                )}

                <button
                  disabled={plan.ctaDisabled}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all mb-4 ${
                    plan.ctaDisabled
                      ? 'bg-bg-section border border-border text-text-muted cursor-default'
                      : plan.highlight
                        ? 'bg-blue hover:bg-blue-dark text-white'
                        : 'bg-bg-section border border-border text-text-primary hover:border-blue-border'
                  }`}
                >
                  {plan.cta}
                </button>

                <ul className="space-y-2">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check size={14} className={`shrink-0 mt-0.5 ${
                        j === 0 && plan.name !== 'Free' ? 'text-blue' : 'text-success'
                      }`} />
                      <span className={`text-xs ${
                        j === 0 && plan.name !== 'Free' ? 'font-semibold text-text-primary' : 'text-text-secondary'
                      }`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Comparison Toggle */}
        <div className="text-center mb-4">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="text-sm text-blue font-medium hover:text-blue-dark transition-colors"
          >
            {showComparison ? 'Hide' : 'View'} full feature comparison
          </button>
        </div>

        {/* Feature Comparison Table */}
        {showComparison && (
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-text-muted font-medium uppercase tracking-wider">Feature</th>
                    <th className="text-center px-3 py-3 text-text-muted font-medium uppercase tracking-wider">Free</th>
                    <th className="text-center px-3 py-3 text-blue font-semibold uppercase tracking-wider">Pro</th>
                    <th className="text-center px-3 py-3 text-text-muted font-medium uppercase tracking-wider">Team</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-bg-section/50' : ''}>
                      <td className="px-4 py-2.5 text-text-primary font-medium">{row.feature}</td>
                      <td className="px-3 py-2.5 text-center">{renderValue(row.free)}</td>
                      <td className="px-3 py-2.5 text-center">{renderValue(row.pro)}</td>
                      <td className="px-3 py-2.5 text-center">{renderValue(row.team)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bottom note */}
        <div className="text-center pb-8">
          <p className="text-text-muted text-xs">
            All plans include a <span className="text-text-primary font-medium">14-day free trial</span> of Pro features. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-text-muted text-[10px]">
            <Shield size={10} />
            <span>Cancel anytime. No hidden fees.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
