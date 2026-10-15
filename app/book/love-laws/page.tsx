import type { Metadata } from 'next'
import '../../globals.css'
import '../books.css'
import './love-laws.css'

export const metadata: Metadata = {
  title: 'Love Laws by Chris Marvel Davis',
  description:
    'Love Laws: The Rules of Love & Relationships in the 21st Century. Seven laws for dating, engagement and marriage from Chris Marvel Davis.',
  alternates: { canonical: 'https://chrismarvelspeaks.com/book/love-laws' },
  openGraph: {
    title: 'Love Laws by Chris Marvel Davis',
    description: 'The Rules of Love & Relationships in the 21st Century. Seven laws for dating, engagement and marriage.',
    url: 'https://chrismarvelspeaks.com/book/love-laws',
    type: 'book',
    images: [{ url: '/images/love-laws-cover.jpg', width: 932, height: 1500, alt: 'Love Laws book cover' }],
  },
}

const LAWS = [
  ['Chase Love, Not Lust', 'Love gives, lust takes. Sex outside of commitment carries emotions, memories and expectations that are never casual.'],
  ['Be Careful Who You Connect With', 'Social media changed how people meet and talk. This law is about who you let close, online and off.'],
  ['Make Your Word Work for You', 'Learn to listen before you speak. As Chris puts it, don’t raise your voice, improve your argument.'],
  ['Money Talks', 'Know your partner’s financial language, and have the money conversation before the wedding.'],
  ['You Cannot Afford to Lose Your Freedom', 'Holding on to old wounds keeps you stuck. Doing the work to heal from your past is what lets you live free.'],
  ['Serving Is Mandatory', 'Serving your partner shifts a relationship from ordinary to extraordinary.'],
  ['Commit Hard', 'Committing to someone is a process, and it means staying committed when the relationship changes, not only when it is going well.'],
]

export default function LoveLawsPage() {
  return (
    <main className="ll-page">
      <nav id="navbar" className="books-nav" aria-label="Main navigation">
        <div className="container">
          <a href="/" className="nav-logo" aria-label="Chris Marvel homepage">Chris<img src="/images/chris-marvel-logo.png" alt="Chris Marvel logo" className="nav-logo-icon" width={28} height={28}/><span>Marvel</span></a>
          <ul className="nav-links" role="menubar">
            <li role="none"><a href="/#about" role="menuitem">About</a></li><li role="none"><a href="/#standard" role="menuitem">The Standard</a></li><li role="none"><a href="/#keynotes" role="menuitem">Keynotes</a></li><li role="none"><a href="/#reel" role="menuitem">Reel</a></li><li role="none"><a href="/book" role="menuitem" aria-current="page">Books</a></li><li role="none"><a href="/pinklemon" role="menuitem">The Pink Lemon</a></li><li role="none"><a href="/communities" role="menuitem">Communities</a></li><li role="none"><a href="/#contact" className="nav-cta" role="menuitem">Book Chris</a></li>
          </ul>
        </div>
      </nav>

      <header className="ll-hero">
        <div className="ll-wrap ll-hero-grid">
          <div className="ll-cover">
            <img src="/images/love-laws-cover.jpg" alt="Love Laws: The Rules of Love & Relationships in the 21st Century, by Chris Marvel. A red heart made of words on a white wood background." width={932} height={1500} />
          </div>
          <div className="ll-hero-copy">
            <a href="/book" className="ll-back">&larr; All books</a>
            <h1><span className="ll-script">Love</span><span className="ll-type">Laws</span></h1>
            <div className="ll-rule" aria-hidden="true"><span className="ll-heart">&#9829;</span><span className="ll-line"></span><span className="ll-gavel"></span></div>
            <p className="ll-sub">The Rules of Love &amp; Relationships in the 21st Century</p>
            <p>
              The 21st century has been anything but traditional. In <em>Love Laws</em>, Chris Marvel Davis takes on the relationship subjects people
              are actually dealing with: social media and dating, sex and lust, and what it takes to be vulnerable and stay that way.
            </p>
            <p>
              The book works whether you are dating, engaged or newly married. It lays out seven laws, drawn from years of relationship coaching,
              so you can build a relationship with peace, love and joy in it.
            </p>
            <div className="ll-actions">
              <a href="#laws" className="btn ll-btn-red">See the 7 Laws</a>
              <a href="/#contact" className="btn ll-btn-outline">Ask About Copies</a>
            </div>
            <p className="ll-meta">Published 2015 &middot; Paperback and ebook &middot; ISBN 978-0-9884285-7-7</p>
          </div>
        </div>
      </header>

      <section className="ll-laws" id="laws" aria-labelledby="ll-laws-h">
        <div className="ll-wrap">
          <span className="ll-kicker">Inside the book</span>
          <h2 id="ll-laws-h">The 7 Love Laws</h2>
          <ol className="ll-law-list">
            {LAWS.map(([name, line], i) => (
              <li key={name}>
                <span className="ll-num">Law {i + 1}</span>
                <h3>{name}</h3>
                <p>{line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ll-quote" aria-label="From the book">
        <div className="ll-wrap ll-quote-inner">
          <span className="ll-kicker">From &ldquo;My Thoughts&rdquo;</span>
          <blockquote>
            <p>
              &ldquo;This manuscript is not written by an amazing lover, a champion husband, or a superhuman father. This pen is stroked by a man
              who fought his way to see these words reach your hands.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      <section className="ll-about" aria-labelledby="ll-about-h">
        <div className="ll-wrap ll-about-grid">
          <div>
            <span className="ll-kicker">About the book</span>
            <h2 id="ll-about-h">Chris&rsquo;s first book</h2>
            <p>
              <em>Love Laws</em> came out in 2015, when Chris was working as a relationship coach in Cleveland. The book opens on a trip to Los Angeles
              for his first national television interview, sitting next to a professional athlete he had been advising through family and money
              pressures, and works out from there into the rules most people never get taught.
            </p>
            <p>
              If you want copies for a group, or want Chris to speak on the ideas in the book, reach out through the booking form.
            </p>
            <div className="ll-actions">
              <a href="/#contact" className="btn ll-btn-red">Book Chris</a>
            </div>
          </div>
          <aside className="ll-more" aria-label="More books by Chris Marvel Davis">
            <span className="ll-kicker">More from Chris</span>
            <a href="/pinklemon" className="ll-more-item"><img src="/pinklemon/cover-web.jpg" alt="" width={72} height={111} /><span><strong>The Pink Lemon</strong>New &middot; Out November 30, 2026</span></a>
            <a href="/book/what-if-effect" className="ll-more-item"><img src="/images/book-cover-v13.png" alt="" width={72} height={115} /><span><strong>The What If Effect</strong>Available now</span></a>
            <a href="/book" className="ll-more-all">See all books &rarr;</a>
          </aside>
        </div>
      </section>

      <footer className="footer"><div className="container"><div className="footer-bottom"><p>&copy; 2026 Chris Marvel Davis</p><p><a href="/">ChrisMarvelSpeaks.com</a></p></div></div></footer>
    </main>
  )
}
