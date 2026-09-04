import type { Metadata } from 'next'
import '../globals.css'
import './books.css'

export const metadata: Metadata = {
  title: 'Books by Chris Marvel Davis | ChrisMarvelSpeaks.com',
  description: 'Explore books and practical field manuals by Chris Marvel Davis, including The What If Effect and ON CAMERA.',
  alternates: { canonical: 'https://chrismarvelspeaks.com/book' },
  openGraph: {
    title: 'Books by Chris Marvel Davis',
    description: 'Books, field manuals, and practical frameworks for performance, possibility, and communication.',
    url: 'https://chrismarvelspeaks.com/book',
    type: 'website',
  },
}

export default function BooksPage() {
  return (
    <main className="books-page">
      <nav id="navbar" className="books-nav" aria-label="Main navigation">
        <div className="container">
          <a href="/" className="nav-logo" aria-label="Chris Marvel homepage">Chris<img src="/images/chris-marvel-logo.png" alt="Chris Marvel logo" className="nav-logo-icon" width={28} height={28}/><span>Marvel</span></a>
          <ul className="nav-links" role="menubar">
            <li role="none"><a href="/#about" role="menuitem">About</a></li><li role="none"><a href="/#method" role="menuitem">Method</a></li><li role="none"><a href="/#keynotes" role="menuitem">Keynotes</a></li><li role="none"><a href="/#reel" role="menuitem">Reel</a></li><li role="none"><a href="/book" role="menuitem" aria-current="page">Books</a></li><li role="none"><a href="/communities" role="menuitem">Communities</a></li><li role="none"><a href="/#contact" className="nav-cta" role="menuitem">Book Chris</a></li>
          </ul>
        </div>
      </nav>

      <header className="books-hero"><div className="container"><span className="books-kicker">Books by Chris Marvel Davis</span><h1>Frameworks for how people think, perform, and communicate.</h1><p>Each title stands on its own. Together, they reflect the same approach Chris brings to the stage: practical psychology, clear systems, and tools designed to be used after the inspiration wears off.</p></div></header>

      <section className="books-shelf" aria-label="Books by Chris Marvel Davis"><div className="container books-grid">
        <article className="book-tile"><div className="book-art gold"><img src="/images/book-cover-v13.png" alt="The What If Effect book cover" /></div><div className="book-info"><div className="book-meta">Book · Performance &amp; Possibility</div><h2>The What If Effect</h2><p>A psychology-backed framework for breaking through the thinking patterns that keep people stuck and turning doubt into direction.</p><div className="book-actions"><a className="btn btn-navy" href="/book/what-if-effect">View Book</a></div></div></article>

        <article className="book-tile"><div className="book-art rust"><div className="two-rooms-cover" aria-label="ON CAMERA book cover"><div className="small">A Field Manual</div><div className="title">ON<br/><span>CAMERA</span></div><div className="rule"></div><div className="small">The Two Rooms Framework</div><div className="author">Chris Marvel Davis</div></div></div><div className="book-info"><div className="book-meta">Digital Field Manual · Camera Communication</div><h2>ON CAMERA</h2><p>A 105-page field manual for people who already have something to say — built to help accomplished communicators recalibrate their real-world skill for the lens.</p><div className="book-actions"><a className="btn btn-navy" href="/on-camera">View Book</a><a className="btn btn-outline" href="https://buy.stripe.com/fZufZh9W51ZeaHB9nna3u0A">Get Digital Edition — $47</a></div></div></article>
      </div></section>

      <section className="books-note"><div className="container"><div className="books-note-card"><h3>More titles will live here.</h3><p>The Books tab is the permanent library for Chris Marvel Davis titles. The Camera Field Kit, Camera Script Vault, and ON CAMERA Lab remain inside the ON CAMERA ecosystem rather than crowding the main shelf.</p></div></div></section>

      <footer className="footer"><div className="container"><div className="footer-bottom"><p>© 2026 Chris Marvel Davis · Pivot Training &amp; Development</p><p><a href="/">ChrisMarvelSpeaks.com</a></p></div></div></footer>
    </main>
  )
}
