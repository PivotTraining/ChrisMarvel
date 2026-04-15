'use client'

import { useState } from 'react'

export default function CommunitiesNav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="cm-nav">
      <a href="/" className="cm-nav-brand">CHRIS <span>MARVEL</span></a>
      <ul className={`cm-nav-links ${open ? 'cm-nav-open' : ''}`}>
        <li><a href="/#about" onClick={() => setOpen(false)}>About</a></li>
        <li><a href="/#keynotes" onClick={() => setOpen(false)}>Keynotes</a></li>
        <li><a href="/#reel" onClick={() => setOpen(false)}>Reel</a></li>
        <li><a href="/#book" onClick={() => setOpen(false)}>Book</a></li>
        <li><a href="#" className="active" onClick={() => setOpen(false)}>Communities</a></li>
      </ul>
      <div className="cm-nav-right">
        <a href="/#contact" className="cm-nav-cta">Book Chris</a>
        <button
          className="cm-mobile-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span className={open ? 'open' : ''}></span>
          <span className={open ? 'open' : ''}></span>
          <span className={open ? 'open' : ''}></span>
        </button>
      </div>
    </nav>
  )
}
