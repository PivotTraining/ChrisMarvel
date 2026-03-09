'use client'

import './globals.css'
import { useEffect, useState } from 'react'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.getElementById('navbar')
      if (nav) {
        nav.style.background = window.scrollY > 50
          ? 'rgba(17, 29, 53, 0.98)'
          : 'rgba(17, 29, 53, 0.95)'
      }
    }
    window.addEventListener('scroll', handleScroll)

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))

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
      {/* ===== NAVIGATION ===== */}
      <nav id="navbar" className={menuOpen ? 'open' : ''}>
        <div className="container">
          <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            Chris <img src="/images/chris-marvel-logo.png" alt="Chris Marvel logo" className="nav-logo-icon" /> <span>Marvel</span>
          </a>
          <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about') }}>About</a></li>
            <li><a href="#keynotes" onClick={(e) => { e.preventDefault(); scrollTo('keynotes') }}>Keynotes</a></li>
            <li><a href="#reel" onClick={(e) => { e.preventDefault(); scrollTo('reel') }}>Reel</a></li>
            <li><a href="#book" onClick={(e) => { e.preventDefault(); scrollTo('book') }}>Book</a></li>
            <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollTo('testimonials') }}>Testimonials</a></li>
            <li><a href="#contact" className="nav-cta" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Book Chris</a></li>
          </ul>
          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <span className="badge badge-gold">Mental Health Performance Coach</span>
            <h1>Turning Pressure<br />Into <span className="accent">Power</span></h1>
            <p className="hero-tagline">
              From NFL locker rooms to Fortune 500 boardrooms — Chris Marvel transforms how organizations think about mental health.
            </p>
            <p className="hero-description">
              With over a decade of experience and a Master&rsquo;s in Psychology, Chris helps
              high-performers and organizations move from crisis response to performance strategy.
              His approach is direct, evidence-based, and built for real results.
            </p>
            <div className="hero-buttons">
              <a href="#contact" className="btn btn-gold" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Book Chris to Speak</a>
              <a href="#reel" className="btn btn-outline-white" onClick={(e) => { e.preventDefault(); scrollTo('reel') }}>Watch the Reel</a>
            </div>
          </div>
          <div className="hero-image-container">
            <img src="/images/hero-headshot.jpg" alt="Chris Marvel — Mental Health Performance Coach" />
          </div>
        </div>
      </section>

      {/* ===== TRUSTED BY BAR ===== */}
      <div className="trusted-bar">
        <div className="container">
          <div className="trusted-bar-label">Trusted By</div>
          <div className="trusted-logos">
            <span>Johnson &amp; Johnson</span>
            <span>Cleveland Metro Schools</span>
            <span>Clark County Schools</span>
            <span>Head Start</span>
            <span>NFL / NBA</span>
          </div>
        </div>
      </div>

      {/* ===== MISSION / ABOUT ===== */}
      <section className="mission" id="about">
        <div className="container">
          <div className="mission-content">
            <span className="badge badge-gold">About Chris</span>
            <h2>The Coach Behind<br />The <span className="accent">Movement</span></h2>
            <p>
              Christopher &ldquo;Chris Marvel&rdquo; Davis is a Mental Health Performance Coach, professional speaker,
              and author with over a decade of experience optimizing performance through the lens of psychology.
              He holds a Bachelor&rsquo;s and Master&rsquo;s degree in Psychology, along with several life coaching certifications.
            </p>
            <p>
              Chris has worked with some of the biggest names in professional sports — including Lamar Odom,
              Terrell Owens, and Ted Ginn Jr. — helping elite performers manage the mental demands of
              high-pressure environments. His work extends beyond athletics into corporate boardrooms,
              school districts, and nonprofit organizations nationwide.
            </p>
            <p>
              As founder of Pivot Training &amp; Development alongside co-founder Jazmine Davis, Chris has built
              a mental health professional development company headquartered in Cleveland, Ohio and Atlanta, Georgia
              that is reshaping how organizations approach employee wellbeing.
            </p>
            <div className="credentials-row">
              <span className="credential-tag">M.S. Psychology</span>
              <span className="credential-tag">Certified Life Coach</span>
              <span className="credential-tag">Published Author</span>
              <span className="credential-tag">10+ Years Experience</span>
              <span className="credential-tag">NFL/NBA Coach</span>
            </div>
            <a href="#contact" className="btn btn-navy" onClick={(e) => { e.preventDefault(); scrollTo('contact') }} style={{ marginTop: '32px' }}>Get In Touch</a>
          </div>
          <div className="mission-image">
            <img src="/images/about-presenting.jpg" alt="Chris Marvel presenting at corporate workshop" />
          </div>
        </div>
      </section>

      {/* ===== FULL-WIDTH STAGE PHOTO ===== */}
      <div className="stage-photo">
        <img src="/images/gallery-stage.jpg" alt="Chris Marvel delivering keynote on stage" />
      </div>

      {/* ===== KEYNOTES ===== */}
      <section className="keynotes" id="keynotes">
        <div className="container">
          <span className="badge badge-gold">Signature Keynotes</span>
          <h2>Talks That <span className="accent">Transform</span></h2>
          <p className="keynotes-subtitle">
            Each keynote is customizable for corporate, education, and nonprofit audiences.
            Available as 60-minute keynotes, half-day workshops, or full-day immersive training.
          </p>
          <div className="keynote-grid">
            <div className="keynote-card fade-in">
              <div className="keynote-card-icon">&#9889;</div>
              <h3>Pressure Is a Privilege</h3>
              <p>
                A powerful exploration of how high performers can reframe stress as fuel rather than a barrier.
                Learn to build mental resilience frameworks and develop team-wide psychological safety practices.
              </p>
            </div>
            <div className="keynote-card fade-in">
              <div className="keynote-card-icon">&#128065;</div>
              <h3>The Invisible Injury</h3>
              <p>
                Unveiling the hidden mental health challenges that silently erode performance, culture, and retention.
                Recognize the signs others miss and build environments where seeking help is strength.
              </p>
            </div>
            <div className="keynote-card fade-in">
              <div className="keynote-card-icon">&#128161;</div>
              <h3>The What If Effect</h3>
              <p>
                Based on Chris&rsquo;s book — a framework for breaking through the mental barriers that keep us stuck.
                Transform fear-based thinking into possibility-driven strategy.
              </p>
            </div>
            <div className="keynote-card fade-in">
              <div className="keynote-card-icon">&#127919;</div>
              <h3>Custom Programs</h3>
              <p>
                Multi-session training designed for your organization&rsquo;s specific needs.
                From corporate wellness initiatives to school district programs — tailored for lasting impact.
              </p>
            </div>
          </div>
          <a href="#contact" className="btn btn-gold" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Request a Topic</a>
        </div>
      </section>

      {/* ===== PHOTO GALLERY STRIP ===== */}
      <section className="photo-gallery">
        <div className="gallery-strip">
          <img src="/images/gallery-workshop.jpg" alt="Chris Marvel leading workshop" />
          <img src="/images/gallery-ballroom.jpg" alt="Chris Marvel speaking to packed ballroom" />
          <img src="/images/gallery-education.jpg" alt="Chris Marvel presenting on emotional intelligence in education" />
          <img src="/images/about-presenting.jpg" alt="Chris Marvel engaging audience in blue shirt" />
        </div>
      </section>

      {/* ===== SPEAKER REEL ===== */}
      <section className="reel-section" id="reel">
        <div className="container">
          <span className="badge badge-navy">See Chris In Action</span>
          <h2>Speaker <span className="accent">Reel</span></h2>
          <p className="reel-subtitle">60 seconds of what it looks like when psychology meets the stage.</p>
          <div className="reel-container">
            <img src="/images/gallery-stage.jpg" alt="Chris Marvel speaking on stage" />
            <div className="play-btn"></div>
          </div>
        </div>
      </section>

      {/* ===== BOOK ===== */}
      <section className="book-section" id="book">
        <div className="container">
          <div className="book-cover">
            <img src="/images/book-cover.jpg" alt="The What If Effect by Chris Marvel Davis — Flip Doubt Into Direction" />
          </div>
          <div className="book-content">
            <span className="badge badge-gold">The Book</span>
            <h2>The What If <span className="accent">Effect</span></h2>
            <p>
              What if the only thing standing between you and your breakthrough is the story you keep telling yourself?
              In &ldquo;The What If Effect: Flip Doubt Into Direction,&rdquo; Chris Marvel draws on a decade of coaching elite athletes
              and corporate leaders to reveal the mental patterns that keep high performers stuck — and the precise strategies to break through them.
            </p>
            <p>
              This isn&rsquo;t another motivational book filled with empty affirmations. It&rsquo;s a psychology-backed playbook
              for anyone ready to stop asking &ldquo;what if&rdquo; out of fear and start asking &ldquo;what if&rdquo; out of possibility.
            </p>
            <div className="book-buttons">
              <a href="#" className="btn btn-navy">Get the Book</a>
              <a href="#contact" className="btn btn-outline-white" style={{ color: 'var(--navy)', borderColor: 'var(--navy)' }} onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Bulk Orders for Events</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <span className="badge badge-gold">What People Say</span>
          <h2>Client <span className="accent">Testimonials</span></h2>
          <div className="testimonial-grid">
            <div className="testimonial-card fade-in">
              <p className="testimonial-text">
                Chris has a rare ability to connect complex psychology concepts to real-world workplace challenges.
                Our leadership team walked away with actionable strategies they started implementing the same week.
              </p>
              <div className="testimonial-author">Johnson &amp; Johnson</div>
              <div className="testimonial-title">Corporate Workshop Client</div>
            </div>
            <div className="testimonial-card fade-in">
              <p className="testimonial-text">
                The way Chris broke down mental health for our educators was a game-changer. Our teachers finally
                felt seen and equipped. Absenteeism dropped and morale went up within one semester.
              </p>
              <div className="testimonial-author">Cleveland Metropolitan School District</div>
              <div className="testimonial-title">Education Partner</div>
            </div>
            <div className="testimonial-card fade-in">
              <p className="testimonial-text">
                Working with Chris changed how I approach the mental side of competition. He doesn&rsquo;t just talk
                about mental health — he gives you a system that actually works under pressure.
              </p>
              <div className="testimonial-author">Professional Athlete Client</div>
              <div className="testimonial-title">NFL / NBA</div>
            </div>
            <div className="testimonial-card fade-in">
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

      {/* ===== CTA BANNER ===== */}
      <section className="cta-banner">
        <div className="bg-img">
          <img src="/images/gallery-ballroom.jpg" alt="Chris Marvel speaking" />
        </div>
        <div className="container">
          <div className="cta-banner-sub">Ready to Transform Your Organization?</div>
          <h2>Bring Chris Marvel<br />To Your Next Event</h2>
          <p>Whether it&rsquo;s a keynote, workshop, or multi-session program — Chris delivers results that last.</p>
          <a href="#contact" className="btn btn-gold" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Book Chris Now</a>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="contact-info">
            <span className="badge badge-gold">Book Chris</span>
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

      {/* ===== FOOTER ===== */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-col">
              <div className="footer-brand-name">Chris <span>Marvel</span></div>
              <p className="footer-brand-tagline">
                Mental Health Performance Coach, keynote speaker, and author transforming how organizations approach wellbeing.
              </p>
              <div className="social-links">
                <a href="#" aria-label="LinkedIn">in</a>
                <a href="#" aria-label="Instagram">ig</a>
                <a href="#" aria-label="Facebook">fb</a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4>Navigate</h4>
              <ul>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about') }}>About</a></li>
                <li><a href="#keynotes" onClick={(e) => { e.preventDefault(); scrollTo('keynotes') }}>Keynotes</a></li>
                <li><a href="#book" onClick={(e) => { e.preventDefault(); scrollTo('book') }}>The Book</a></li>
                <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollTo('testimonials') }}>Testimonials</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="footer-col">
              <h4>Resources</h4>
              <ul>
                <li><a href="#reel" onClick={(e) => { e.preventDefault(); scrollTo('reel') }}>Speaker Reel</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Book Chris</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="footer-col">
              <h4>Contact</h4>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">&#9993;</span>
                <span>Jazmine@pivottraining.us</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">&#9742;</span>
                <span>(770) 313-1232</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">&#9679;</span>
                <span>Cleveland, OH &bull; Atlanta, GA</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; 2026 Pivot Training &amp; Development. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}
