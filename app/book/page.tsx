import type { Metadata } from 'next'
import '../globals.css'
import './books.css'

export const metadata: Metadata = {
  title: 'Books by Chris Marvel Davis | ChrisMarvelSpeaks.com',
  description: 'Books by Chris Marvel Davis: The Pink Lemon, Same Sour Attitude, The What If Effect, ON CAMERA and Love Laws.',
  alternates: { canonical: 'https://chrismarvelspeaks.com/book' },
  openGraph: {
    title: 'Books by Chris Marvel Davis',
    description: 'The Pink Lemon, Same Sour Attitude, The What If Effect, ON CAMERA and Love Laws.',
    url: 'https://chrismarvelspeaks.com/book',
    type: 'website',
  },
}

type Shelf = {
  key: string
  title: string
  tag: string
  blurb: string
  href: string
  art: string
  img?: { src: string; alt: string }
  extra?: { label: string; href: string }
}

const SHELF: Shelf[] = [
  {
    key: 'what-if',
    title: 'The What If Effect',
    tag: 'Available now',
    blurb: 'Twelve questions that will change your life. A practical way out of the thinking patterns that keep people stuck.',
    href: '/book/what-if-effect',
    art: 'lib-art-navy',
    img: { src: '/images/book-cover-v13.png', alt: 'The What If Effect book cover' },
    extra: { label: 'Amazon', href: 'https://a.co/d/0hwfYrf7' },
  },
  {
    key: 'on-camera',
    title: 'ON CAMERA',
    tag: 'Digital field manual',
    blurb: 'A 105-page field manual for people who already speak well in the room and want to do the same on camera.',
    href: '/on-camera',
    art: 'lib-art-teal',
  },
  {
    key: 'same-sour',
    title: 'Same Sour Attitude',
    tag: 'Coming soon · Fiction',
    blurb: 'A Pink Lemon story. One summer at Bellwether Market, a manager’s job opens across town and a box of striped pink lemons arrives the same week.',
    href: '/pinklemon#story',
    art: 'lib-art-pink',
    img: { src: '/pinklemon/story-cover-web.jpg', alt: 'Same Sour Attitude book cover' },
  },
  {
    key: 'love-laws',
    title: 'Love Laws',
    tag: '2015 · Relationships',
    blurb: 'The rules of love and relationships in the 21st century. Seven laws for dating, engagement and marriage.',
    href: '/book/love-laws',
    art: 'lib-art-wood',
    img: { src: '/images/love-laws-cover.jpg', alt: 'Love Laws book cover' },
  },
]

export default function BooksPage() {
  return (
    <main className="books-page">
      <nav id="navbar" className="books-nav" aria-label="Main navigation">
        <div className="container">
          <a href="/" className="nav-logo" aria-label="Chris Marvel homepage">Chris<img src="/images/chris-marvel-logo.png" alt="Chris Marvel logo" className="nav-logo-icon" width={28} height={28}/><span>Marvel</span></a>
          <ul className="nav-links" role="menubar">
            <li role="none"><a href="/#about" role="menuitem">About</a></li><li role="none"><a href="/#standard" role="menuitem">The Standard</a></li><li role="none"><a href="/#keynotes" role="menuitem">Keynotes</a></li><li role="none"><a href="/#reel" role="menuitem">Reel</a></li><li role="none"><a href="/book" role="menuitem" aria-current="page">Books</a></li><li role="none"><a href="/pinklemon" role="menuitem">The Pink Lemon</a></li><li role="none"><a href="/communities" role="menuitem">Communities</a></li><li role="none"><a href="/#contact" className="nav-cta" role="menuitem">Book Chris</a></li>
          </ul>
        </div>
      </nav>

      <header className="lib-hero">
        <div className="lib-wrap">
          <span className="lib-kicker">The library</span>
          <h1>Books by Chris Marvel Davis</h1>
          <p>Five titles on losing and winning, performance, speaking on camera, and love. Each one has its own page with more about the book and where to get it.</p>
        </div>
      </header>

      <section className="lib-feature" aria-labelledby="lib-feature-h">
        <div className="lib-wrap lib-feature-card">
          <a href="/pinklemon" className="lib-feature-art" aria-label="The Pink Lemon book page">
            <img src="/pinklemon/cover-web.jpg" alt="The Pink Lemon book cover" width={720} height={1113} />
          </a>
          <div className="lib-feature-copy">
            <span className="lib-badge">New book &middot; Out November 30, 2026</span>
            <h2 id="lib-feature-h">The Pink Lemon</h2>
            <p className="lib-feature-sub">Why losing isn&rsquo;t always what it looks like.</p>
            <p>
              Getting beaten, losing by an inch, having something taken, chasing the wrong prize and walking away on purpose all get called a loss.
              The book pulls them apart, so you stop answering every one of them with the same advice. Paperback and ebook.
            </p>
            <div className="lib-actions">
              <a href="/pinklemon" className="btn btn-navy">See the Book</a>
              <a href="/pinklemon#chapter" className="btn lib-btn-lemon">Read Chapter One Free</a>
            </div>
          </div>
        </div>
      </section>

      <section className="lib-shelf" aria-label="More books by Chris Marvel Davis">
        <div className="lib-wrap">
          <h2 className="lib-shelf-h">More books</h2>
          <div className="lib-grid">
            {SHELF.map((b) => (
              <article className="lib-card" key={b.key}>
                <a href={b.href} className={`lib-art ${b.art}`} aria-label={`${b.title} book page`}>
                  {b.img ? (
                    <img src={b.img.src} alt={b.img.alt} loading="lazy" />
                  ) : (
                    <div className="two-rooms-cover" aria-label="ON CAMERA book cover"><div className="small">A Field Manual</div><div className="title">ON<br/><span>CAMERA</span></div><div className="rule"></div><div className="author">Chris Marvel Davis</div></div>
                  )}
                </a>
                <div className="lib-info">
                  <span className="lib-tag">{b.tag}</span>
                  <h3><a href={b.href}>{b.title}</a></h3>
                  <p>{b.blurb}</p>
                  <div className="lib-card-actions">
                    <a className="lib-link" href={b.href}>View book &rarr;</a>
                    {b.extra && <a className="lib-link lib-link-muted" href={b.extra.href} target="_blank" rel="noopener noreferrer">{b.extra.label} &#8599;</a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lib-cta">
        <div className="lib-wrap lib-cta-inner">
          <div>
            <h2>Books for your group</h2>
            <p>Bulk copies for schools, teams and companies, on their own or paired with a keynote from Chris.</p>
          </div>
          <a href="/#contact" className="btn btn-gold">Ask About Bulk Orders</a>
        </div>
      </section>

      <footer className="footer"><div className="container"><div className="footer-bottom"><p>&copy; 2026 Chris Marvel Davis</p><p><a href="/">ChrisMarvelSpeaks.com</a></p></div></div></footer>
    </main>
  )
}
