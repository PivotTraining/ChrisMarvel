import type { Metadata } from 'next'
import '../globals.css'
import '../two-rooms/two-rooms.css'

export const metadata: Metadata = {
  title: 'ON CAMERA | A Field Manual by Chris Marvel Davis',
  description: 'A practical 105-page digital field manual for accomplished communicators who want to speak naturally, clearly, and confidently on video.',
  alternates: { canonical: 'https://chrismarvelspeaks.com/on-camera' },
  openGraph: {
    title: 'ON CAMERA — A Field Manual for People Who Already Have Something to Say',
    description: 'You did not lose the skill. The setting changed. Recalibrate your real-world communication skill for camera.',
    url: 'https://chrismarvelspeaks.com/on-camera',
    type: 'website',
  },
}

const checkoutUrl = 'https://buy.stripe.com/fZufZh9W51ZeaHB9nna3u0A'

const frameworks = [
  ['01', 'The Eighteen-Inch Room', 'Stop performing to an imaginary crowd. Learn to speak to one person through the lens.'],
  ['02', 'The 115 Setting', 'A practical calibration cue for finding camera energy that looks natural to the viewer.'],
  ['03', 'The Five Wells', 'Turn your real work into a steady supply of useful video ideas.'],
  ['04', 'The Five-Point Diagnostic', 'Identify why a take feels wrong before recording the same mistake again.'],
  ['05', 'The First Fifty', 'Build camera competence through evidence and repetitions before perfection enters the room.'],
  ['06', 'The Thirty-Piece Grid', 'Turn one keynote, workshop, lesson, or hour of expertise into thirty usable content units.'],
]

const forWhom = ['Keynote speakers','Workshop facilitators','Coaches','Consultants','Executives','Educators','Pastors','Therapists','Trainers','Authors','Subject-matter experts','Founders & leaders']

export default function OnCameraPage() {
  return (
    <main className="tr-page">
      <nav className="tr-nav" aria-label="ON CAMERA navigation">
        <div className="tr-wrap tr-nav-inner">
          <a className="tr-brand" href="/" aria-label="Chris Marvel home">Chris<img src="/images/chris-marvel-logo.png" alt="" width={28} height={28}/><span>Marvel</span></a>
          <div className="tr-nav-links"><a href="#inside">Inside</a><a href="#framework">Framework</a><a href="#author">Author</a><a className="tr-nav-cta" href={checkoutUrl}>Get ON CAMERA</a></div>
        </div>
      </nav>

      <header className="tr-hero">
        <div className="tr-wrap tr-hero-grid">
          <div className="tr-hero-copy">
            <div className="tr-eyebrow">Digital Field Manual · 105 Pages</div>
            <h1>ON<br/><span>CAMERA</span></h1>
            <p className="tr-deck">A field manual for people who already have something to say.</p>
            <p className="tr-lead">You can hold a ballroom, lead a workshop, coach a client, teach a class, or command a meeting — then go blank when a lens points at you. <strong>You did not lose the skill. The setting changed.</strong></p>
            <div className="tr-actions"><a className="tr-btn tr-btn-rust" href={checkoutUrl}>Get ON CAMERA — $47</a><a className="tr-btn tr-btn-ghost" href="#inside">See What&apos;s Inside</a></div>
            <p className="tr-micro">Digital PDF · Secure Stripe checkout · Camera Script Vault available as an optional checkout add-on.</p>
          </div>
          <div className="tr-book-stage" aria-label="ON CAMERA digital book mockup">
            <div className="tr-shadow"></div>
            <div className="tr-book">
              <div className="tr-book-top">A FIELD MANUAL</div>
              <div className="tr-book-title">ON<br/>CAMERA</div>
              <div className="tr-book-divider"></div>
              <div className="tr-room-row"><span>ROOM ONE</span><i></i><span>ROOM TWO</span></div>
              <div className="tr-book-sub">A field manual for people who already have something to say</div>
              <div className="tr-book-author">CHRIS MARVEL DAVIS</div>
            </div>
          </div>
        </div>
      </header>

      <section className="tr-thesis" id="framework">
        <div className="tr-wrap tr-thesis-grid">
          <div className="tr-room tr-room-one"><span>Room One</span><h2>The Stage</h2><p>Faces. Laughter. Silence. Movement. Feedback. Experienced communicators know how to read and use the room.</p></div>
          <div className="tr-thesis-center"><div className="tr-arrow">↔</div><h3>The Two Rooms Framework</h3><p style={{marginTop:10}}>The skill transfers.<br/>The setting changes.</p></div>
          <div className="tr-room tr-room-two"><span>Room Two</span><h2>The Camera</h2><p>No visible audience. No nods. No applause. The skill is still there. The settings need recalibration.</p></div>
        </div>
      </section>

      <section className="tr-problem" id="inside">
        <div className="tr-wrap">
          <div className="tr-section-kicker">Not another content-creator book</div>
          <h2>Speak better on camera<br/><span>without becoming someone else.</span></h2>
          <div className="tr-problem-grid">
            <div className="tr-big-quote">“I&apos;m great in the room.<br/>Why am I bad on camera?”</div>
            <div className="tr-problem-copy"><p><strong>ON CAMERA</strong> is built for credible, capable people with real expertise and too few camera reps.</p><p>Inside the manual, <strong>The Two Rooms Framework</strong> explains why live communication skills can feel broken when the audience disappears and the lens becomes the room.</p><p>This is a working manual: open it before filming, after a take that feels wrong, when you need an idea, or when your online presence is not showing what you can actually do.</p></div>
          </div>
        </div>
      </section>

      <section className="tr-system">
        <div className="tr-wrap"><div className="tr-section-kicker light">The working system</div><h2>22 chapters. Built for use.</h2><p className="tr-system-intro">Each chapter closes with three moves designed to make the next rep better.</p><div className="tr-three"><article><span>◎</span><h3>The Standard</h3><p>What competent execution actually looks like.</p></article><article><span>▶</span><h3>The Drill</h3><p>One focused practice to run immediately.</p></article><article><span>⚠</span><h3>The Failure</h3><p>The mistake most likely to make the skill stop working.</p></article></div></div>
      </section>

      <section className="tr-frameworks">
        <div className="tr-wrap"><div className="tr-section-kicker">Frameworks you will actually reuse</div><h2>Find the problem. Fix the setting. Film again.</h2><div className="tr-framework-grid">{frameworks.map(([n,title,copy])=><article key={title} className="tr-framework-card"><div className="tr-framework-num">{n}</div><h3>{title}</h3><p>{copy}</p></article>)}</div></div>
      </section>

      <section className="tr-for"><div className="tr-wrap tr-for-grid"><div><div className="tr-section-kicker light">Who this is for</div><h2>People whose expertise already works in real life.</h2><p>You are not starting from zero. You are translating an existing skill into a different setting.</p></div><div className="tr-tags">{forWhom.map(item=><span key={item}>{item}</span>)}</div></div></section>

      <section className="tr-pages"><div className="tr-wrap tr-pages-grid"><div className="tr-page-card"><div className="tr-page-label">Camera Field Kit</div><h3>Six operating cards.</h3><p>Camera Emergency, Calibration Scorecard, Bad Take Autopsy, Good Take Anatomy, Before You Post, and the Field Kit hub.</p><a className="tr-btn tr-btn-ghost" href="/on-camera/field-kit">See the Field Kit</a></div><div className="tr-page-card rust"><div className="tr-page-label">Camera Script Vault</div><h3>Remove the blank-page problem.</h3><p>90+ openings, structures, stories, teaching formats, corrections, closers, and recording sheets.</p><a className="tr-btn tr-btn-ghost" href="/on-camera/script-vault">See the Script Vault</a></div><div className="tr-page-card olive"><div className="tr-page-label">ON CAMERA Lab</div><h3>The manual gives you the system. The Lab gives you the reps.</h3><p>Guided implementation, calibration, diagnostics, content extraction, and feedback.</p><a className="tr-btn tr-btn-ghost" href="/on-camera/lab">See the Lab</a></div></div></section>

      <section className="tr-author" id="author"><div className="tr-wrap tr-author-grid"><div className="tr-author-image"><img src="/images/about-presenting.jpg" alt="Chris Marvel Davis teaching and presenting" width={700} height={520} loading="lazy"/></div><div className="tr-author-copy"><div className="tr-section-kicker">About the author</div><h2>Chris Marvel Davis</h2><p>Chris Marvel Davis is a performance strategist, keynote speaker, author, and co-founder of Pivot Training &amp; Development. His work sits at the intersection of psychology, behavioral science, performance, and real-world application.</p><p><strong>ON CAMERA</strong> grew from a simple observation: talented communicators often think camera discomfort means they lost their skill. Usually, they are using the settings from the wrong room.</p><blockquote>“The skill transfers. The setting changes.”</blockquote></div></div></section>

      <section className="tr-final"><div className="tr-wrap tr-final-inner"><div><div className="tr-eyebrow">ON CAMERA · Digital Edition</div><h2>Make the next rep better.</h2><p>You already know how to communicate. Learn how to recalibrate it for the lens.</p></div><div className="tr-final-buy"><div className="tr-price"><span>$</span>47</div><a className="tr-btn tr-btn-rust" href={checkoutUrl}>Get Instant Access</a><div className="tr-bulk">105-page digital field manual</div></div></div></section>

      <footer className="tr-footer"><div className="tr-wrap tr-footer-inner"><div>© 2026 Chris Marvel Davis · Pivot Training &amp; Development</div><div><a href="/book">Books</a> · <a href="mailto:Jazmine@pivottraining.us">Jazmine@pivottraining.us</a></div></div></footer>
    </main>
  )
}
