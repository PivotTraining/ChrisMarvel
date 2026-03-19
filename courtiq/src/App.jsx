import { Target, Trophy, TrendingUp, Zap, BarChart3, Users, ChevronRight, Star, Activity } from 'lucide-react';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border-subtle">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-text-primary tracking-wide">COURTIQ</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-text-secondary hover:text-text-primary transition-colors text-sm">Features</a>
          <a href="#how-it-works" className="text-text-secondary hover:text-text-primary transition-colors text-sm">How It Works</a>
          <a href="#stats" className="text-text-secondary hover:text-text-primary transition-colors text-sm">Stats</a>
        </div>
        <a href="#waitlist" className="bg-accent-primary hover:bg-accent-primary-hover text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
          Join Waitlist
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 bg-bg-surface border border-border-subtle rounded-full px-4 py-1.5 mb-8">
          <Zap className="w-4 h-4 text-accent-primary" />
          <span className="text-text-secondary text-sm">Built for serious ballers</span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-text-primary leading-tight mb-6 tracking-tight">
          ELEVATE YOUR<br />
          <span className="text-accent-primary">BASKETBALL</span> GAME
        </h1>

        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Track shots, log games, follow drills, and journal your progress.
          CourtIQ is the all-in-one platform for basketball player development.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#waitlist" className="bg-accent-primary hover:bg-accent-primary-hover text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
            Get Early Access
            <ChevronRight className="w-4 h-4" />
          </a>
          <a href="#features" className="bg-bg-surface hover:bg-bg-surface-hover border border-border-subtle text-text-primary px-8 py-3.5 rounded-xl text-base font-semibold transition-colors w-full sm:w-auto text-center">
            See Features
          </a>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Target,
    title: 'Shot Tracking',
    description: 'Track makes and misses across 11 court zones in real-time. See your shooting percentages and identify weak spots.',
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/10',
  },
  {
    icon: Trophy,
    title: 'Game Logging',
    description: 'Log full box scores — points, rebounds, assists, steals, blocks. Rate your energy and performance after every game.',
    color: 'text-accent-secondary',
    bg: 'bg-accent-secondary/10',
  },
  {
    icon: BarChart3,
    title: 'Drill Library',
    description: 'Browse curated drills by skill level and focus area. Save your favorites and track completion streaks.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Visualize your improvement over time with detailed stats, shooting heatmaps, and performance trends.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: Star,
    title: 'XP & Badges',
    description: 'Earn experience points and unlock badges as you train. Stay motivated with weekly challenges and streak rewards.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: Users,
    title: 'Player Journal',
    description: 'Reflect on your sessions, set goals, and track your mindset. Build the mental game alongside the physical.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
];

function Features() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-4">
            EVERYTHING YOU NEED TO <span className="text-accent-primary">LEVEL UP</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            One app to track every aspect of your basketball development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-bg-surface border border-border-subtle rounded-2xl p-6 hover:border-border-active transition-colors group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { number: '01', title: 'Sign Up', description: 'Create your profile and set your position, skill level, and goals.' },
  { number: '02', title: 'Train & Track', description: 'Use CourtIQ during practice to log shots, run drills, and record games.' },
  { number: '03', title: 'Review & Improve', description: 'Analyze your stats, identify weaknesses, and follow personalized recommendations.' },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-bg-surface/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-4">
            HOW IT <span className="text-accent-primary">WORKS</span>
          </h2>
          <p className="text-text-secondary text-lg">Simple to start. Powerful over time.</p>
        </div>

        <div className="space-y-8">
          {steps.map((step, i) => (
            <div key={step.number} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center">
                <span className="font-display text-xl font-bold text-accent-primary">{step.number}</span>
              </div>
              <div className="pt-1">
                <h3 className="font-display text-2xl font-bold text-text-primary mb-1">{step.title}</h3>
                <p className="text-text-muted text-base leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="w-px h-8 bg-border-subtle ml-1 mt-4" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section id="stats" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '11', label: 'Court Zones Tracked' },
            { value: '50+', label: 'Curated Drills' },
            { value: '20+', label: 'Stats Per Game' },
            { value: '100%', label: 'Free to Start' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-bg-surface border border-border-subtle rounded-2xl">
              <div className="font-display text-4xl md:text-5xl font-bold text-accent-primary mb-2">{stat.value}</div>
              <div className="text-text-muted text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Waitlist() {
  return (
    <section id="waitlist" className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              READY TO <span className="text-accent-primary">LEVEL UP</span>?
            </h2>
            <p className="text-text-secondary text-base mb-8 max-w-md mx-auto">
              Join the waitlist to get early access when CourtIQ launches. Be the first to start tracking your game.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                const email = e.target.elements.email.value;
                if (email) {
                  alert('Thanks for signing up! We\'ll be in touch.');
                  e.target.reset();
                }
              }}
            >
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-primary transition-colors"
              />
              <button
                type="submit"
                className="bg-accent-primary hover:bg-accent-primary-hover text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-border-subtle">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-sm font-bold text-text-primary tracking-wide">COURTIQ</span>
        </div>
        <p className="text-text-muted text-sm">&copy; {new Date().getFullYear()} CourtIQ. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Waitlist />
      <Footer />
    </div>
  );
}
