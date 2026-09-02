import type { Metadata } from 'next'
import '../../globals.css'
import '../two-rooms.css'

export const metadata: Metadata = {
  title: 'The Two Rooms Lab | Chris Marvel Davis',
  description: 'Guided implementation for The Two Rooms: camera reps, calibration, diagnostics, content extraction, and reel review.',
  alternates: { canonical: 'https://chrismarvelspeaks.com/two-rooms/lab' },
}

const checkout='https://buy.stripe.com/7sY7sL9W57jycPJarra3u0E'

const includes=[
  'Guided camera-rep sessions',
  'Five-Point Diagnostic feedback',
  'Opening, pace, eye-line, and energy calibration',
  'Content extraction from your existing expertise',
  'Reel and buyer-facing camera review',
  'A structured implementation path so the book becomes behavior',
]

export default function LabPage(){
  return <main className="tr-page">
    <nav className="tr-nav"><div className="tr-wrap tr-nav-inner"><a className="tr-brand" href="/">Chris<img src="/images/chris-marvel-logo.png" alt="" width={28} height={28}/><span>Marvel</span></a><a className="tr-nav-cta" href={checkout}>Join the Lab — $197</a></div></nav>
    <header className="tr-hero"><div className="tr-wrap tr-hero-grid">
      <div><div className="tr-eyebrow">The Two Rooms · Implementation Tier</div><h1 style={{fontSize:'clamp(4rem,9vw,8rem)'}}>The<br/><span>Lab</span></h1><p className="tr-deck">The book gives you the system. The Lab gives you the reps.</p><p className="tr-lead">For readers who do not want more information. They want feedback, calibration, repetition, and a visible difference in how they show up on camera.</p><div className="tr-actions"><a className="tr-btn tr-btn-rust" href={checkout}>Join The Two Rooms Lab — $197</a></div><p className="tr-micro">One-time enrollment · Secure Stripe checkout · Promo codes accepted.</p></div>
      <div className="tr-page-card" style={{minHeight:0,borderTopColor:'#64723A'}}><div className="tr-page-label">What changes here</div><h3>From reading to reps.</h3><ul>{includes.map(x=><li key={x}>{x}</li>)}</ul></div>
    </div></header>
    <section className="tr-system"><div className="tr-wrap"><div className="tr-section-kicker light">The objective</div><h2>Make the camera less interesting than the work.</h2><p className="tr-system-intro">The Lab exists to turn The Two Rooms from a framework you understand into a set of camera behaviors you can repeat under pressure.</p></div></section>
    <footer className="tr-footer"><div className="tr-wrap tr-footer-inner"><div>© 2026 Chris Marvel Davis</div><div><a href="/two-rooms">The Two Rooms</a></div></div></footer>
  </main>
}
