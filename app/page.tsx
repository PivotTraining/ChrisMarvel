'use client'

import './globals.css'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)

  useEffect(() => {
    // Navbar background on scroll
    const handleScroll = () => {
      const nav = document.getElementById('navbar')
      if (nav) {
        nav.style.background = window.scrollY > 50
          ? 'rgba(27, 42, 74, 0.98)'
          : 'rgba(27, 42, 74, 0.95)'
      }
    }
    window.addEventListener('scroll', handleScroll)

    // Fade-in animation on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ;(entry.target as HTMLElement).style.opacity = '1'
          ;(entry.target as HTMLElement).style.transform = 'translateY(0)'
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.keynote-card, .testimonial-card, .client-item, .impactiq-feature').forEach(el => {
      ;(el as HTMLElement).style.opacity = '0'
      ;(el as HTMLElement).style.transform = 'translateY(20px)'
      ;(el as HTMLElement).style.transition = 'all 0.6s ease'
      observer.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormSubmitting(true)
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setFormSubmitted(true)
        form.reset()
      }
    } catch {
      alert('Something went wrong. Please email Jazmine@pivottraining.us directly.')
    }
    setFormSubmitting(false)
  }

  return (
    <>
      {/* NAVIGATION */}
      <nav id="navbar" className={menuOpen ? 'open' : ''}>
        <div className="container">
          <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            Chris <span>Marvel</span>
          </a>
          <ul className={`nav-links ${menuOpen ? 'show' : ''}`} id="navLinks">
            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about') }}>About</a></li>
            <li><a href="#keynotes" onClick={(e) => { e.preventDefault(); scrollTo('keynotes') }}>Keynotes</a></li>
            <li><a href="#reel" onClick={(e) => { e.preventDefault(); scrollTo('reel') }}>Reel</a></li>
            <li><a href="#book" onClick={(e) => { e.preventDefault(); scrollTo('book') }}>Book</a></li>
            <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollTo('testimonials') }}>Testimonials</a></li>
            <li><a href="#impactiq" onClick={(e) => { e.preventDefault(); scrollTo('impactiq') }}>ImpactIQ</a></li>
            <li><a href="#contact" className="nav-cta" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Book Chris</a></li>
          </ul>
          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <div className="hero-subtitle">Mental Health Performance Coach</div>
            <h1>Turning Pressure Into <span>Power</span></h1>
            <p className="hero-description">
              Chris Marvel helps organizations transform how they think about mental health —
              moving from crisis response to performance strategy. From NFL locker rooms to Fortune 500 boardrooms,
              his approach is direct, evidence-based, and built for real results.
            </p>
            <div className="hero-buttons">
              <a href="#contact" className="btn btn-primary" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Book Chris to Speak</a>
              <a href="#reel" className="btn btn-outline" onClick={(e) => { e.preventDefault(); scrollTo('reel') }}>Watch the Reel</a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-number">10+</div>
                <div className="hero-stat-label">Years Experience</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">NFL/NBA</div>
                <div className="hero-stat-label">Athlete Clients</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">M.S.</div>
                <div className="hero-stat-label">Psychology</div>
              </div>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="hero-image-frame">
              <img src="/images/hero-headshot.jpg" alt="Chris Marvel — Mental Health Performance Coach" />
            </div>
          </div>
        </div>
      </section>

      {/* MEDIA BAR */}
      <div className="media-bar">
        <div className="container">
          <div className="media-bar-label">As Featured In</div>
          <div className="media-logos">
            <span className="media-logo">ESPN</span>
            <span className="media-logo">FOX SPORTS</span>
            <span className="media-logo">HUFFPOST</span>
            <span className="media-logo">YAHOO</span>
            <span className="media-logo">NBC</span>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="container">
          <div className="about-image">
            <img src="/images/about-presenting.jpg" alt="Chris Marvel presenting at corporate workshop" />
          </div>
          <div className="about-content">
            <span className="section-label">About Chris</span>
            <h2>The Coach Behind the Movement</h2>
            <p className="about-text">
              Christopher &ldquo;Chris Marvel&rdquo; Davis is a Mental Health Performance Coach, professional speaker,
              and author with over a decade of experience optimizing performance through the lens of psychology.
              He holds a Bachelor&rsquo;s and Master&rsquo;s degree in Psychology, along with several life coaching certifications.
            </p>
            <p className="about-text">
              Chris has worked with some of the biggest names in professional sports — including Lamar Odom,
              Terrell Owens, and Ted Ginn Jr. — helping elite performers manage the mental demands of
              high-pressure environments. His work extends beyond athletics into corporate boardrooms,
              school districts, and nonprofit organizations nationwide.
            </p>
            <p className="about-text">
              As founder of Pivot Training &amp; Development alongside co-founder Jazmine Davis, Chris has built
              a mental health professional development company headquartered in Cleveland, Ohio and Atlanta, Georgia
              that is reshaping how organizations approach employee wellbeing.
            </p>
            <div className="about-credentials">
              <span className="credential-tag">M.S. Psychology</span>
              <span className="credential-tag">Certified Life Coach</span>
              <span className="credential-tag">Published Author</span>
              <span className="credential-tag">10+ Years Experience</span>
              <span className="credential-tag">NFL/NBA Coach</span>
            </div>
          </div>
        </div>
      </section>

      {/* KEYNOTES */}
      <section className="keynotes" id="keynotes">
        <div className="container">
          <span className="section-label">Signature Keynotes</span>
          <h2>Three Talks That Transform Organizations</h2>
          <p className="keynotes-subtitle">Each keynote is customizable for corporate, education, and nonprofit audiences. Available as 60-minute keynotes, half-day workshops, or full-day immersive training.</p>
          <div className="keynote-grid">
            <div className="keynote-card">
              <div className="keynote-number">01</div>
              <h3>Pressure Is a Privilege</h3>
              <p>A powerful exploration of how high performers can reframe stress as fuel rather than a barrier to success.</p>
              <ul className="keynote-takeaways">
                <li>Reframe pressure as a performance catalyst</li>
                <li>Build mental resilience frameworks for sustained excellence</li>
                <li>Identify personal stress signatures and response patterns</li>
                <li>Develop team-wide psychological safety practices</li>
              </ul>
              <div className="keynote-audience">Best For: Corporate Teams &bull; Leadership Retreats &bull; Conferences</div>
            </div>
            <div className="keynote-card">
              <div className="keynote-number">02</div>
              <h3>The Invisible Injury</h3>
              <p>Unveiling the hidden mental health challenges that silently erode performance, culture, and retention.</p>
              <ul className="keynote-takeaways">
                <li>Recognize the signs others miss — in yourself and your team</li>
                <li>Understand the true cost of unaddressed mental health in the workplace</li>
                <li>Build environments where seeking help is strength, not weakness</li>
                <li>Implement early intervention strategies that prevent crises</li>
              </ul>
              <div className="keynote-audience">Best For: Education &bull; Healthcare &bull; HR Professionals</div>
            </div>
            <div className="keynote-card">
              <div className="keynote-number">03</div>
              <h3>The What If Effect</h3>
              <p>Based on Chris&rsquo;s bestselling book — a framework for breaking through the mental barriers that keep us stuck.</p>
              <ul className="keynote-takeaways">
                <li>Overcome the &ldquo;what if&rdquo; paralysis that blocks action</li>
                <li>Transform fear-based thinking into possibility-driven strategy</li>
                <li>Build a personal operating system for mental clarity</li>
                <li>Create accountability structures that sustain growth</li>
              </ul>
              <div className="keynote-audience">Best For: All Audiences &bull; Motivational Events &bull; Student Groups</div>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY STRIP */}
      <section className="photo-gallery">
        <div className="gallery-strip">
          <img src="/images/gallery-stage.jpg" alt="Chris Marvel on stage with microphone" />
          <img src="/images/gallery-workshop.jpg" alt="Chris Marvel leading workshop" />
          <img src="/images/gallery-ballroom.jpg" alt="Chris Marvel speaking to packed ballroom" />
          <img src="/images/gallery-education.jpg" alt="Chris Marvel presenting on emotional intelligence in education" />
        </div>
      </section>

      {/* SPEAKER REEL */}
      <section className="reel" id="reel">
        <div className="container">
          <span className="section-label" style={{ textAlign: 'center', display: 'block' }}>See Chris In Action</span>
          <h2>Speaker Reel</h2>
          <p className="reel-subtitle">60 seconds of what it looks like when psychology meets the stage.</p>
          <div className="reel-container" data-video-url="">
            <img className="reel-bg" src="/images/reel-thumbnail.jpg" alt="Chris Marvel speaking on stage" />
            <div className="play-button"></div>
            <span className="reel-label">Click to play speaker reel</span>
          </div>
        </div>
      </section>

      {/* BOOK */}
      <section className="book" id="book">
        <div className="container">
          <div className="book-cover">
            <img src="/images/book-cover.jpg" alt="The What If Effect by Chris Marvel Davis — Flip Doubt Into Direction" />
          </div>
          <div className="book-content">
            <span className="section-label">The Book</span>
            <h2>The What If Effect</h2>
            <p className="book-description">
              What if the only thing standing between you and your breakthrough is the story you keep telling yourself?
              In &ldquo;The What If Effect: Flip Doubt Into Direction,&rdquo; Chris Marvel draws on a decade of coaching elite athletes
              and corporate leaders to reveal the mental patterns that keep high performers stuck — and the precise strategies to break through them.
            </p>
            <p className="book-description">
              This isn&rsquo;t another motivational book filled with empty affirmations. It&rsquo;s a psychology-backed playbook
              for anyone ready to stop asking &ldquo;what if&rdquo; out of fear and start asking &ldquo;what if&rdquo; out of possibility.
            </p>
            <div className="book-cta">
              <a href="#" className="btn btn-dark">Get the Book</a>
              <a href="#contact" className="btn btn-outline" style={{ color: 'var(--navy)', borderColor: 'var(--navy)' }} onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Bulk Orders for Events</a>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <span className="section-label" style={{ textAlign: 'center', display: 'block' }}>What People Say</span>
          <h2>Client Testimonials</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">
                Chris has a rare ability to connect complex psychology concepts to real-world workplace challenges.
                Our leadership team walked away with actionable strategies they started implementing the same week.
              </p>
              <div className="testimonial-author">Johnson &amp; Johnson</div>
              <div className="testimonial-title">Corporate Workshop Client</div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                The way Chris broke down mental health for our educators was a game-changer. Our teachers finally
                felt seen and equipped. Absenteeism dropped and morale went up within one semester.
              </p>
              <div className="testimonial-author">Cleveland Metropolitan School District</div>
              <div className="testimonial-title">Education Partner</div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                Working with Chris changed how I approach the mental side of competition. He doesn&rsquo;t just talk
                about mental health — he gives you a system that actually works under pressure.
              </p>
              <div className="testimonial-author">Professional Athlete Client</div>
              <div className="testimonial-title">NFL / NBA</div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                We brought Chris in for our annual staff development day and the feedback was overwhelming.
                Staff rated his session the highest of any professional development we&rsquo;ve offered in five years.
              </p>
              <div className="testimonial-author">Clark County School District</div>
              <div className="testimonial-title">Education Partner</div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="clients">
        <div className="container">
          <span className="section-label" style={{ textAlign: 'center', display: 'block' }}>Trusted By</span>
          <h2>Organizations That Trust Chris</h2>
          <p className="clients-subtitle">From professional sports franchises to Fortune 500 companies to public school districts.</p>
          <div className="client-grid">
            <div className="client-item">Johnson &amp; Johnson</div>
            <div className="client-item">Cleveland Metro Schools</div>
            <div className="client-item">Clark County Schools</div>
            <div className="client-item">Head Start</div>
            <div className="client-item">Fort Valley State University</div>
            <div className="client-item">NFL Athletes</div>
            <div className="client-item">NBA Athletes</div>
            <div className="client-item">Nonprofit Organizations</div>
          </div>
        </div>
      </section>

      {/* IMPACTIQ */}
      <section className="impactiq" id="impactiq">
        <div className="container">
          <span className="section-label" style={{ textAlign: 'center', display: 'block', color: '#818CF8' }}>Powered by Pivot</span>
          <h2>Introducing ImpactIQ&trade;</h2>
          <p className="impactiq-subtitle">
            The world&rsquo;s first stress-response personality assessment. Discover your Impact Archetype —
            how you process pressure, drive action, and influence those around you.
          </p>
          <div className="impactiq-features">
            <div className="impactiq-feature">
              <div className="impactiq-feature-icon">&#x1F9E0;</div>
              <h3>6 Archetypes</h3>
              <p>Absorber, Reactor, Executor, Avoider, Strategist, Interrogator — which one drives you?</p>
            </div>
            <div className="impactiq-feature">
              <div className="impactiq-feature-icon">&#x1F4CA;</div>
              <h3>Science-Backed</h3>
              <p>Built on Polyvagal Theory, Emotional Intelligence research, and behavioral psychology.</p>
            </div>
            <div className="impactiq-feature">
              <div className="impactiq-feature-icon">&#x1F3AF;</div>
              <h3>Team Insights</h3>
              <p>Understand team dynamics, communication gaps, and collaboration opportunities.</p>
            </div>
          </div>
          <a href="https://impactiq-taupe.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn btn-indigo">Take the Free Assessment</a>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="contact-info">
            <span className="section-label">Book Chris</span>
            <h2>Let&rsquo;s Build Something Together</h2>
            <p className="contact-description">
              Whether you need a keynote that moves the room, a workshop that transforms your team,
              or a multi-session training program that shifts your organizational culture — Chris delivers.
            </p>
            <ul className="contact-details">
              <li>
                <div>
                  <span className="label">Booking Inquiries</span>
                  Jazmine@pivottraining.us
                </div>
              </li>
              <li>
                <div>
                  <span className="label">Phone</span>
                  (770) 313-1232
                </div>
              </li>
              <li>
                <div>
                  <span className="label">Headquarters</span>
                  Cleveland, OH &bull; Atlanta, GA
                </div>
              </li>
              <li>
                <div>
                  <span className="label">Investment Range</span>
                  Starting at $7,500 | Education &amp; nonprofit rates available
                </div>
              </li>
            </ul>
          </div>
          <div className="contact-form">
            {formSubmitted ? (
              <div className="form-success">
                <h3>Thank You!</h3>
                <p>Your inquiry has been submitted. Jazmine will be in touch within 24–48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="_subject" value="New Booking Inquiry — ChrisMarvel.com" />
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input type="text" name="name" placeholder="Full name" required />
                  </div>
                  <div className="form-group">
                    <label>Organization</label>
                    <input type="text" name="organization" placeholder="Company or school name" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" placeholder="you@company.com" required />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" placeholder="(555) 555-5555" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Event Type</label>
                  <select name="event_type">
                    <option value="">Select an option</option>
                    <option>Corporate Keynote</option>
                    <option>Half-Day Workshop</option>
                    <option>Full-Day Training</option>
                    <option>Multi-Session Program</option>
                    <option>Conference Speaker</option>
                    <option>Education / School District</option>
                    <option>Nonprofit Event</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tell Us About Your Event</label>
                  <textarea name="message" placeholder="Date, audience size, goals, specific topics of interest..."></textarea>
                </div>
                <button type="submit" className="btn btn-gold" disabled={formSubmitting}>
                  {formSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">Chris <span>Marvel</span> &bull; Pivot Training &amp; Development</div>
            <ul className="footer-links">
              <li><a href="#keynotes" onClick={(e) => { e.preventDefault(); scrollTo('keynotes') }}>Keynotes</a></li>
              <li><a href="#book" onClick={(e) => { e.preventDefault(); scrollTo('book') }}>Book</a></li>
              <li><a href="#impactiq" onClick={(e) => { e.preventDefault(); scrollTo('impactiq') }}>ImpactIQ</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Contact</a></li>
            </ul>
            <div className="footer-copy">&copy; 2026 Pivot Training &amp; Development. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </>
  )
}
