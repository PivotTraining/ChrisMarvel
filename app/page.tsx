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
      const res = await fetch('https://api.web3forms.com/submit', {
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
      <nav id="navbar" className={menuOpen ? 'open' : ''} aria-label="Main navigation">
        <div className="container">
          <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} aria-label="Chris Marvel — Keynote Speaker homepage">
            Chris<img src="/images/chris-marvel-logo.png" alt="Chris Marvel keynote speaker logo" className="nav-logo-icon" width={28} height={28} /><span>Marvel</span>
          </a>
          <ul className={`nav-links ${menuOpen ? 'show' : ''}`} role="menubar">
            <li role="none"><a href="#about" role="menuitem" onClick={(e) => { e.preventDefault(); scrollTo('about') }}>About</a></li>
            <li role="none"><a href="#keynotes" role="menuitem" onClick={(e) => { e.preventDefault(); scrollTo('keynotes') }}>Keynotes</a></li>
            <li role="none"><a href="#reel" role="menuitem" onClick={(e) => { e.preventDefault(); scrollTo('reel') }}>Reel</a></li>
            <li role="none"><a href="#book" role="menuitem" onClick={(e) => { e.preventDefault(); scrollTo('book') }}>Book</a></li>
            <li role="none"><a href="#testimonials" role="menuitem" onClick={(e) => { e.preventDefault(); scrollTo('testimonials') }}>Testimonials</a></li>
            <li role="none"><a href="#contact" className="nav-cta" role="menuitem" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Book Chris</a></li>
          </ul>
          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation menu" aria-expanded={menuOpen}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <span className="badge badge-gold">Mental Health Performance Coach &amp; Keynote Speaker</span>
            <h1>Keynote Speaker Turning Pressure<br />Into <span className="accent">Power</span></h1>
            <p className="hero-tagline">
              From NFL locker rooms to Fortune 500 boardrooms — keynote speaker Chris Marvel transforms how organizations think about mental health, resilience, and peak performance.
            </p>
            <p className="hero-description">
              With over a decade of experience and a Master&rsquo;s in Psychology, Chris Marvel helps
              high-performers and organizations move from crisis response to performance strategy.
              His keynotes, workshops, and training programs are direct, evidence-based, and built for real results.
              Trusted by Johnson &amp; Johnson, Cleveland Metro Schools, and professional athletes from the NFL and NBA.
            </p>
            <div className="hero-buttons">
              <a href="#contact" className="btn btn-gold" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Book Chris to Speak</a>
              <a href="#reel" className="btn btn-outline-white" onClick={(e) => { e.preventDefault(); scrollTo('reel') }}>Watch the Speaker Reel</a>
            </div>
          </div>
          <div className="hero-image-container">
            <img
              src="/images/hero-headshot.jpg"
              alt="Chris Marvel — keynote speaker and mental health performance coach available for corporate events, conferences, and workshops"
              width={520}
              height={520}
              loading="eager"
            />
          </div>
        </div>
      </header>

      {/* ===== TRUSTED BY BAR ===== */}
      <section className="trusted-bar" aria-label="Organizations that trust Chris Marvel">
        <div className="container">
          <div className="trusted-bar-label">Trusted By Leading Organizations</div>
          <div className="trusted-logos">
            <span>Johnson &amp; Johnson</span>
            <span>Cleveland Metro Schools</span>
            <span>Clark County Schools</span>
            <span>Head Start</span>
            <span>NFL / NBA</span>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="mission" id="about" aria-label="About keynote speaker Chris Marvel">
        <div className="container">
          <div className="mission-content">
            <span className="badge badge-gold">About the Speaker</span>
            <h2>The Coach Behind<br />The <span className="accent">Movement</span></h2>
            <p>
              Christopher &ldquo;Chris Marvel&rdquo; Davis is a <strong>Mental Health Performance Coach</strong>, <strong>professional keynote speaker</strong>,
              and published author with over a decade of experience optimizing human performance through the lens of psychology.
              He holds a Bachelor&rsquo;s and Master&rsquo;s degree in Psychology, along with several life coaching certifications.
            </p>
            <p>
              As a sought-after <strong>corporate keynote speaker</strong> and <strong>mental health workshop facilitator</strong>,
              Chris has worked with some of the biggest names in professional sports — including <strong>Lamar Odom</strong>,
              <strong> Terrell Owens</strong>, and <strong>Ted Ginn Jr.</strong> — helping elite performers manage the mental demands of
              high-pressure environments. His work extends beyond athletics into Fortune 500 boardrooms,
              school districts, HBCUs, and nonprofit organizations nationwide.
            </p>
            <p>
              As founder of <strong>Pivot Training &amp; Development</strong> alongside co-founder Jazmine Davis, Chris has built
              a <strong>mental health professional development company</strong> headquartered in Cleveland, Ohio and Atlanta, Georgia
              that is reshaping how organizations approach employee wellbeing, leadership development, and workplace culture.
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
            <img src="/images/about-presenting.jpg" alt="Keynote speaker Chris Marvel presenting mental health workshop to corporate audience" loading="lazy" width={600} height={400} />
          </div>
        </div>
      </section>

      {/* ===== FULL-WIDTH STAGE PHOTO ===== */}
      <div className="stage-photo" role="img" aria-label="Chris Marvel delivering keynote speech on stage at major conference">
        <img src="/images/gallery-stage.jpg" alt="Chris Marvel delivering mental health keynote on stage at corporate conference event" loading="lazy" />
      </div>

      {/* ===== KEYNOTES ===== */}
      <section className="keynotes" id="keynotes" aria-label="Keynote speaking topics and programs">
        <div className="container">
          <span className="badge badge-gold">Signature Keynotes &amp; Workshops</span>
          <h2>Keynote Talks That <span className="accent">Transform</span></h2>
          <p className="keynotes-subtitle">
            Each keynote is customizable for corporate, education, and nonprofit audiences.
            Available as 60-minute keynotes, half-day workshops, or full-day immersive training programs.
            Chris Marvel tailors every presentation to your organization&rsquo;s specific goals and challenges.
          </p>
          <div className="keynote-grid">
            <article className="keynote-card fade-in">
              <div className="keynote-card-icon">&#9889;</div>
              <h3>Pressure Is a Privilege</h3>
              <p>
                A powerful keynote exploring how high performers can reframe stress as fuel rather than a barrier.
                Learn to build mental resilience frameworks and develop team-wide psychological safety practices.
                Ideal for <strong>corporate leadership teams</strong> and <strong>high-performance organizations</strong>.
              </p>
            </article>
            <article className="keynote-card fade-in">
              <div className="keynote-card-icon">&#128065;</div>
              <h3>The Invisible Injury</h3>
              <p>
                Unveiling the hidden <strong>mental health challenges</strong> that silently erode performance, culture, and retention.
                Recognize the signs others miss and build environments where seeking help is strength.
                Perfect for <strong>school districts</strong>, <strong>HR professionals</strong>, and <strong>healthcare organizations</strong>.
              </p>
            </article>
            <article className="keynote-card fade-in">
              <div className="keynote-card-icon">&#128161;</div>
              <h3>The What If Effect</h3>
              <p>
                Based on Chris Marvel&rsquo;s bestselling book — a framework for breaking through the mental barriers that keep us stuck.
                Transform fear-based thinking into possibility-driven strategy.
                A <strong>motivational keynote</strong> for anyone ready to unlock their next level of performance.
              </p>
            </article>
            <article className="keynote-card fade-in">
              <div className="keynote-card-icon">&#127919;</div>
              <h3>Custom Programs &amp; Workshops</h3>
              <p>
                Multi-session <strong>professional development training</strong> designed for your organization&rsquo;s specific needs.
                From <strong>corporate wellness initiatives</strong> to <strong>school district programs</strong> and <strong>nonprofit training</strong> — tailored for lasting impact.
              </p>
            </article>
          </div>
          <a href="#contact" className="btn btn-gold" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Request a Keynote Topic</a>
        </div>
      </section>

      {/* ===== PHOTO GALLERY STRIP ===== */}
      <section className="photo-gallery" aria-label="Chris Marvel keynote speaker photo gallery">
        <div className="gallery-strip">
          <img src="/images/gallery-workshop.jpg" alt="Chris Marvel leading interactive mental health workshop for corporate team" loading="lazy" width={400} height={300} />
          <img src="/images/gallery-ballroom.jpg" alt="Chris Marvel delivering keynote speech to packed ballroom at national conference" loading="lazy" width={400} height={300} />
          <img src="/images/gallery-education.jpg" alt="Chris Marvel presenting emotional intelligence keynote for educators and school administrators" loading="lazy" width={400} height={300} />
          <img src="/images/about-presenting.jpg" alt="Keynote speaker Chris Marvel engaging corporate audience during workplace wellness presentation" loading="lazy" width={400} height={300} />
        </div>
      </section>

      {/* ===== SPEAKER REEL ===== */}
      <section className="reel-section" id="reel" aria-label="Chris Marvel keynote speaker demo reel">
        <div className="container">
          <span className="badge badge-navy">See Chris Marvel In Action</span>
          <h2>Keynote Speaker <span className="accent">Reel</span></h2>
          <p className="reel-subtitle">Watch what happens when psychology meets the stage. See why event planners and speaker bureaus book Chris Marvel for their most important events.</p>
          <a href="https://youtu.be/AAAURVaEE48?si=4LKNwd9qRLYzhkNp" target="_blank" rel="noopener noreferrer" className="reel-container" aria-label="Watch Chris Marvel keynote speaker demo reel on YouTube">
            <img src="/images/gallery-stage.jpg" alt="Chris Marvel keynote speaker demo reel — watch highlights from corporate events, conferences, and workshops" loading="lazy" />
            <div className="play-btn" role="button" aria-label="Play speaker demo reel video"></div>
          </a>
        </div>
      </section>

      {/* ===== BOOK ===== */}
      <section className="book-section" id="book" aria-label="The What If Effect book by Chris Marvel Davis">
        <div className="container">
          <div className="book-cover">
            <img src="/images/book-cover.jpg" alt="The What If Effect: Flip Doubt Into Direction — bestselling book by keynote speaker Chris Marvel Davis on mental performance and resilience" loading="lazy" width={350} height={500} />
          </div>
          <div className="book-content">
            <span className="badge badge-gold">The Book</span>
            <h2>The What If <span className="accent">Effect</span></h2>
            <p>
              What if the only thing standing between you and your breakthrough is the story you keep telling yourself?
              In &ldquo;<strong>The What If Effect: Flip Doubt Into Direction</strong>,&rdquo; keynote speaker Chris Marvel draws on a decade of coaching elite athletes
              and corporate leaders to reveal the mental patterns that keep high performers stuck — and the precise strategies to break through them.
            </p>
            <p>
              This isn&rsquo;t another motivational book filled with empty affirmations. It&rsquo;s a <strong>psychology-backed playbook</strong>
              for anyone ready to stop asking &ldquo;what if&rdquo; out of fear and start asking &ldquo;what if&rdquo; out of possibility.
              Available for individual purchase and <strong>bulk orders for corporate events</strong>, conferences, and team retreats.
            </p>
            <div className="book-buttons">
              <a href="#" className="btn btn-navy">Get the Book</a>
              <a href="#contact" className="btn btn-outline-white" style={{ color: 'var(--navy)', borderColor: 'var(--navy)' }} onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Bulk Orders for Events</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials" id="testimonials" aria-label="Client testimonials and reviews for keynote speaker Chris Marvel">
        <div className="container">
          <span className="badge badge-gold">What Clients Say</span>
          <h2>Keynote Speaker <span className="accent">Testimonials</span></h2>
          <div className="testimonial-grid">
            <article className="testimonial-card fade-in">
              <p className="testimonial-text">
                Chris has a rare ability to connect complex psychology concepts to real-world workplace challenges.
                Our leadership team walked away with actionable strategies they started implementing the same week.
              </p>
              <div className="testimonial-author">Johnson &amp; Johnson</div>
              <div className="testimonial-title">Corporate Keynote &amp; Workshop Client</div>
            </article>
            <article className="testimonial-card fade-in">
              <p className="testimonial-text">
                The way Chris broke down mental health for our educators was a game-changer. Our teachers finally
                felt seen and equipped. Absenteeism dropped and morale went up within one semester.
              </p>
              <div className="testimonial-author">Cleveland Metropolitan School District</div>
              <div className="testimonial-title">Education Keynote Partner</div>
            </article>
            <article className="testimonial-card fade-in">
              <p className="testimonial-text">
                Working with Chris changed how I approach the mental side of competition. He doesn&rsquo;t just talk
                about mental health — he gives you a system that actually works under pressure.
              </p>
              <div className="testimonial-author">Professional Athlete Client</div>
              <div className="testimonial-title">NFL / NBA Performance Coaching</div>
            </article>
            <article className="testimonial-card fade-in">
              <p className="testimonial-text">
                We brought Chris in for our annual staff development day and the feedback was overwhelming.
                Staff rated his session the highest of any professional development we&rsquo;ve offered in five years.
              </p>
              <div className="testimonial-author">Clark County School District</div>
              <div className="testimonial-title">Education Keynote Partner</div>
            </article>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-banner" aria-label="Book keynote speaker Chris Marvel for your event">
        <div className="bg-img">
          <img src="/images/gallery-ballroom.jpg" alt="Chris Marvel speaking to large audience at corporate conference event" loading="lazy" />
        </div>
        <div className="container">
          <div className="cta-banner-sub">Ready to Transform Your Organization?</div>
          <h2>Book Keynote Speaker Chris Marvel<br />For Your Next Event</h2>
          <p>Whether it&rsquo;s a corporate keynote, leadership workshop, or multi-session training program — Chris Marvel delivers measurable results that last.</p>
          <a href="#contact" className="btn btn-gold" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Book Chris Marvel Now</a>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="faq-section" id="faq" aria-label="Frequently asked questions about booking keynote speaker Chris Marvel">
        <div className="container">
          <span className="badge badge-gold">FAQ</span>
          <h2>Frequently Asked <span className="accent">Questions</span></h2>
          <div className="faq-grid">
            <details className="faq-item" open>
              <summary>What topics does Chris Marvel speak about?</summary>
              <p>Chris delivers keynotes on mental health performance, workplace wellness, emotional intelligence, resilience, and leadership. His signature keynotes include &ldquo;Pressure Is a Privilege,&rdquo; &ldquo;The Invisible Injury,&rdquo; and &ldquo;The What If Effect.&rdquo; All topics are fully customizable for corporate, education, and nonprofit audiences.</p>
            </details>
            <details className="faq-item">
              <summary>How do I get a quote for booking Chris Marvel?</summary>
              <p>Every engagement is customized based on your event type, audience size, duration, and goals. We offer flexible options for corporate, education, and nonprofit organizations. Fill out the booking form below or contact Jazmine@pivottraining.us to receive a tailored proposal for your event.</p>
            </details>
            <details className="faq-item">
              <summary>What types of events does Chris speak at?</summary>
              <p>Chris speaks at corporate conferences, leadership summits, professional development days, school district training, HBCU events, nonprofit galas, team retreats, and industry conventions. He offers 60-minute keynotes, half-day workshops, full-day training, and multi-session programs.</p>
            </details>
            <details className="faq-item">
              <summary>Does Chris travel for speaking engagements?</summary>
              <p>Yes. Chris is headquartered in Cleveland, Ohio and Atlanta, Georgia, and is available for speaking engagements nationwide across the United States. Virtual and hybrid keynote options are also available for remote teams and global audiences.</p>
            </details>
            <details className="faq-item">
              <summary>What organizations has Chris worked with?</summary>
              <p>Chris has delivered keynotes and training for Johnson &amp; Johnson, Cleveland Metropolitan School District, Clark County Schools, Head Start, and has coached professional athletes from the NFL and NBA including Lamar Odom, Terrell Owens, and Ted Ginn Jr.</p>
            </details>
            <details className="faq-item">
              <summary>What are Chris Marvel&rsquo;s credentials?</summary>
              <p>Chris holds a Master&rsquo;s degree and Bachelor&rsquo;s degree in Psychology, along with multiple life coaching certifications. He has over a decade of experience, is a published author, and is the founder of Pivot Training &amp; Development — a nationally recognized mental health professional development company.</p>
            </details>
            <details className="faq-item">
              <summary>How do I book Chris for my event?</summary>
              <p>Fill out the booking inquiry form below, email Jazmine@pivottraining.us, or call (770) 313-1232. Please include your event date, audience size, and goals. Early booking is recommended as Chris&rsquo;s calendar fills quickly.</p>
            </details>
            <details className="faq-item">
              <summary>Can Chris customize his keynote for our industry?</summary>
              <p>Absolutely. Every keynote and workshop is tailored to your organization&rsquo;s specific challenges, culture, and goals. Chris works directly with event planners to ensure maximum relevance and impact for your audience — whether corporate, education, healthcare, nonprofit, or government.</p>
            </details>
          </div>
        </div>
      </section>

      {/* ===== CONTACT / BOOKING ===== */}
      <section className="contact" id="contact" aria-label="Book keynote speaker Chris Marvel — contact and inquiry form">
        <div className="container">
          <div className="contact-info">
            <span className="badge badge-gold">Book Keynote Speaker Chris Marvel</span>
            <h2>Let&rsquo;s Build Something <span className="accent">Together</span></h2>
            <p className="contact-description">
              Whether you need a <strong>keynote speaker</strong> that moves the room, a <strong>workshop facilitator</strong> that transforms your team,
              or a <strong>multi-session training program</strong> that shifts your organizational culture — Chris Marvel delivers.
              Event planners, HR directors, conference organizers, and school administrators: let&rsquo;s talk.
            </p>
            <ul className="contact-details">
              <li>
                <div>
                  <span className="label">Booking Inquiries</span>
                  <a href="mailto:Jazmine@pivottraining.us">Jazmine@pivottraining.us</a>
                </div>
              </li>
              <li>
                <div>
                  <span className="label">Phone</span>
                  <a href="tel:+17703131232">(770) 313-1232</a>
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
                  <span className="label">Availability</span>
                  Now booking 2026–2027 | Corporate, Education &amp; Nonprofit
                </div>
              </li>
            </ul>
          </div>
          <div className="contact-form">
            {formSubmitted ? (
              <div className="form-success">
                <h3>Thank You!</h3>
                <p>Your booking inquiry has been submitted. Jazmine will be in touch within 24–48 hours to discuss your event.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} aria-label="Speaker booking inquiry form">
                <input type="hidden" name="access_key" value="2ed4e63f-0743-4e95-8ee7-c115f3661ad8" />
                <input type="hidden" name="subject" value="New Booking Inquiry — ChrisMarvelSpeaks.com" />
                <input type="hidden" name="from_name" value="ChrisMarvelSpeaks.com" />
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input type="text" id="name" name="name" placeholder="Full name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="organization">Organization</label>
                    <input type="text" id="organization" name="organization" placeholder="Company, school, or organization name" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="you@company.com" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" placeholder="(555) 555-5555" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="event_type">Event Type</label>
                  <select id="event_type" name="event_type">
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
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="event_date">Requested Date(s)</label>
                    <input type="text" id="event_date" name="event_date" placeholder="e.g. June 15, 2026 or June 15–17" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="audience_size">Expected Audience Size</label>
                    <select id="audience_size" name="audience_size">
                      <option value="">Select audience size</option>
                      <option>Under 50</option>
                      <option>50 – 100</option>
                      <option>100 – 250</option>
                      <option>250 – 500</option>
                      <option>500 – 1,000</option>
                      <option>1,000+</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="budget">Budget Range</label>
                  <select id="budget" name="budget">
                    <option value="">Select your budget range</option>
                    <option>Under $5,000</option>
                    <option>$5,000 – $10,000</option>
                    <option>$10,000 – $20,000</option>
                    <option>$20,000 – $50,000</option>
                    <option>$50,000+</option>
                    <option>Not sure yet — let&rsquo;s discuss</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Tell Us About Your Event</label>
                  <textarea id="message" name="message" placeholder="Goals for the event, specific keynote topics of interest, any special requirements..."></textarea>
                </div>
                <button type="submit" className="btn btn-gold" disabled={formSubmitting}>
                  {formSubmitting ? 'Submitting...' : 'Submit Booking Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer aria-label="Chris Marvel keynote speaker site footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-brand-name">Chris <span>Marvel</span></div>
              <p className="footer-brand-tagline">
                Keynote speaker, mental health performance coach, and author transforming how organizations approach wellbeing, resilience, and peak performance.
                Available for corporate keynotes, workshops, and training programs nationwide.
              </p>
              <div className="social-links">
                <a href="https://www.linkedin.com/in/chrismarvel" target="_blank" rel="noopener noreferrer" aria-label="Chris Marvel on LinkedIn">in</a>
                <a href="https://www.instagram.com/chrismarvel/" target="_blank" rel="noopener noreferrer" aria-label="Chris Marvel on Instagram">ig</a>
                <a href="https://youtu.be/AAAURVaEE48?si=4LKNwd9qRLYzhkNp" target="_blank" rel="noopener noreferrer" aria-label="Chris Marvel on YouTube">yt</a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Navigate</h4>
              <ul>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about') }}>About the Speaker</a></li>
                <li><a href="#keynotes" onClick={(e) => { e.preventDefault(); scrollTo('keynotes') }}>Keynote Topics</a></li>
                <li><a href="#book" onClick={(e) => { e.preventDefault(); scrollTo('book') }}>The What If Effect</a></li>
                <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollTo('testimonials') }}>Client Testimonials</a></li>
                <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq') }}>FAQ</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Services</h4>
              <ul>
                <li><a href="#keynotes" onClick={(e) => { e.preventDefault(); scrollTo('keynotes') }}>Corporate Keynotes</a></li>
                <li><a href="#keynotes" onClick={(e) => { e.preventDefault(); scrollTo('keynotes') }}>Workshops &amp; Training</a></li>
                <li><a href="#reel" onClick={(e) => { e.preventDefault(); scrollTo('reel') }}>Speaker Reel</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Book Chris to Speak</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact</h4>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">&#9993;</span>
                <a href="mailto:Jazmine@pivottraining.us">Jazmine@pivottraining.us</a>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">&#9742;</span>
                <a href="tel:+17703131232">(770) 313-1232</a>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">&#9679;</span>
                <span>Cleveland, OH &bull; Atlanta, GA</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; 2026 Chris Marvel | Pivot Training &amp; Development. All rights reserved. | <strong>Keynote Speaker</strong> &bull; <strong>Mental Health Coach</strong> &bull; <strong>Author</strong>
          </div>
        </div>
      </footer>
    </>
  )
}
