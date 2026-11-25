import type { Metadata } from 'next'
import '../globals.css'
import '../book/books.css'
import './about.css'

export const metadata: Metadata = {
  title: 'About Chris Marvel Davis',
  description:
    'Chris Marvel Davis is a performance strategist, keynote speaker and author, co-founder of Pivot Training & Development, and author of The What If Effect, The Pink Lemon and Love Laws.',
  alternates: { canonical: 'https://chrismarvelspeaks.com/about' },
  openGraph: {
    title: 'About Chris Marvel Davis',
    description: 'Performance strategist, keynote speaker and author. Co-founder of Pivot Training & Development.',
    url: 'https://chrismarvelspeaks.com/about',
    type: 'profile',
    images: [{ url: '/images/about-portrait.jpg', width: 1200, height: 1759, alt: 'Chris Marvel Davis' }],
  },
}

/* ProfilePage tells search engines this page is about one person, the same
   #person entity described in the root layout. Keep the facts here and in
   the layout's personSchema in step. No phone number or street address. */
const profileSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': 'https://chrismarvelspeaks.com/about#profile',
  url: 'https://chrismarvelspeaks.com/about',
  name: 'About Chris Marvel Davis',
  mainEntity: { '@id': 'https://chrismarvelspeaks.com/#person' },
}

const BOOKS = [
  { title: 'The What If Effect', href: '/book/what-if-effect', note: 'Twelve questions that will change your life.' },
  { title: 'The Pink Lemon', href: '/pinklemon', note: 'Out December 30, 2026. Chapter One is free.' },
  { title: 'Love Laws', href: '/book/love-laws', note: 'The Rules of Love & Relationships in the 21st Century (2015).' },
]

const PROFILES = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/chrismarvel' },
  { label: 'Instagram', href: 'https://www.instagram.com/chrismarvel/' },
  { label: 'Goodreads', href: 'https://www.goodreads.com/author/show/14684440.Chris_Marvel' },
  { label: 'Apple Books', href: 'https://books.apple.com/us/author/chris-marvel/id1062992500' },
  { label: 'Pivot Training & Development', href: 'https://pivottraining.us' },
]

export default function AboutPage() {
  return (
    <main className="ab-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />
      <nav id="navbar" className="books-nav" aria-label="Main navigation">
        <div className="container">
          <a href="/" className="nav-logo" aria-label="Chris Marvel homepage">Chris<img src="/images/chris-marvel-logo.png" alt="Chris Marvel logo" className="nav-logo-icon" width={28} height={28}/><span>Marvel</span></a>
          <ul className="nav-links" role="menubar">
            <li role="none"><a href="/about" role="menuitem" aria-current="page">About</a></li><li role="none"><a href="/#keynotes" role="menuitem">Keynotes</a></li><li role="none"><a href="/book" role="menuitem">Books</a></li><li role="none"><a href="/pinklemon" role="menuitem">The Pink Lemon</a></li><li role="none"><a href="/communities" role="menuitem">Communities</a></li><li role="none"><a href="/#contact" className="nav-cta" role="menuitem">Book Chris</a></li>
          </ul>
        </div>
      </nav>

      <header className="ab-hero">
        <div className="ab-wrap">
          <span className="ab-kicker">About</span>
          <h1>Chris Marvel Davis</h1>
          <p>Performance strategist, keynote speaker and author. Co-founder of Pivot Training &amp; Development.</p>
        </div>
      </header>

      <section className="ab-main">
        <div className="ab-wrap ab-grid">
          <div className="ab-photo">
            <img src="/images/about-portrait.jpg" alt="Black-and-white portrait of Chris Marvel Davis seated in an armchair, hands clasped" width={1200} height={1759} />
          </div>
          <div className="ab-bio">
            <h2>Biography</h2>
            <p>
              Chris Marvel Davis is a performance strategist, keynote speaker and author whose work sits where psychology,
              leadership and performance meet. He is the co-founder of Pivot Training &amp; Development, which he built with his
              wife, Jazmine Davis, to help schools and organizations deal with burnout, pressure and the human side of performance.
              Chris has delivered keynotes and training for Johnson &amp; Johnson, the Cleveland Metropolitan School District,
              Clark County Schools and Head Start.
            </p>
            <p>
              Before Pivot, Chris spent years coaching people at the top of their fields, including NFL Hall of Famer Terrell Owens,
              NBA champion Lamar Odom and NFL receiver Ted Ginn Jr. He was raised in Cleveland, Ohio, and holds a bachelor&rsquo;s
              and a master&rsquo;s degree in psychology from Walden University.
            </p>
            <p>
              He is the author of <em>The What If Effect</em>, <em>The Pink Lemon</em> and <em>Love Laws</em>, which he published
              in 2015 as Chris Marvel. He lives in metro Atlanta with his wife and their three sons.
            </p>

            <div className="ab-section">
              <h2>Books</h2>
              <ul className="ab-list">
                {BOOKS.map((b) => (
                  <li key={b.href}><a href={b.href}>{b.title}</a><span>{b.note}</span></li>
                ))}
              </ul>
            </div>

            <div className="ab-section">
              <h2>Find Chris online</h2>
              <div className="ab-links">
                {PROFILES.map((p) => (
                  <a key={p.href} href={p.href} target="_blank" rel="noopener me">{p.label}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer"><div className="container"><div className="footer-bottom"><p>&copy; 2026 Chris Marvel Davis</p><p><a href="/">ChrisMarvelSpeaks.com</a></p></div></div></footer>
    </main>
  )
}
