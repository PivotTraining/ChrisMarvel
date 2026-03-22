import { useState, useEffect, useRef } from 'react';
import {
  Target, Trophy, TrendingUp, Zap, BarChart3, Users,
  ChevronRight, Star, Activity, Menu, X, ArrowRight,
  Crosshair, Flame, BookOpen, Award, Smartphone,
  ChevronDown, Shield, Brain, Check, Crown
} from 'lucide-react';

/* ─────────────────────────────────────────────
   SCROLL REVEAL HOOK
   ───────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function Reveal({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
   ───────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Site navigation" className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/70 backdrop-blur-2xl border-b border-border">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="font-sans text-2xl font-bold text-text-primary tracking-wider">COURTIQ</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-10">
          <a href="#features" className="text-text-secondary hover:text-white transition-colors text-[15px] font-medium">Features</a>
          <a href="#how-it-works" className="text-text-secondary hover:text-white transition-colors text-[15px] font-medium">How It Works</a>
          <a href="#pricing" className="text-text-secondary hover:text-white transition-colors text-[15px] font-medium">Pricing</a>
          <a href="#faq" className="text-text-secondary hover:text-white transition-colors text-[15px] font-medium">FAQ</a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a href="/login" className="text-text-secondary hover:text-white transition-colors text-sm font-medium">Log In</a>
          <a href="/signup" className="btn-glow bg-blue hover:bg-blue-dark text-white px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2">
            Get Early Access
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-text-primary p-2" aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-bg-card border-t border-border px-6 py-6 space-y-4">
          <a href="#features" onClick={() => setOpen(false)} className="block text-text-secondary hover:text-white text-lg">Features</a>
          <a href="#how-it-works" onClick={() => setOpen(false)} className="block text-text-secondary hover:text-white text-lg">How It Works</a>
          <a href="#pricing" onClick={() => setOpen(false)} className="block text-text-secondary hover:text-white text-lg">Pricing</a>
          <a href="#faq" onClick={() => setOpen(false)} className="block text-text-secondary hover:text-white text-lg">FAQ</a>
          <a href="/login" onClick={() => setOpen(false)} className="block text-text-secondary hover:text-white text-lg">Log In</a>
          <a href="/signup" onClick={() => setOpen(false)} className="block bg-blue text-white text-center px-6 py-3 rounded-full font-semibold mt-4">Get Early Access</a>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   HERO
   ───────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-glow rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-primary to-transparent" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-bg-card/80 border border-border rounded-full px-5 py-2 mb-6 animate-fade-in-up">
              <Zap className="w-4 h-4 text-blue" />
              <span className="text-text-secondary text-sm font-medium">AI-Powered Basketball Analytics</span>
            </div>

            <h1 className="font-sans text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[0.9] mb-6 tracking-tight anim-delay-1">
              UPGRADE<br />
              YOUR<br />
              <span className="gradient-text-blue">GAME.</span>
            </h1>

            <p className="text-text-secondary text-base lg:text-lg max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed anim-delay-2">
              Track every shot, log every game, follow elite drills, and watch your
              basketball skills transform. CourtIQ turns your phone into a personal
              development coach.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 anim-delay-3">
              <a href="/signup" className="btn-glow bg-blue hover:bg-blue-dark text-white px-8 py-3.5 rounded-full text-base font-bold flex items-center gap-2">
                Get Early Access
                <ChevronRight className="w-4 h-4" />
              </a>
              <a href="#features" className="text-text-secondary hover:text-white px-6 py-3.5 text-base font-medium transition-colors flex items-center gap-2">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right — Phone Mockup */}
          <div className="flex justify-center lg:justify-end anim-delay-2">
            <div className="phone-mockup w-[300px] lg:w-[340px] aspect-[9/19.5] animate-float">
              <div className="w-full h-full bg-bg-card p-5 flex flex-col">
                {/* Status bar */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-text-muted text-xs font-medium">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 bg-text-muted/30 rounded-sm" />
                    <div className="w-4 h-2 bg-text-muted/30 rounded-sm" />
                    <div className="w-6 h-2 bg-success rounded-sm" />
                  </div>
                </div>

                {/* App header */}
                <div className="mb-6">
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Today's Session</p>
                  <h3 className="font-sans text-2xl font-bold text-white">Shot Tracker</h3>
                </div>

                {/* Court visualization placeholder */}
                <div className="flex-1 bg-bg-primary/60 rounded-2xl p-4 mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Crosshair className="w-32 h-32 text-blue" />
                  </div>
                  {/* Shot dots */}
                  <div className="relative w-full h-full">
                    <div className="absolute top-[20%] left-[30%] w-3 h-3 bg-success rounded-full" />
                    <div className="absolute top-[35%] left-[60%] w-3 h-3 bg-success rounded-full" />
                    <div className="absolute top-[50%] left-[45%] w-3 h-3 bg-danger rounded-full" />
                    <div className="absolute top-[25%] left-[70%] w-3 h-3 bg-success rounded-full" />
                    <div className="absolute top-[60%] left-[25%] w-3 h-3 bg-danger rounded-full" />
                    <div className="absolute top-[40%] left-[40%] w-3 h-3 bg-success rounded-full" />
                    <div className="absolute top-[70%] left-[55%] w-3 h-3 bg-success rounded-full" />
                  </div>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-bg-primary/60 rounded-xl p-3 text-center">
                    <div className="text-success font-sans text-xl font-bold">72%</div>
                    <div className="text-text-muted text-[10px] uppercase tracking-wider">FG%</div>
                  </div>
                  <div className="bg-bg-primary/60 rounded-xl p-3 text-center">
                    <div className="text-blue font-sans text-xl font-bold">28</div>
                    <div className="text-text-muted text-[10px] uppercase tracking-wider">Shots</div>
                  </div>
                  <div className="bg-bg-primary/60 rounded-xl p-3 text-center">
                    <div className="text-gold font-sans text-xl font-bold">850</div>
                    <div className="text-text-muted text-[10px] uppercase tracking-wider">XP</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SOCIAL PROOF
   ───────────────────────────────────────────── */
function SocialProof() {
  return (
    <section className="py-12 border-y border-border bg-bg-section">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <p className="text-center text-text-muted text-xs uppercase tracking-[0.25em] mb-8 font-medium">
          As featured in
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 lg:gap-x-16 gap-y-6">
          {['TechCrunch', 'ESPN', 'WIRED', 'Fast Company', 'Bleacher Report'].map((name) => (
            <span key={name} className="font-sans text-lg lg:text-xl font-bold text-text-muted/30 tracking-widest uppercase hover:text-text-muted/50 transition-colors">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FEATURES
   ───────────────────────────────────────────── */
const featureSections = [
  {
    id: 'track',
    badge: 'Shot Tracking',
    badgeIcon: Crosshair,
    title: 'TRACK EVERY SHOT.',
    subtitle: 'FIND YOUR RANGE.',
    description: 'Log makes and misses across 11 court zones in real-time. CourtIQ builds a detailed shooting heatmap so you can see exactly where you dominate — and where you need work.',
    stats: [
      { label: 'Court Zones', value: '11' },
      { label: 'Shot Types', value: '6' },
      { label: 'Real-time', value: 'Yes' },
    ],
    reversed: false,
    mockupContent: (
      <div className="space-y-5">
        <div className="text-center mb-8">
          <p className="font-sans text-lg font-bold text-white">Shooting Heatmap</p>
          <p className="text-text-muted text-xs mt-1">Last 7 days</p>
        </div>
        {[
          { zone: 'Paint', pct: 78, color: 'bg-success' },
          { zone: 'Mid-Range L', pct: 52, color: 'bg-warning' },
          { zone: 'Mid-Range R', pct: 61, color: 'bg-blue' },
          { zone: 'Three-Pt L', pct: 38, color: 'bg-danger' },
          { zone: 'Three-Pt R', pct: 45, color: 'bg-warning' },
          { zone: 'Free Throw', pct: 85, color: 'bg-success' },
        ].map((z) => (
          <div key={z.zone}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-text-secondary">{z.zone}</span>
              <span className="text-white font-semibold">{z.pct}%</span>
            </div>
            <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
              <div className={`h-full ${z.color} rounded-full`} style={{ width: `${z.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'games',
    badge: 'Game Logger',
    badgeIcon: Trophy,
    title: 'LOG EVERY GAME.',
    subtitle: 'OWN YOUR STATS.',
    description: 'Full box scores — points, rebounds, assists, steals, blocks, turnovers. Rate your energy, effort, and performance after every game to track trends over time.',
    stats: [
      { label: 'Stat Categories', value: '20+' },
      { label: 'Performance Rating', value: '1-10' },
      { label: 'Trend Analysis', value: 'Auto' },
    ],
    reversed: true,
    mockupContent: (
      <div>
        <div className="text-center mb-8">
          <p className="font-sans text-lg font-bold text-white">Game Recap</p>
          <p className="text-text-muted text-xs mt-1">vs. Riverside Hawks</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'PTS', value: '24', color: 'text-blue' },
            { label: 'REB', value: '8', color: 'text-blue-dark' },
            { label: 'AST', value: '5', color: 'text-success' },
            { label: 'STL', value: '3', color: 'text-warning' },
            { label: 'BLK', value: '1', color: 'text-purple-400' },
            { label: 'FG%', value: '58', color: 'text-cyan-400' },
          ].map((s) => (
            <div key={s.label} className="bg-bg-primary/60 rounded-xl p-3 text-center">
              <div className={`font-sans text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-text-muted text-[10px] uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-bg-primary/60 rounded-xl p-3 flex items-center justify-between">
          <span className="text-text-muted text-xs">Performance</span>
          <div className="flex gap-1">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-gold fill-gold' : 'text-text-muted/30'}`} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'drills',
    badge: 'Drill Library',
    badgeIcon: Flame,
    title: 'LOVE THE GRIND.',
    subtitle: 'TRAIN WITH PURPOSE.',
    description: 'Browse 50+ curated drills organized by skill level and focus area — ball handling, shooting, footwork, defense. Save favorites and track your completion streaks.',
    stats: [
      { label: 'Drills', value: '50+' },
      { label: 'Skill Levels', value: '4' },
      { label: 'Focus Areas', value: '8' },
    ],
    reversed: false,
    mockupContent: (
      <div className="space-y-4">
        <div className="text-center mb-8">
          <p className="font-sans text-lg font-bold text-white">Today's Drills</p>
          <p className="text-text-muted text-xs mt-1">Ball Handling Focus</p>
        </div>
        {[
          { name: 'Crossover Series', time: '8 min', level: 'INT', done: true },
          { name: 'Between the Legs', time: '6 min', level: 'INT', done: true },
          { name: 'Hesitation Moves', time: '10 min', level: 'ADV', done: false },
          { name: 'Full Court Combos', time: '12 min', level: 'ADV', done: false },
        ].map((d) => (
          <div key={d.name} className={`flex items-center gap-3 p-3.5 rounded-xl ${d.done ? 'bg-success/10 border border-success/20' : 'bg-bg-primary/60'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${d.done ? 'bg-success' : 'bg-bg-section'}`}>
              {d.done ? <span className="text-white text-xs font-bold">&#10003;</span> : <Flame className="w-4 h-4 text-text-muted" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{d.name}</p>
              <p className="text-text-muted text-[10px] mt-0.5">{d.time} &middot; {d.level}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

function FeatureSection({ section }) {
  const { badge, badgeIcon: BadgeIcon, title, subtitle, description, stats, reversed, mockupContent } = section;

  return (
    <Reveal>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          {/* Text side */}
          <div>
            <div className="inline-flex items-center gap-2 bg-bg-card border border-border rounded-full px-4 py-1.5 mb-6">
              <BadgeIcon className="w-4 h-4 text-blue" />
              <span className="text-text-secondary text-sm font-medium">{badge}</span>
            </div>

            <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[0.95] mb-2 tracking-tight">
              {title}
            </h2>
            <h3 className="font-sans text-3xl md:text-4xl lg:text-5xl font-extrabold gradient-text-blue leading-[0.95] mb-6 tracking-tight">
              {subtitle}
            </h3>

            <p className="text-text-secondary text-base lg:text-lg leading-relaxed mb-8 max-w-lg">
              {description}
            </p>

            <div className="flex gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-sans text-2xl lg:text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-text-muted text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup side */}
          <div className="flex justify-center">
            <div className="phone-mockup w-[280px] lg:w-[320px] aspect-[9/19.5]">
              <div className="w-full h-full bg-bg-card p-6 lg:p-7 flex flex-col">
                {/* Notch */}
                <div className="w-24 h-5 bg-bg-primary rounded-full mx-auto mb-6" />
                <div className="flex-1 overflow-hidden px-1">
                  {mockupContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Features() {
  return (
    <section id="features" className="py-24 space-y-28">
      {featureSections.map((section) => (
        <FeatureSection key={section.id} section={section} />
      ))}
    </section>
  );
}

/* ─────────────────────────────────────────────
   HOW IT WORKS
   ───────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Smartphone,
      title: 'Create Your Profile',
      description: 'Set your position, skill level, dominant hand, and goals. CourtIQ tailors everything to you.',
    },
    {
      number: '02',
      icon: Target,
      title: 'Train & Track',
      description: 'Use CourtIQ during practice to log shots, run drills, record full game stats, and journal your sessions.',
    },
    {
      number: '03',
      icon: TrendingUp,
      title: 'Level Up',
      description: 'Watch your analytics evolve. Get personalized insights, earn XP and badges, and see exactly how far you\'ve come.',
    },
  ];

  return (
    <section id="how-it-works" className="min-h-screen flex items-center bg-bg-section relative">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-transparent to-bg-primary pointer-events-none" />
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 w-full py-32 lg:py-40">
        <Reveal>
          <div className="text-center mb-20">
            <h2 className="font-sans text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1] tracking-tight mb-5">
              HOW IT<br />
              <span className="gradient-text-blue">WORKS.</span>
            </h2>
            <p className="text-text-secondary text-base lg:text-lg max-w-md mx-auto">
              Simple to start. Powerful over time.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 100}>
              <div className="text-center lg:text-left card-hover bg-bg-card border border-border rounded-2xl p-6 lg:p-8 h-full">
                <div className="w-16 h-16 rounded-xl bg-blue-glow border border-blue-border flex items-center justify-center mx-auto lg:mx-0 mb-5">
                  <step.icon className="w-7 h-7 text-blue" />
                </div>
                <div className="font-sans text-xs font-bold text-blue tracking-widest mb-2">STEP {step.number}</div>
                <h3 className="font-sans text-xl lg:text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-text-secondary text-sm lg:text-base leading-relaxed">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PRICING SECTION
   ───────────────────────────────────────────── */
const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Everything you need to start tracking your game.',
    cta: 'Get Started',
    ctaStyle: 'bg-bg-section border border-border text-white hover:border-blue-border',
    highlight: false,
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
    cta: 'Start Free Trial',
    ctaStyle: 'btn-glow bg-blue hover:bg-blue-dark text-white',
    highlight: true,
    badge: 'Most Popular',
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
    ctaStyle: 'bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20',
    highlight: false,
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

function Pricing() {
  const [annual, setAnnual] = useState(false);

  function displayPrice(plan) {
    if (plan.price === '$0') return '$0'
    if (!annual) return plan.price
    const monthly = parseFloat(plan.price.replace('$', ''))
    const yearlyMonthly = (monthly * 10 / 12).toFixed(2)
    return `$${yearlyMonthly}`
  }

  return (
    <section id="pricing" className="min-h-screen flex items-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-glow rounded-full blur-[180px] opacity-50" />
      </div>
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 w-full py-32 lg:py-40">
        <Reveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-bg-card/80 border border-border rounded-full px-4 py-1.5 mb-6">
              <Crown className="w-4 h-4 text-gold" />
              <span className="text-text-secondary text-sm font-semibold">Simple Pricing</span>
            </div>
            <h2 className="font-sans text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1] tracking-tight mb-5">
              CHOOSE YOUR<br />
              <span className="gradient-text-blue">PLAN.</span>
            </h2>
            <p className="text-text-secondary text-base lg:text-lg max-w-lg mx-auto mb-8">
              Start free. Upgrade when you're ready to unlock advanced tools and team features.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 bg-bg-card border border-border rounded-full px-2 py-1.5">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  !annual ? 'bg-blue text-white' : 'text-text-secondary'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  annual ? 'bg-blue text-white' : 'text-text-secondary'
                }`}
              >
                Annual
                <span className="ml-1.5 text-[10px] text-success font-bold">-17%</span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-start">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 100}>
              <div className={`relative rounded-2xl p-6 lg:p-8 h-full ${
                plan.highlight
                  ? 'bg-bg-card border-2 border-blue ring-1 ring-blue/20 shadow-lg shadow-blue/10'
                  : 'bg-bg-card border border-border'
              }`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-lg">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-sans text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-text-muted text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-sans text-4xl lg:text-5xl font-extrabold text-white">
                      {displayPrice(plan)}
                    </span>
                    <span className="text-text-muted text-sm">{plan.period}</span>
                  </div>
                  {annual && plan.price !== '$0' && (
                    <p className="text-[11px] text-success mt-1 font-medium">
                      Billed annually (save 2 months)
                    </p>
                  )}
                </div>

                <a
                  href="/signup"
                  className={`block w-full py-3 rounded-xl text-center text-sm font-semibold transition-all mb-6 ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </a>

                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                        j === 0 && plan.name !== 'Free' ? 'text-blue' : 'text-success'
                      }`} />
                      <span className={`text-sm ${
                        j === 0 && plan.name !== 'Free'
                          ? 'font-semibold text-text-primary'
                          : 'text-text-secondary'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom note */}
        <Reveal>
          <div className="text-center mt-12">
            <p className="text-text-muted text-sm">
              All plans include a <span className="text-white font-medium">14-day free trial</span> of Pro features. No credit card required.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FAQ SECTION
   ───────────────────────────────────────────── */
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'Is CourtIQ free to use?',
      a: 'Yes! CourtIQ is free forever with core features including shot tracking, game logging, analytics, and the drill library. Pro ($7.99/mo) unlocks unlimited drills, AI insights, and advanced analytics. Team ($19.99/mo) adds roster management and coach tools.',
    },
    {
      q: 'What devices does CourtIQ support?',
      a: 'CourtIQ is designed as a mobile-first experience for iOS and Android. A web dashboard for deeper analytics is coming soon.',
    },
    {
      q: 'How does shot tracking work?',
      a: 'During practice, tap the court zone where you took a shot and mark it as a make or miss. CourtIQ builds a real-time heatmap and tracks your percentages across 11 zones.',
    },
    {
      q: 'Can my coach see my stats?',
      a: 'With CourtIQ+ Team Features, you can share your profile and stats with coaches, trainers, and teammates. You control exactly what\'s visible.',
    },
    {
      q: 'When does CourtIQ launch?',
      a: 'We\'re currently in closed beta. Join the waitlist to get early access and be among the first to try CourtIQ when we launch.',
    },
  ];

  return (
    <section id="faq" className="py-32 lg:py-40">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-white leading-[0.95] tracking-tight mb-3">
              <span className="gradient-text-blue">FAQ</span>
            </h2>
            <p className="text-text-secondary text-base">
              Common questions about CourtIQ.
            </p>
          </div>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-white font-semibold text-base pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-text-muted flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <div className={`faq-content ${openIndex === i ? 'open' : ''}`}>
                <p className="px-6 pb-5 text-text-secondary text-base leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   STATS BAR
   ───────────────────────────────────────────── */
function StatsBar() {
  return (
    <section className="py-28 lg:py-32 border-y border-border bg-bg-section">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {[
              { value: '11', label: 'Court Zones Tracked' },
              { value: '50+', label: 'Curated Drills' },
              { value: '20+', label: 'Stats Per Game' },
              { value: '100%', label: 'Free to Start' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-sans text-4xl lg:text-5xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-text-muted text-xs lg:text-sm uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CTA / WAITLIST
   ───────────────────────────────────────────── */
function Waitlist() {
  return (
    <section id="waitlist" className="min-h-screen flex items-center relative overflow-hidden bg-bg-section">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-glow rounded-full blur-[200px]" />
      </div>
      <div className="relative max-w-[800px] mx-auto px-6 lg:px-10 w-full py-32 lg:py-40 text-center">
        <Reveal>
          <h2 className="font-sans text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1] tracking-tight mb-6">
            READY TO<br />
            <span className="gradient-text-blue">LEVEL UP?</span>
          </h2>
          <p className="text-text-secondary text-base lg:text-lg max-w-md mx-auto mb-12">
            Join the waitlist to get early access when CourtIQ launches.
            Be the first to start tracking your game.
          </p>

          <form
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
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
              placeholder="Enter your email address"
              className="flex-1 bg-bg-primary/80 border border-border rounded-full px-6 py-3.5 text-white placeholder:text-text-muted text-sm focus:outline-none focus:border-blue transition-colors"
            />
            <button
              type="submit"
              className="btn-glow bg-blue hover:bg-blue-dark text-white px-8 py-3.5 rounded-full text-sm font-bold whitespace-nowrap flex items-center justify-center gap-2"
            >
              Join Waitlist
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-text-muted text-xs mt-5">Free to join. No spam. Unsubscribe anytime.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border bg-bg-section">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="font-sans text-xl font-bold text-white tracking-wider">COURTIQ</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              AI-powered basketball analytics for players, coaches, and programs. Track, train, and transform your game.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-sans text-sm font-bold text-white uppercase tracking-widest mb-5">Product</h4>
            <ul className="space-y-3">
              {['Shot Tracking', 'Game Logger', 'Drill Library', 'Analytics', 'CourtIQ+'].map((item) => (
                <li key={item}><a href="#features" className="text-text-muted hover:text-white text-sm transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-sans text-sm font-bold text-white uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Press', 'Contact'].map((item) => (
                <li key={item}><a href="#" className="text-text-muted hover:text-white text-sm transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-sans text-sm font-bold text-white uppercase tracking-widest mb-5">Support</h4>
            <ul className="space-y-3">
              <li><a href="#faq" className="text-text-muted hover:text-white text-sm transition-colors">Help Center</a></li>
              <li><a href="#faq" className="text-text-muted hover:text-white text-sm transition-colors">FAQ</a></li>
              <li><a href="/privacy" className="text-text-muted hover:text-white text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-text-muted hover:text-white text-sm transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">&copy; {new Date().getFullYear()} CourtIQ. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Twitter', 'Instagram', 'TikTok'].map((social) => (
              <a key={social} href="#" className="text-text-muted hover:text-white text-sm transition-colors">{social}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   APP
   ───────────────────────────────────────────── */
export default function App() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <HowItWorks />
      <Pricing />
      <StatsBar />
      <FAQ />
      <Waitlist />
      <Footer />
    </div>
  );
}
