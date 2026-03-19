import { useState } from 'react';
import {
  Target, Trophy, TrendingUp, Zap, BarChart3, Users,
  ChevronRight, Star, Activity, Menu, X, ArrowRight,
  Crosshair, Flame, BookOpen, Award, Smartphone
} from 'lucide-react';

/* ─────────────────────────────────────────────
   NAVBAR
   ───────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/70 backdrop-blur-2xl border-b border-border-subtle">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-text-primary tracking-wider">COURTIQ</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-10">
          <a href="#features" className="text-text-secondary hover:text-white transition-colors text-[15px] font-medium">Features</a>
          <a href="#how-it-works" className="text-text-secondary hover:text-white transition-colors text-[15px] font-medium">How It Works</a>
          <a href="#premium" className="text-text-secondary hover:text-white transition-colors text-[15px] font-medium">Premium</a>
          <a href="#press" className="text-text-secondary hover:text-white transition-colors text-[15px] font-medium">Press</a>
        </div>

        {/* Desktop CTA */}
        <a href="#waitlist" className="hidden lg:flex bg-accent-primary hover:bg-accent-primary-hover text-white px-7 py-3 rounded-full text-[15px] font-semibold transition-all hover:shadow-lg hover:shadow-accent-primary/20 items-center gap-2">
          Get Early Access
          <ArrowRight className="w-4 h-4" />
        </a>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-text-primary p-2">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-bg-surface border-t border-border-subtle px-6 py-6 space-y-4">
          <a href="#features" onClick={() => setOpen(false)} className="block text-text-secondary hover:text-white text-lg">Features</a>
          <a href="#how-it-works" onClick={() => setOpen(false)} className="block text-text-secondary hover:text-white text-lg">How It Works</a>
          <a href="#premium" onClick={() => setOpen(false)} className="block text-text-secondary hover:text-white text-lg">Premium</a>
          <a href="#press" onClick={() => setOpen(false)} className="block text-text-secondary hover:text-white text-lg">Press</a>
          <a href="#waitlist" onClick={() => setOpen(false)} className="block bg-accent-primary text-white text-center px-6 py-3 rounded-full font-semibold mt-4">Get Early Access</a>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   HERO — Full viewport, massive type, phone mockup
   ───────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-primary/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-primary to-transparent" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left — Copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-bg-surface/80 border border-border-subtle rounded-full px-5 py-2 mb-8 animate-fade-in-up">
              <Zap className="w-4 h-4 text-accent-primary" />
              <span className="text-text-secondary text-sm font-medium">AI-Powered Player Development</span>
            </div>

            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-[6.5rem] font-extrabold text-white leading-[0.9] mb-8 tracking-tight animate-fade-in-up-delay-1">
              UPGRADE<br />
              YOUR<br />
              <span className="gradient-text">GAME.</span>
            </h1>

            <p className="text-text-secondary text-lg lg:text-xl max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-in-up-delay-2">
              Track every shot, log every game, follow elite drills, and watch your
              basketball skills transform. CourtIQ turns your phone into a personal
              development coach.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 animate-fade-in-up-delay-3">
              <a href="#waitlist" className="bg-accent-primary hover:bg-accent-primary-hover text-white px-10 py-4 rounded-full text-lg font-bold transition-all hover:shadow-xl hover:shadow-accent-primary/25 flex items-center gap-3">
                Get Early Access
                <ChevronRight className="w-5 h-5" />
              </a>
              <a href="#features" className="text-text-secondary hover:text-white px-8 py-4 text-lg font-medium transition-colors flex items-center gap-2">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right — Phone Mockup */}
          <div className="flex justify-center lg:justify-end animate-fade-in-up-delay-2">
            <div className="phone-mockup w-[300px] lg:w-[340px] aspect-[9/19.5]">
              <div className="w-full h-full bg-bg-surface p-5 flex flex-col">
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
                  <h3 className="font-display text-2xl font-bold text-white">Shot Tracker</h3>
                </div>

                {/* Court visualization placeholder */}
                <div className="flex-1 bg-bg-primary/60 rounded-2xl p-4 mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Crosshair className="w-32 h-32 text-accent-primary" />
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
                    <div className="text-success font-display text-xl font-bold">72%</div>
                    <div className="text-text-muted text-[10px] uppercase tracking-wider">FG%</div>
                  </div>
                  <div className="bg-bg-primary/60 rounded-xl p-3 text-center">
                    <div className="text-accent-primary font-display text-xl font-bold">28</div>
                    <div className="text-text-muted text-[10px] uppercase tracking-wider">Shots</div>
                  </div>
                  <div className="bg-bg-primary/60 rounded-xl p-3 text-center">
                    <div className="text-accent-secondary font-display text-xl font-bold">850</div>
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
   SOCIAL PROOF — Logos / Press bar
   ───────────────────────────────────────────── */
function SocialProof() {
  return (
    <section className="py-16 border-y border-border-subtle bg-bg-surface/30">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <p className="text-center text-text-muted text-sm uppercase tracking-[0.2em] mb-10 font-medium">
          As featured in
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {['TechCrunch', 'ESPN', 'WIRED', 'Fast Company', 'Bleacher Report'].map((name) => (
            <span key={name} className="font-display text-xl lg:text-2xl font-bold text-text-muted/40 tracking-wider uppercase hover:text-text-muted/60 transition-colors">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FEATURES — Large alternating split sections
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
      <div className="space-y-4">
        <div className="text-center mb-6">
          <p className="font-display text-lg font-bold text-white">Shooting Heatmap</p>
          <p className="text-text-muted text-xs">Last 7 days</p>
        </div>
        {/* Heatmap bars */}
        {[
          { zone: 'Paint', pct: 78, color: 'bg-success' },
          { zone: 'Mid-Range L', pct: 52, color: 'bg-warning' },
          { zone: 'Mid-Range R', pct: 61, color: 'bg-accent-primary' },
          { zone: 'Three-Pt L', pct: 38, color: 'bg-danger' },
          { zone: 'Three-Pt R', pct: 45, color: 'bg-warning' },
          { zone: 'Free Throw', pct: 85, color: 'bg-success' },
        ].map((z) => (
          <div key={z.zone}>
            <div className="flex justify-between text-xs mb-1">
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
        <div className="text-center mb-6">
          <p className="font-display text-lg font-bold text-white">Game Recap</p>
          <p className="text-text-muted text-xs">vs. Riverside Hawks</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'PTS', value: '24', color: 'text-accent-primary' },
            { label: 'REB', value: '8', color: 'text-accent-secondary' },
            { label: 'AST', value: '5', color: 'text-success' },
            { label: 'STL', value: '3', color: 'text-warning' },
            { label: 'BLK', value: '1', color: 'text-purple-400' },
            { label: 'FG%', value: '58', color: 'text-cyan-400' },
          ].map((s) => (
            <div key={s.label} className="bg-bg-primary/60 rounded-xl p-3 text-center">
              <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-text-muted text-[10px] uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-bg-primary/60 rounded-xl p-3 flex items-center justify-between">
          <span className="text-text-muted text-xs">Performance</span>
          <div className="flex gap-1">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-accent-primary fill-accent-primary' : 'text-text-muted/30'}`} />
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
      <div className="space-y-3">
        <div className="text-center mb-4">
          <p className="font-display text-lg font-bold text-white">Today's Drills</p>
          <p className="text-text-muted text-xs">Ball Handling Focus</p>
        </div>
        {[
          { name: 'Crossover Series', time: '8 min', level: 'INT', done: true },
          { name: 'Between the Legs', time: '6 min', level: 'INT', done: true },
          { name: 'Hesitation Moves', time: '10 min', level: 'ADV', done: false },
          { name: 'Full Court Combos', time: '12 min', level: 'ADV', done: false },
        ].map((d) => (
          <div key={d.name} className={`flex items-center gap-3 p-3 rounded-xl ${d.done ? 'bg-success/10 border border-success/20' : 'bg-bg-primary/60'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${d.done ? 'bg-success' : 'bg-bg-surface-hover'}`}>
              {d.done ? <span className="text-white text-xs font-bold">&#10003;</span> : <Flame className="w-4 h-4 text-text-muted" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{d.name}</p>
              <p className="text-text-muted text-[10px]">{d.time} &middot; {d.level}</p>
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
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
      <div className={`grid lg:grid-cols-2 gap-16 lg:gap-24 items-center ${reversed ? 'direction-rtl' : ''}`}
           style={reversed ? { direction: 'rtl' } : {}}>
        {/* Text side */}
        <div style={{ direction: 'ltr' }}>
          <div className="inline-flex items-center gap-2 bg-bg-surface border border-border-subtle rounded-full px-4 py-2 mb-8">
            <BadgeIcon className="w-4 h-4 text-accent-primary" />
            <span className="text-text-secondary text-sm font-medium">{badge}</span>
          </div>

          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[0.95] mb-3 tracking-tight">
            {title}
          </h2>
          <h3 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold gradient-text leading-[0.95] mb-8 tracking-tight">
            {subtitle}
          </h3>

          <p className="text-text-secondary text-lg lg:text-xl leading-relaxed mb-10 max-w-xl">
            {description}
          </p>

          <div className="flex gap-10">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl lg:text-4xl font-bold text-white">{s.value}</div>
                <div className="text-text-muted text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mockup side */}
        <div className="flex justify-center" style={{ direction: 'ltr' }}>
          <div className="phone-mockup w-[280px] lg:w-[320px] aspect-[9/19.5]">
            <div className="w-full h-full bg-bg-surface p-5 flex flex-col">
              {/* Notch */}
              <div className="w-28 h-6 bg-bg-primary rounded-full mx-auto mb-6" />
              <div className="flex-1 overflow-hidden">
                {mockupContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="py-32 space-y-40">
      {featureSections.map((section) => (
        <FeatureSection key={section.id} section={section} />
      ))}
    </section>
  );
}

/* ─────────────────────────────────────────────
   HOW IT WORKS — Clean 3-step
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
    <section id="how-it-works" className="py-32 bg-bg-surface/40">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-20">
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[0.95] tracking-tight mb-4">
            HOW IT <span className="gradient-text">WORKS.</span>
          </h2>
          <p className="text-text-secondary text-lg lg:text-xl max-w-xl mx-auto">
            Simple to start. Powerful over time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center lg:text-left">
              <div className="w-20 h-20 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <step.icon className="w-9 h-9 text-accent-primary" />
              </div>
              <div className="font-display text-sm font-bold text-accent-primary tracking-widest mb-3">STEP {step.number}</div>
              <h3 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-text-secondary text-base lg:text-lg leading-relaxed max-w-sm mx-auto lg:mx-0">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PREMIUM SECTION
   ───────────────────────────────────────────── */
function Premium() {
  return (
    <section id="premium" className="py-32">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-2 mb-8">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-semibold">CourtIQ+</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[0.95] tracking-tight mb-4">
            TAKE YOUR GAME<br />
            <span className="gradient-text">FURTHER.</span>
          </h2>
          <p className="text-text-secondary text-lg lg:text-xl max-w-xl mx-auto">
            Unlock advanced analytics, personalized training programs, and exclusive content.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              icon: BarChart3,
              title: 'Advanced Analytics',
              description: 'Deep-dive into your shooting trends, game-over-game comparisons, and predictive insights powered by AI.',
            },
            {
              icon: BookOpen,
              title: 'Training Programs',
              description: 'Follow structured multi-week programs designed by coaches. Progressively harder drills that adapt to your level.',
            },
            {
              icon: Users,
              title: 'Team Features',
              description: 'Share stats with coaches, compare with teammates, and compete on team leaderboards.',
            },
          ].map((f) => (
            <div key={f.title} className="bg-bg-surface border border-border-subtle rounded-3xl p-8 lg:p-10 hover:border-amber-500/30 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
                <f.icon className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-text-muted text-base leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PRESS QUOTES
   ───────────────────────────────────────────── */
function Press() {
  return (
    <section id="press" className="py-24 bg-bg-surface/40 border-y border-border-subtle">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
          {[
            {
              quote: '"CourtIQ is the Strava of basketball — a must-have for any serious player looking to track their development."',
              source: 'TechCrunch',
            },
            {
              quote: '"Finally, an app that treats basketball training with the same rigor as professional analytics platforms."',
              source: 'WIRED',
            },
            {
              quote: '"The shot tracking and game logging features are best-in-class. This is the future of player development."',
              source: 'Fast Company',
            },
          ].map((q) => (
            <div key={q.source}>
              <p className="text-text-secondary text-lg lg:text-xl leading-relaxed italic mb-6">{q.quote}</p>
              <p className="font-display text-lg font-bold text-text-muted tracking-wider uppercase">{q.source}</p>
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
    <section className="py-24">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {[
            { value: '11', label: 'Court Zones Tracked' },
            { value: '50+', label: 'Curated Drills' },
            { value: '20+', label: 'Stats Per Game' },
            { value: '100%', label: 'Free to Start' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-6xl lg:text-7xl font-extrabold text-white mb-2">{stat.value}</div>
              <div className="text-text-muted text-sm lg:text-base uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CTA / WAITLIST — Full width, premium feel
   ───────────────────────────────────────────── */
function Waitlist() {
  return (
    <section id="waitlist" className="py-32">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="relative bg-bg-surface border border-border-subtle rounded-[2rem] overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-secondary/5 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative px-8 py-20 md:px-16 lg:px-24 lg:py-28 text-center">
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[0.95] tracking-tight mb-6">
              READY TO<br />
              <span className="gradient-text">LEVEL UP?</span>
            </h2>
            <p className="text-text-secondary text-lg lg:text-xl max-w-lg mx-auto mb-12">
              Join the waitlist to get early access when CourtIQ launches.
              Be the first to start tracking your game.
            </p>

            <form
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
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
                className="flex-1 bg-bg-primary/80 border border-border-subtle rounded-full px-7 py-4 text-white placeholder:text-text-muted text-base focus:outline-none focus:border-accent-primary transition-colors"
              />
              <button
                type="submit"
                className="bg-accent-primary hover:bg-accent-primary-hover text-white px-10 py-4 rounded-full text-base font-bold transition-all hover:shadow-xl hover:shadow-accent-primary/25 whitespace-nowrap flex items-center justify-center gap-2"
              >
                Join Waitlist
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-text-muted text-sm mt-6">Free to join. No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER — Multi-column
   ───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-surface/30">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white tracking-wider">COURTIQ</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              The all-in-one basketball player development platform. Track, train, and transform your game.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-widest mb-5">Product</h4>
            <ul className="space-y-3">
              {['Shot Tracking', 'Game Logger', 'Drill Library', 'Analytics', 'CourtIQ+'].map((item) => (
                <li key={item}><a href="#features" className="text-text-muted hover:text-white text-sm transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Press', 'Contact'].map((item) => (
                <li key={item}><a href="#" className="text-text-muted hover:text-white text-sm transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-widest mb-5">Support</h4>
            <ul className="space-y-3">
              {['Help Center', 'FAQ', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}><a href="#" className="text-text-muted hover:text-white text-sm transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
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
      <Premium />
      <Press />
      <StatsBar />
      <Waitlist />
      <Footer />
    </div>
  );
}
