import type { Metadata } from 'next'
import '../../globals.css'
import '../two-rooms.css'

export const metadata: Metadata = {
  title: 'The Two Rooms Field Kit | Chris Marvel Davis',
  description: 'Six practical camera tools for experts who need to diagnose, calibrate, and film better without rereading an entire book.',
  alternates: { canonical: 'https://chrismarvelspeaks.com/two-rooms/field-kit' },
  openGraph: {
    title: 'The Two Rooms Field Kit',
    description: 'Six practical camera tools. Built for the moment you need to film.',
    url: 'https://chrismarvelspeaks.com/two-rooms/field-kit',
    type: 'website',
  },
}

const checkoutUrl = 'https://buy.stripe.com/28E3cvgkt8nCaHB8jja3u0B'

const tools = [
  ['01', 'Camera Emergency', 'A ten-minute rescue protocol for the days when you need to film now and do not have time to overthink.'],
  ['02', 'Calibration Scorecard', 'Score eyes, energy, pace, body, silence, honesty, opening, and closing — then know exactly what to fix.'],
  ['03', 'Bad Take Autopsy', 'See how a weak take fails in real time: warm-up, abstraction, drift, qualifiers, and a soft close.'],
  ['04', 'Good Take Anatomy', 'The same subject rebuilt with a stronger opening, clear person, tighter pace, calibrated energy, and a real ending.'],
  ['05', 'Before You Post', 'A ten-point craft-control check before you let a video represent you.'],
  ['06', 'Field Kit Operating Hub', 'A single-page map that tells you which tool to use based on the problem you are having.'],
]

export default function FieldKitPage() {
  return (
    <main className="tr-page">
      <nav className="tr-nav" aria-label="Field Kit navigation">
        <div className="tr-wrap tr-nav-inner">
          <a className="tr-brand" href="/" aria-label="Chris Marvel home">Chris<img src="/images/chris-marvel-logo.png" alt="" width={28} height={28}/><span>Marvel</span></a>
          <div className="tr-nav-links">
            <a href="/two-rooms">The Book</a>
            <a href="#inside">Inside</a>
            <a className="tr-nav-cta" href={checkoutUrl}>Get the Kit — $27</a>
          </div>
        </div>
      </nav>

      <header className="tr-hero" style={{paddingBottom:72}}>
        <div className="tr-wrap tr-hero-grid">
          <div className="tr-hero-copy">
            <div className="tr-eyebrow">The Two Rooms · Field Kit · Digital Download</div>
            <h1 style={{fontSize:'clamp(4.2rem,9vw,8rem)'}}>The<br/><span>Field</span><br/>Kit</h1>
            <p className="tr-deck">The book teaches the system. The Field Kit puts the system in your hands when the camera is already on.</p>
            <p className="tr-lead">Six practical tools designed for working communicators who need to <strong>diagnose a take, calibrate delivery, fix the problem, and film again.</strong> No theory dump. No filler. Open the tool that matches the problem in front of you.</p>
            <div className="tr-actions">
              <a className="tr-btn tr-btn-rust" href={checkoutUrl}>Get Instant Access — $27</a>
              <a className="tr-btn tr-btn-ghost" href="#inside">See the Six Tools</a>
            </div>
            <p className="tr-micro">One-time purchase · Digital PDF · Secure Stripe checkout · Promo codes accepted.</p>
          </div>

          <div className="tr-book-stage" aria-label="Two Rooms Field Kit mockup" style={{minHeight:560}}>
            <div className="tr-shadow"></div>
            <div className="tr-book" style={{transform:'rotate(2deg)',boxShadow:'24px 32px 0 #64723A,28px 36px 38px rgba(0,0,0,.22)'}}>
              <div className="tr-book-top">THE TWO ROOMS · FIELD PAGES</div>
              <div className="tr-book-title" style={{fontSize:'3.8rem'}}>FIELD<br/><span style={{color:'#244B58'}}>KIT</span></div>
              <div className="tr-book-divider"></div>
              <div style={{fontFamily:'var(--font-heading)',fontWeight:900,fontSize:'1.1rem',lineHeight:1.5,textTransform:'uppercase'}}>Diagnose.<br/>Calibrate.<br/>Film again.</div>
              <div className="tr-book-sub">Six operating tools for the eighteen-inch room.</div>
              <div className="tr-book-author">CHRIS MARVEL DAVIS</div>
            </div>
          </div>
        </div>
      </header>

      <section className="tr-problem" id="inside">
        <div className="tr-wrap">
          <div className="tr-section-kicker">Built for use</div>
          <h2>You do not need another course.<br/><span>You need the right tool at the right moment.</span></h2>
          <div className="tr-framework-grid" style={{marginTop:50}}>
            {tools.map(([n,title,copy]) => (
              <article key={title} className="tr-framework-card">
                <div className="tr-framework-num">{n}</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tr-system">
        <div className="tr-wrap">
          <div className="tr-section-kicker light">Use it before the next take</div>
          <h2>What problem are you having?</h2>
          <div className="tr-three" style={{marginTop:40}}>
            <article><span>01</span><h3>I have to film now.</h3><p>Open Camera Emergency. Ten minutes later, you are recording instead of preparing to prepare.</p></article>
            <article><span>02</span><h3>This take feels wrong.</h3><p>Run the Calibration Scorecard and Bad Take Autopsy. Name the problem before you repeat it.</p></article>
            <article><span>03</span><h3>I am about to post.</h3><p>Run Before You Post. Make sure the video represents the level of communicator you actually are.</p></article>
          </div>
        </div>
      </section>

      <section className="tr-pages">
        <div className="tr-wrap tr-for-grid" style={{alignItems:'center'}}>
          <div>
            <div className="tr-section-kicker">Field Kit vs. Full Manual</div>
            <h2 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(2.5rem,5vw,4.4rem)',lineHeight:1,textTransform:'uppercase',letterSpacing:'-2px'}}>Need the whole system?</h2>
            <p style={{fontSize:'1.05rem',lineHeight:1.8,color:'#444',marginTop:22}}>The Field Kit is the fast operating layer. <strong>The Two Rooms: Volume One — On Camera</strong> is the complete 105-page system: 22 chapters, drills, diagnostics, frameworks, and the Field Kit pages integrated into the manual.</p>
            <div className="tr-actions"><a className="tr-btn tr-btn-ghost" href="/two-rooms">See the Full Manual — $47</a></div>
          </div>
          <div className="tr-page-card" style={{minHeight:0,borderTopColor:'#B34A32'}}>
            <div className="tr-page-label">Standalone Field Kit</div>
            <h3 style={{fontSize:'2.5rem'}}>$27 · Instant Digital Access</h3>
            <p>Six field pages. One operating system. Built to sit beside your phone while you work.</p>
            <a className="tr-btn tr-btn-rust" style={{marginTop:24}} href={checkoutUrl}>Get the Field Kit</a>
          </div>
        </div>
      </section>

      <footer className="tr-footer">
        <div className="tr-wrap tr-footer-inner">
          <div>© 2026 Chris Marvel Davis · Pivot Training &amp; Development</div>
          <div><a href="/two-rooms">The Two Rooms</a> · <a href="mailto:Jazmine@pivottraining.us">Jazmine@pivottraining.us</a></div>
        </div>
      </footer>
    </main>
  )
}
