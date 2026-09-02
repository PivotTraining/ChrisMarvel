import type { Metadata } from 'next'
import '../globals.css'
import './two-rooms.css'

export const metadata: Metadata = {
  title: 'The Two Rooms: On Camera | Chris Marvel Davis',
  description: 'A practical digital field manual for speakers, coaches, consultants, trainers, executives, educators, pastors, therapists, and experts who can hold a room but go stiff when the camera turns on.',
  alternates: { canonical: 'https://chrismarvelspeaks.com/two-rooms' },
  openGraph: {
    title: 'The Two Rooms: Volume One — On Camera',
    description: 'The skill transfers. The setting changes. Learn how to translate real-world communication skill to camera.',
    url: 'https://chrismarvelspeaks.com/two-rooms',
    type: 'website',
  },
}

const checkoutUrl = 'https://buy.stripe.com/fZufZh9W51ZeaHB9nna3u0A'

const frameworks = [
  ['01', 'The Eighteen-Inch Room', 'Stop performing to an imaginary crowd. Learn to speak to one person through the lens.'],
  ['02', 'The 115 Setting', 'A practical calibration cue for finding the camera energy that looks natural to the viewer.'],
  ['03', 'The Five Wells', 'A repeatable idea system that turns your real work into a steady supply of useful content.'],
  ['04', 'The Five-Point Diagnostic', 'A fast way to identify why a take feels wrong before you record the same mistake eight more times.'],
  ['05', 'The First Fifty', 'A reps-first protocol that builds evidence and automaticity before perfection enters the room.'],
  ['06', 'The Thirty-Piece Grid', 'Turn one keynote, lesson, workshop, or hour of expertise into thirty usable content units.'],
]

const forWhom = [
  'Keynote speakers', 'Workshop facilitators', 'Coaches', 'Consultants', 'Executives', 'Educators',
  'Pastors', 'Therapists', 'Trainers', 'Authors', 'Subject-matter experts', 'Founders & leaders',
]

export default function TwoRoomsPage() {
  return (
    <main className="tr-page">
      <nav className="tr-nav" aria-label="The Two Rooms navigation">
        <div className="tr-wrap tr-nav-inner">
          <a className="tr-brand" href="/" aria-label="Chris Marvel home">
            Chris<img src="/images/chris-marvel-logo.png" alt="" width={28} height={28} /><span>Marvel</span>
          </a>
          <div className="tr-nav-links">
            <a href="#inside">Inside</a>
            <a href="#system">The System</a>
            <a href="#author">Author</a>
            <a className="tr-nav-cta" href={checkoutUrl}>Get the Book</a>
          </div>
        </div>
      </nav>

      <header className="tr-hero">
        <div className="tr-wrap tr-hero-grid">
          <div className="tr-hero-copy">
            <div className="tr-eyebrow">Volume One · On Camera · Digital Edition</div>
            <h1>The<br />Two<br /><span>Rooms</span></h1>
            <p className="tr-deck">A field manual for people who already have something to say.</p>
            <p className="tr-lead">
              You can hold a ballroom, lead a workshop, coach a client, teach a class, or command a meeting — then go blank when a lens points at you. <strong>You did not lose the skill. The room changed.</strong>
            </p>
            <div className="tr-actions">
              <a className="tr-btn tr-btn-rust" href={checkoutUrl}>Get The Two Rooms — $47</a>
              <a className="tr-btn tr-btn-ghost" href="#inside">See What&apos;s Inside</a>
            </div>
            <p className="tr-micro">Digital download · Instant access after purchase · Secure Stripe checkout · Promo codes accepted at checkout.</p>
          </div>

          <div className="tr-book-stage" aria-label="The Two Rooms digital book mockup">
            <div className="tr-shadow"></div>
            <div className="tr-book">
              <div className="tr-book-top">VOLUME ONE · ON CAMERA</div>
              <div className="tr-book-title">THE<br />TWO<br />ROOMS</div>
              <div className="tr-book-divider"></div>
              <div className="tr-room-row"><span>ROOM ONE</span><i></i><span>ROOM TWO</span></div>
              <div className="tr-book-sub">A field manual for people who already have something to say</div>
              <div className="tr-book-author">CHRIS MARVEL DAVIS</div>
            </div>
          </div>
        </div>
      </header>

      <section className="tr-thesis">
        <div className="tr-wrap tr-thesis-grid">
          <div className="tr-room tr-room-one">
            <span>Room One</span>
            <h2>The Stage</h2>
            <p>Faces. Laughter. Silence. Movement. Feedback. The room is constantly giving you information — and experienced communicators know how to use it.</p>
          </div>
          <div className="tr-thesis-center">
            <div className="tr-arrow">↔</div>
            <h3>The skill transfers.<br />The setting changes.</h3>
          </div>
          <div className="tr-room tr-room-two">
            <span>Room Two</span>
            <h2>The Camera</h2>
            <p>No visible audience. No nods. No applause. No room regulating you back. The skill is still there. The settings need recalibration.</p>
          </div>
        </div>
      </section>

      <section className="tr-problem" id="inside">
        <div className="tr-wrap">
          <div className="tr-section-kicker">Not another content-creator book</div>
          <h2>You do not need a new personality.<br /><span>You need the settings of the second room.</span></h2>
          <div className="tr-problem-grid">
            <div className="tr-big-quote">“I&apos;m great in the room.<br />Why am I bad on camera?”</div>
            <div className="tr-problem-copy">
              <p><strong>The Two Rooms</strong> is built for the expert with no camera reps — the person who is credible, capable, experienced, and still feels strangely amateur the moment recording begins.</p>
              <p>This is not a book about becoming an influencer. It is a working manual for translating existing communication skill to camera without becoming louder, gimmickier, or less recognizable.</p>
              <p>Every section is built to be opened at the moment of need: before filming, after a take that feels wrong, when you cannot find an idea, or when your online presence is not showing what you can actually do in a room.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tr-system" id="system">
        <div className="tr-wrap">
          <div className="tr-section-kicker light">The working system</div>
          <h2>22 sections. Built for use, not shelf decoration.</h2>
          <p className="tr-system-intro">Each chapter closes with the same three moves so you can diagnose, practice, and correct quickly.</p>
          <div className="tr-three">
            <article><span>◎</span><h3>The Standard</h3><p>What competent execution actually looks like — stated clearly enough to measure against.</p></article>
            <article><span>▶</span><h3>The Drill</h3><p>One practice to run. Most are designed to take ten minutes or less.</p></article>
            <article><span>⚠</span><h3>The Failure</h3><p>The specific mistake most likely to make the skill stop working.</p></article>
          </div>
        </div>
      </section>

      <section className="tr-frameworks">
        <div className="tr-wrap">
          <div className="tr-section-kicker">Frameworks you will actually reuse</div>
          <h2>Open it. Find the problem. Fix the setting. Film again.</h2>
          <div className="tr-framework-grid">
            {frameworks.map(([n, title, copy]) => (
              <article key={title} className="tr-framework-card">
                <div className="tr-framework-num">{n}</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tr-for">
        <div className="tr-wrap tr-for-grid">
          <div>
            <div className="tr-section-kicker light">Who this is for</div>
            <h2>For people whose expertise already works in real life.</h2>
            <p>You are not starting from zero. You already know how to communicate. This manual helps you recalibrate those skills for a lens.</p>
          </div>
          <div className="tr-tags">
            {forWhom.map(item => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section className="tr-pages">
        <div className="tr-wrap tr-pages-grid">
          <div className="tr-page-card">
            <div className="tr-page-label">The Five-Point Diagnostic</div>
            <h3>This take feels wrong.</h3>
            <ol><li>Message</li><li>Person</li><li>Energy</li><li>Pace</li><li>Truth</li></ol>
            <p>Do not refilm until you can name the likely problem.</p>
          </div>
          <div className="tr-page-card rust">
            <div className="tr-page-label">The Five Wells</div>
            <h3>You are not out of content.</h3>
            <ul><li>Questions</li><li>Corrections</li><li>Changes</li><li>Mistakes</li><li>Disagreements</li></ul>
            <p>Twenty-five possible ideas. Keep twenty.</p>
          </div>
          <div className="tr-page-card olive">
            <div className="tr-page-label">The 30-Day Camera Ladder</div>
            <h3>Confidence comes late.</h3>
            <p>Build evidence first: camera comfort, stronger openings, calibrated delivery, repeatable ideas, complete pieces, and translation back to the stage.</p>
          </div>
        </div>
      </section>

      <section className="tr-author" id="author">
        <div className="tr-wrap tr-author-grid">
          <div className="tr-author-image">
            <img src="/images/about-presenting.jpg" alt="Chris Marvel Davis teaching and presenting" width={700} height={520} loading="lazy" />
          </div>
          <div className="tr-author-copy">
            <div className="tr-section-kicker">About the author</div>
            <h2>Chris Marvel Davis</h2>
            <p>Chris Marvel Davis is a performance strategist, keynote speaker, author, and co-founder of Pivot Training &amp; Development. His work sits at the intersection of psychology, behavioral science, performance, and real-world application.</p>
            <p>He has spent years working in rooms — keynotes, workshops, schools, universities, organizations, and performance environments. <strong>The Two Rooms</strong> grew from a simple observation: talented communicators often think camera discomfort means they lost their skill. Usually, they are using the settings from the wrong room.</p>
            <blockquote>“The skill transfers. The setting changes.”</blockquote>
          </div>
        </div>
      </section>

      <section className="tr-final">
        <div className="tr-wrap tr-final-inner">
          <div>
            <div className="tr-eyebrow">The Two Rooms · Volume One · Digital Edition</div>
            <h2>Learn the room.</h2>
            <p>You already learned how to command the first one. Now learn how to enter the second.</p>
          </div>
          <div className="tr-final-buy">
            <div className="tr-price"><span>$</span>47</div>
            <a className="tr-btn tr-btn-rust" href={checkoutUrl}>Get Instant Access</a>
            <div className="tr-bulk">Digital PDF · Delivered after checkout</div>
          </div>
        </div>
      </section>

      <footer className="tr-footer">
        <div className="tr-wrap tr-footer-inner">
          <div>© 2026 Chris Marvel Davis · Pivot Training &amp; Development</div>
          <div><a href="/">ChrisMarvelSpeaks.com</a> · <a href="mailto:Jazmine@pivottraining.us">Jazmine@pivottraining.us</a></div>
        </div>
      </footer>
    </main>
  )
}
