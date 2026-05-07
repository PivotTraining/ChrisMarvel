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
          <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} aria-label="Chris Marvel — Performance Strategist homepage">
            Chris<img src="/images/chris-marvel-logo.png" alt="Chris Marvel performance strategist logo" className="nav-logo-icon" width={28} height={28} /><span>Marvel</span>
          </a>
          <ul className={`nav-links ${menuOpen ? 'show' : ''}`} role="menubar">
            <li role="none"><a href="#about" role="menuitem" onClick={(e) => { e.preventDefault(); scrollTo('about') }}>About</a></li>
            <li role="none"><a href="#method" role="menuitem" onClick={(e) => { e.preventDefault(); scrollTo('method') }}>Method</a></li>
            <li role="none"><a href="#keynotes" role="menuitem" onClick={(e) => { e.preventDefault(); scrollTo('keynotes') }}>Keynotes</a></li>
            <li role="none"><a href="#reel" role="menuitem" onClick={(e) => { e.preventDefault(); scrollTo('reel') }}>Reel</a></li>
            <li role="none"><a href="/book" role="menuitem">Book</a></li>
            <li role="none"><a href="/communities" role="menuitem">Communities</a></li>
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
            <span className="badge badge-gold">Performance Strategist &amp; Keynote Speaker</span>
            <h1>Increase Engagement.<br />Elevate Thinking.<br />Drive <span className="accent">Performance.</span></h1>
            <p className="hero-tagline">
              Chris Marvel partners with organizations, schools, and universities to solve disengagement, burnout, and inconsistent performance &mdash; by teaching people how to think, regulate, and execute under pressure.
            </p>
            <p className="hero-description">
              This is not motivation. This is a <strong>performance system</strong>. Using psychology, behavioral science,
              and real-world application, Chris helps institutions increase engagement, strengthen decision-making,
              and drive measurable outcomes &mdash; from Fortune 500 boardrooms to K&ndash;12 classrooms to university campuses.
            </p>
            <div className="hero-buttons">
              <a href="#contact" className="btn btn-gold" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Book Chris to Speak</a>
              <a href="#reel" className="btn btn-outline-white" onClick={(e) => { e.preventDefault(); scrollTo('reel') }}>Watch the Speaker Reel</a>
            </div>
          </div>
          <div className="hero-image-container">
            <img
              src="/images/hero-headshot.jpg"
              alt="Chris Marvel — performance strategist and keynote speaker for corporate events, schools, and universities"
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
          <div className="trusted-bar-label">Trusted By Leading Organizations &amp; Institutions</div>
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
      <section className="mission" id="about" aria-label="About performance strategist Chris Marvel">
        <div className="container">
          <div className="mission-content">
            <span className="badge badge-gold">About the Strategist</span>
            <h2>From the Inner City<br />To the <span className="accent">Main Stage</span></h2>
            <p>
              Chris Marvel was raised in <strong>Cleveland, Ohio</strong> &mdash; in an era defined by inner-city drugs,
              violence, and economic uncertainty. He grew up surrounded by obstacles that were designed to hold him back.
              But he didn&rsquo;t stay there.
            </p>
            <p>
              He rose past every barrier to become a <strong>college graduate</strong>, a <strong>published author</strong>,
              a <strong>business owner</strong>, a <strong>devoted family man</strong>, and a man of God &mdash; and now he pours his heart,
              love, and mind into people across the world. His mission is singular: to help people become
              <strong> resilient, gritty, transformational, and determined</strong> &mdash; people who push past
              their comfort zone in order to grow, achieve, and become great.
            </p>
            <p>
              Today, Chris is a <strong>performance strategist and keynote speaker</strong> who uses psychology, behavioral science,
              and real-world application to help organizations and institutions increase engagement, elevate thinking,
              and drive measurable performance outcomes. As founder of <strong>Pivot Training &amp; Development</strong> alongside
              co-founder Jazmine Davis, Chris has built a performance development company headquartered in Cleveland, Ohio
              and Atlanta, Georgia that is reshaping how organizations approach execution, engagement, and culture.
            </p>
            <div className="credentials-row">
              <span className="credential-tag">M.S. Psychology</span>
              <span className="credential-tag">Performance Strategist</span>
              <span className="credential-tag">Published Author</span>
              <span className="credential-tag">10+ Years Experience</span>
              <span className="credential-tag">NFL/NBA Coach</span>
            </div>
            <a href="#contact" className="btn btn-navy" onClick={(e) => { e.preventDefault(); scrollTo('contact') }} style={{ marginTop: '32px' }}>Get In Touch</a>
          </div>
          <div className="mission-image">
            <img src="/images/about-presenting.jpg" alt="Chris Marvel presenting performance strategy keynote to corporate audience" loading="lazy" width={600} height={400} />
          </div>
        </div>
      </section>

      {/* ===== FULL-WIDTH STAGE PHOTO ===== */}
      <div className="stage-photo" role="img" aria-label="Chris Marvel delivering keynote on stage at major conference">
        <img src="/images/gallery-stage.jpg" alt="Chris Marvel delivering performance keynote on stage at corporate conference" loading="lazy" />
      </div>

      {/* ===== THE RECHARGE METHOD ===== */}
      <section className="keynotes" id="method" aria-label="The Recharge Method — Chris Marvel's performance system">
        <div className="container">
          <span className="badge badge-gold">The Performance System</span>
          <h2>The Recharge <span className="accent">Method&trade;</span></h2>
          <p className="keynotes-subtitle">
            Most speakers inspire temporarily. Chris Marvel installs systems, changes behavior, and drives performance outcomes.
            The Recharge Method&trade; is a structured performance system designed to improve how individuals operate under pressure.
          </p>
          <div className="keynote-grid">
            <article className="keynote-card fade-in">
              <div className="keynote-card-icon">&#128269;</div>
              <h3>1. Diagnose</h3>
              <p>
                Identify how individuals respond to stress and pressure. Assess patterns of thinking, behavior,
                and emotional regulation that are silently eroding performance, engagement, and culture.
              </p>
            </article>
            <article className="keynote-card fade-in">
              <div className="keynote-card-icon">&#9889;</div>
              <h3>2. Rewire</h3>
              <p>
                Train individuals to shift from <strong>reactive to intentional thinking</strong>. Build emotional regulation
                and mental discipline. Introduce elevated thinking frameworks that change how people process pressure.
              </p>
            </article>
            <article className="keynote-card fade-in">
              <div className="keynote-card-icon">&#127919;</div>
              <h3>3. Deploy</h3>
              <p>
                Apply new behaviors in real-world environments. Reinforce performance habits and create
                <strong> repeatable execution patterns</strong> that drive sustained results &mdash; not temporary motivation.
              </p>
            </article>
            <article className="keynote-card fade-in">
              <div className="keynote-card-icon">&#128200;</div>
              <h3>The Outcome</h3>
              <p>
                Higher engagement. Stronger accountability. Improved focus and execution. Reduced burnout behaviors.
                Elevated decision-making. <strong>Sustainable performance improvement</strong> that lasts long after the event.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ===== PHOTO GALLERY STRIP ===== */}
      <section className="photo-gallery" aria-label="Chris Marvel keynote speaker photo gallery">
        <div className="gallery-strip">
          <img src="/images/gallery-workshop.jpg" alt="Chris Marvel leading interactive performance workshop for corporate team" loading="lazy" width={400} height={300} />
          <img src="/images/gallery-ballroom.jpg" alt="Chris Marvel delivering keynote to packed ballroom at national conference" loading="lazy" width={400} height={300} />
          <img src="/images/gallery-education.jpg" alt="Chris Marvel presenting engagement strategies for educators and school administrators" loading="lazy" width={400} height={300} />
          <img src="/images/about-presenting.jpg" alt="Chris Marvel engaging corporate audience during performance strategy presentation" loading="lazy" width={400} height={300} />
        </div>
      </section>

      {/* ===== KEYNOTES ===== */}
      <section className="keynotes" id="keynotes" aria-label="Keynote speaking topics and programs">
        <div className="container">
          <span className="badge badge-gold">Signature Keynotes &amp; Workshops</span>
          <h2>Keynote Talks That Drive <span className="accent">Results</span></h2>
          <p className="keynotes-subtitle">
            Each keynote is built on The Recharge Method&trade; and customizable for corporate, K&ndash;12, university, and nonprofit audiences.
            Available as 60-minute keynotes, half-day workshops, full-day training, or multi-session programs.
          </p>
          <div className="keynote-grid">
            <article className="keynote-card fade-in">
              <div className="keynote-card-icon">&#9889;</div>
              <h3>Pressure Is a Privilege</h3>
              <p>
                Performance is revealed under pressure &mdash; not in comfort. This keynote teaches high performers
                how to reframe stress as fuel, build execution habits under pressure, and develop team-wide
                psychological performance systems. Ideal for <strong>corporate leadership teams</strong> and <strong>high-performance organizations</strong>.
              </p>
            </article>
            <article className="keynote-card fade-in">
              <div className="keynote-card-icon">&#128065;</div>
              <h3>The Invisible Injury</h3>
              <p>
                The hidden barriers that silently erode performance, culture, and retention. This keynote helps organizations
                recognize the thinking patterns that drive disengagement &mdash; and install systems that shift individuals from
                reactive behavior to <strong>intentional execution</strong>. Perfect for <strong>school districts</strong>, <strong>HR teams</strong>, and <strong>universities</strong>.
              </p>
            </article>
            <article className="keynote-card fade-in">
              <div className="keynote-card-icon">&#128161;</div>
              <h3>The What If Effect</h3>
              <p>
                Based on Chris Marvel&rsquo;s bestselling book &mdash; a framework for breaking through the mental barriers
                that keep people stuck. Transform fear-based thinking into possibility-driven strategy and unlock
                the next level of performance. A <strong>keynote for anyone ready to execute at a higher level</strong>.
              </p>
            </article>
            <article className="keynote-card fade-in">
              <div className="keynote-card-icon">&#128736;</div>
              <h3>Custom Programs &amp; Workshops</h3>
              <p>
                Multi-session <strong>performance development training</strong> designed for your organization&rsquo;s specific challenges.
                From <strong>corporate engagement initiatives</strong> to <strong>student success programs</strong> (TRIO, First-Year Experience)
                and <strong>K&ndash;12 professional development</strong> &mdash; tailored for measurable, lasting impact.
              </p>
            </article>
          </div>
          <a href="#contact" className="btn btn-gold" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Request a Keynote Topic</a>
        </div>
      </section>

      {/* ===== SPEAKER REEL ===== */}
      <section className="reel-section" id="reel" aria-label="Chris Marvel keynote speaker demo reel">
        <div className="container">
          <span className="badge badge-navy">See Chris Marvel In Action</span>
          <h2>Speaker <span className="accent">Reel</span></h2>
          <p className="reel-subtitle">Watch what happens when psychology meets the stage. See why organizations, schools, and universities book Chris Marvel for their most important events.</p>
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
            <img src="/images/book-cover-v13.png" alt="The What If Effect: Twelve Questions That Will Change Your Life — book by Chris Marvel Davis" loading="lazy" width={400} height={640} />
          </div>
          <div className="book-content">
            <span className="badge badge-gold">Available Now</span>
            <h2>The What If <span className="accent">Effect</span></h2>
            <p style={{ fontSize: '1.15rem', fontWeight: 500, color: 'var(--navy)' }}>
              Twelve questions that will change your life.<br />
              Drawn from a decade of practice and a lifetime of paying attention.
            </p>
            <p>
              The new book from Chris Marvel Davis &mdash; available now in <strong>eBook, paperback, and hardcover</strong>.
              Pick your format. Pick your platform.
            </p>
            <div className="book-buttons">
              <a href="https://books.apple.com/us/book/the-what-if-effect/id6766121201" target="_blank" rel="noopener noreferrer" className="btn btn-navy">Apple Books</a>
              <a href="https://www.amazon.com/dp/B0GZLV99W3" target="_blank" rel="noopener noreferrer" className="btn btn-navy">Amazon Kindle</a>
              <a href="https://a.co/d/0hwfYrf7" target="_blank" rel="noopener noreferrer" className="btn btn-navy">Amazon Paperback</a>
              <a href="https://a.co/d/03NqGLKi" target="_blank" rel="noopener noreferrer" className="btn btn-navy">Amazon Hardcover</a>
            </div>
            <div className="book-buttons" style={{ marginTop: '16px' }}>
              <a href="/book" className="btn btn-outline-white" style={{ color: 'var(--navy)', borderColor: 'var(--navy)' }}>Read More About the Book</a>
              <a href="#contact" className="btn btn-outline-white" style={{ color: 'var(--navy)', borderColor: 'var(--navy)' }} onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Bulk Orders for Events</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials" id="testimonials" aria-label="Client testimonials and results from Chris Marvel engagements">
        <div className="container">
          <span className="badge badge-gold">What Clients Say</span>
          <h2>Real <span className="accent">Results</span></h2>
          <div className="testimonial-grid">
            <article className="testimonial-card fade-in">
              <p className="testimonial-text">
                Chris doesn&rsquo;t just inspire &mdash; he installs systems. Our leadership team walked away with
                actionable strategies they started implementing the same week. Engagement scores improved within the quarter.
              </p>
              <div className="testimonial-author">Johnson &amp; Johnson</div>
              <div className="testimonial-title">Corporate Performance Engagement</div>
            </article>
            <article className="testimonial-card fade-in">
              <p className="testimonial-text">
                The way Chris reframed performance for our educators was a game-changer. Our teachers finally had a system
                for managing pressure. Absenteeism dropped and classroom engagement went up within one semester.
              </p>
              <div className="testimonial-author">Cleveland Metropolitan School District</div>
              <div className="testimonial-title">K&ndash;12 Performance Partner</div>
            </article>
            <article className="testimonial-card fade-in">
              <p className="testimonial-text">
                Working with Chris changed how I approach the mental side of competition. He doesn&rsquo;t just talk
                about thinking differently &mdash; he gives you a system that actually works under pressure.
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
              <div className="testimonial-title">Education Performance Partner</div>
            </article>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-banner" aria-label="Book performance strategist Chris Marvel for your event">
        <div className="bg-img">
          <img src="/images/gallery-ballroom.jpg" alt="Chris Marvel speaking to large audience at corporate conference event" loading="lazy" />
        </div>
        <div className="container">
          <div className="cta-banner-sub">Ready to Elevate Performance?</div>
          <h2>Stop Losing Performance<br />To Disengagement &amp; <span className="accent">Burnout</span></h2>
          <p>Whether it&rsquo;s a corporate keynote, K&ndash;12 training, university program, or multi-session engagement &mdash; Chris Marvel delivers measurable results that last.</p>
          <a href="#contact" className="btn btn-gold" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Book Chris Marvel Now</a>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="faq-section" id="faq" aria-label="Frequently asked questions about booking Chris Marvel">
        <div className="container">
          <span className="badge badge-gold">FAQ</span>
          <h2>Frequently Asked <span className="accent">Questions</span></h2>
          <div className="faq-grid">
            <details className="faq-item" open>
              <summary>What does Chris Marvel speak about?</summary>
              <p>Chris is a performance strategist who helps organizations, schools, and universities increase engagement, elevate thinking, and drive measurable performance outcomes. His signature keynotes include &ldquo;Pressure Is a Privilege,&rdquo; &ldquo;The Invisible Injury,&rdquo; and &ldquo;The What If Effect&rdquo; &mdash; all built on The Recharge Method&trade;. Topics are fully customizable for corporate, education, university, and nonprofit audiences.</p>
            </details>
            <details className="faq-item">
              <summary>How much does it cost to book Chris Marvel?</summary>
              <p>Speaking engagements start at $7,500 for corporate keynotes. K&ndash;12, university, and nonprofit rates are available upon request. Pricing varies based on event type, duration, travel requirements, and customization. Contact Jazmine@pivottraining.us or call (770) 313-1232 for a custom quote.</p>
            </details>
            <details className="faq-item">
              <summary>What types of events does Chris speak at?</summary>
              <p>Chris speaks at corporate conferences, leadership summits, professional development days, K&ndash;12 school district training, university student success programs (TRIO, First-Year Experience), HBCU events, nonprofit galas, team retreats, and industry conventions. He offers 60-minute keynotes, half-day workshops, full-day training, and multi-session programs.</p>
            </details>
            <details className="faq-item">
              <summary>What is The Recharge Method&trade;?</summary>
              <p>The Recharge Method&trade; is Chris Marvel&rsquo;s structured performance system built on three phases: Diagnose (identify how individuals respond to stress and pressure), Rewire (train individuals to shift from reactive to intentional thinking), and Deploy (apply new behaviors in real-world environments with repeatable execution patterns). It&rsquo;s designed to improve how people operate under pressure &mdash; not just inspire them temporarily.</p>
            </details>
            <details className="faq-item">
              <summary>What makes Chris Marvel different from other speakers?</summary>
              <p>Most speakers inspire temporarily and focus on awareness. Chris installs systems, changes behavior, and drives performance outcomes. He uses psychology, behavioral science, and real-world application to deliver a performance system that transforms how people think, behave, and execute &mdash; across corporate teams, classrooms, and campuses.</p>
            </details>
            <details className="faq-item">
              <summary>What organizations has Chris worked with?</summary>
              <p>Chris has delivered keynotes and training for Johnson &amp; Johnson, Cleveland Metropolitan School District, Clark County Schools, Head Start, and has coached professional athletes from the NFL and NBA including Lamar Odom, Terrell Owens, and Ted Ginn Jr. He works across corporate, K&ndash;12, university, and nonprofit sectors.</p>
            </details>
            <details className="faq-item">
              <summary>How do I book Chris for my event?</summary>
              <p>Fill out the booking inquiry form below, email Jazmine@pivottraining.us, or call (770) 313-1232. Please include your event date, audience size, and goals. Early booking is recommended as Chris&rsquo;s calendar fills quickly.</p>
            </details>
            <details className="faq-item">
              <summary>Can Chris customize his keynote for our industry?</summary>
              <p>Absolutely. Every keynote and workshop is tailored to your organization&rsquo;s specific challenges, culture, and performance goals. Chris works directly with event planners to ensure maximum relevance and impact &mdash; whether corporate, K&ndash;12, university, healthcare, nonprofit, or government.</p>
            </details>
          </div>
        </div>
      </section>

      {/* ===== CONTACT / BOOKING ===== */}
      <section className="contact" id="contact" aria-label="Book performance strategist Chris Marvel — contact and inquiry form">
        <div className="container">
          <div className="contact-info">
            <span className="badge badge-gold">Book Chris Marvel</span>
            <h2>Let&rsquo;s Drive <span className="accent">Performance</span></h2>
            <p className="contact-description">
              Whether your organization is losing performance to <strong>disengagement and burnout</strong>,
              your school district needs to <strong>increase engagement and accountability</strong>,
              or your university wants to <strong>improve student retention and persistence</strong> &mdash;
              Chris Marvel delivers a performance system that gets measurable results.
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
                <p>Your booking inquiry has been submitted. Jazmine will be in touch within 24&ndash;48 hours to discuss your event.</p>
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
                    <input type="text" id="organization" name="organization" placeholder="Company, school, district, or university" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="you@organization.com" required />
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
                    <option>K–12 School District</option>
                    <option>University / Student Success</option>
                    <option>Nonprofit Event</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Tell Us About Your Event</label>
                  <textarea id="message" name="message" placeholder="Event date, audience size, performance goals, specific challenges you're facing..."></textarea>
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
      <footer aria-label="Chris Marvel performance strategist site footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-brand-name">Chris <span>Marvel</span></div>
              <p className="footer-brand-tagline">
                Performance strategist and keynote speaker helping organizations, schools, and universities
                increase engagement, elevate thinking, and drive measurable outcomes.
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
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about') }}>About Chris</a></li>
                <li><a href="#method" onClick={(e) => { e.preventDefault(); scrollTo('method') }}>The Recharge Method</a></li>
                <li><a href="#keynotes" onClick={(e) => { e.preventDefault(); scrollTo('keynotes') }}>Keynote Topics</a></li>
                <li><a href="#book" onClick={(e) => { e.preventDefault(); scrollTo('book') }}>The What If Effect</a></li>
                <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq') }}>FAQ</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Who We Serve</h4>
              <ul>
                <li><a href="#keynotes" onClick={(e) => { e.preventDefault(); scrollTo('keynotes') }}>Corporate &amp; Leadership</a></li>
                <li><a href="#keynotes" onClick={(e) => { e.preventDefault(); scrollTo('keynotes') }}>K&ndash;12 Schools &amp; Districts</a></li>
                <li><a href="#keynotes" onClick={(e) => { e.preventDefault(); scrollTo('keynotes') }}>Universities &amp; Student Success</a></li>
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
            &copy; 2026 Chris Marvel | Pivot Training &amp; Development. All rights reserved. | <strong>Performance Strategist</strong> &bull; <strong>Keynote Speaker</strong> &bull; <strong>Author</strong>
          </div>
        </div>
      </footer>
    </>
  )
}
