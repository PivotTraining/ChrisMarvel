import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://chrismarvelspeaks.com'),
  title: {
    default: 'Chris Marvel — Performance Strategist & Keynote Speaker | Increase Engagement & Drive Results',
    template: '%s | Chris Marvel Speaks',
  },
  description:
    'Book Chris Marvel — performance strategist and keynote speaker who helps organizations, schools, and universities increase engagement, elevate thinking, and drive measurable performance outcomes. Creator of The Recharge Method™. Corporate keynotes, workshops, and training programs starting at $7,500.',
  keywords: [
    'Chris Marvel',
    'Chris Marvel speaker',
    'Chris Marvel keynote',
    'book Chris Marvel',
    'performance strategist',
    'keynote speaker',
    'corporate keynote speaker',
    'performance speaker',
    'engagement speaker',
    'workforce performance',
    'student performance speaker',
    'The Recharge Method',
    'leadership keynote speaker',
    'keynote speaker Atlanta',
    'keynote speaker Cleveland',
    'keynote speaker Ohio',
    'keynote speaker Georgia',
    'hire keynote speaker',
    'book performance speaker',
    'employee engagement speaker',
    'school performance speaker',
    'K-12 keynote speaker',
    'university keynote speaker',
    'student success speaker',
    'NFL performance coach',
    'The What If Effect',
    'Pivot Training and Development',
    'burnout speaker',
    'resilience speaker',
    'emotional regulation speaker',
    'psychology keynote speaker',
    'professional development speaker',
    'HBCU speaker',
    'education keynote speaker',
    'performance under pressure',
    'disengagement speaker',
    'behavioral science speaker',
  ],
  authors: [{ name: 'Christopher "Chris Marvel" Davis', url: 'https://chrismarvelspeaks.com' }],
  creator: 'Chris Marvel Davis',
  publisher: 'Pivot Training & Development',
  category: 'Professional Speaker',
  classification: 'Performance Strategist, Keynote Speaker, Workforce & Student Performance',
  alternates: {
    canonical: 'https://chrismarvelspeaks.com',
  },
  openGraph: {
    title: 'Chris Marvel — Performance Strategist & Keynote Speaker',
    description:
      'I partner with organizations, schools, and universities that are losing performance due to disengagement and burnout — and we fix that by rebuilding how people think, respond, and perform when it matters most.',
    type: 'website',
    locale: 'en_US',
    url: 'https://chrismarvelspeaks.com',
    siteName: 'Chris Marvel Speaks',
    images: [
      {
        url: '/images/hero-headshot.jpg',
        width: 1400,
        height: 1400,
        alt: 'Chris Marvel — Performance Strategist and Keynote Speaker for corporate events, schools, and universities',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chris Marvel — Performance Strategist & Keynote Speaker',
    description:
      'I help organizations, schools, and universities increase engagement and performance by teaching people how to think, regulate, and execute under pressure.',
    images: ['/images/hero-headshot.jpg'],
    creator: '@chrismarvel',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  other: {
    'geo.region': 'US-GA',
    'geo.placename': 'Atlanta',
    'geo.position': '33.9519;-84.0709',
    'ICBM': '33.9519, -84.0709',
    'rating': 'general',
    'revisit-after': '7 days',
    'format-detection': 'telephone=yes',
  },
}

/* ===== STRUCTURED DATA — PERSON ===== */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://chrismarvelspeaks.com/#person',
  name: 'Christopher "Chris Marvel" Davis',
  givenName: 'Christopher',
  familyName: 'Davis',
  additionalName: 'Chris Marvel',
  jobTitle: 'Performance Strategist & Keynote Speaker',
  description:
    'Chris Marvel is a performance strategist and keynote speaker who uses psychology, behavioral science, and real-world application to help organizations and institutions increase engagement, elevate thinking, and drive measurable performance outcomes. Creator of The Recharge Method™.',
  url: 'https://chrismarvelspeaks.com',
  image: 'https://chrismarvelspeaks.com/images/hero-headshot.jpg',
  email: 'Jazmine@pivottraining.us',
  telephone: '(770) 313-1232',
  address: [
    { '@type': 'PostalAddress', addressLocality: 'Cleveland', addressRegion: 'OH', addressCountry: 'US' },
    { '@type': 'PostalAddress', addressLocality: 'Atlanta', addressRegion: 'GA', addressCountry: 'US' },
  ],
  alumniOf: { '@type': 'EducationalOrganization', name: 'M.S. Psychology Program' },
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'Master of Science in Psychology' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'Bachelor of Science in Psychology' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certificate', name: 'Certified Life Coach' },
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Pivot Training & Development',
    url: 'https://pivottraining.us',
    description: 'Performance development company helping corporate clients, school districts, universities, and nonprofits increase engagement and drive measurable outcomes.',
  },
  knowsAbout: [
    'Performance Strategy',
    'Behavioral Science',
    'Psychology',
    'Keynote Speaking',
    'Workforce Performance',
    'Student Performance',
    'Emotional Regulation',
    'Engagement Strategy',
    'Leadership Development',
    'Organizational Culture',
    'Burnout Prevention',
    'Team Performance',
    'Employee Engagement',
    'Decision-Making Under Pressure',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Performance Strategist & Keynote Speaker',
    description: 'Performance strategist using psychology and behavioral science to help organizations increase engagement and drive measurable outcomes',
    occupationLocation: { '@type': 'Country', name: 'United States' },
    skills: 'Keynote Speaking, Workshop Facilitation, Corporate Training, Performance Development, The Recharge Method™',
  },
  sameAs: [
    'https://www.linkedin.com/in/chrismarvel',
    'https://www.instagram.com/chrismarvel/',
  ],
}

/* ===== STRUCTURED DATA — WEBSITE ===== */
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://chrismarvelspeaks.com/#website',
  url: 'https://chrismarvelspeaks.com',
  name: 'Chris Marvel Speaks',
  description: 'Official website of performance strategist and keynote speaker Chris Marvel Davis — creator of The Recharge Method™',
  publisher: { '@id': 'https://chrismarvelspeaks.com/#person' },
  inLanguage: 'en-US',
}

/* ===== STRUCTURED DATA — PROFESSIONAL SERVICE ===== */
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://chrismarvelspeaks.com/#service',
  name: 'Chris Marvel — Performance Strategy & Keynote Speaking',
  description: 'Professional keynote speaking, corporate workshops, K-12 training, university programs, and multi-session performance development engagements nationwide.',
  url: 'https://chrismarvelspeaks.com',
  telephone: '(770) 313-1232',
  email: 'Jazmine@pivottraining.us',
  image: 'https://chrismarvelspeaks.com/images/hero-headshot.jpg',
  priceRange: 'Starting at $7,500',
  areaServed: { '@type': 'Country', name: 'United States' },
  provider: { '@id': 'https://chrismarvelspeaks.com/#person' },
  serviceType: ['Keynote Speaking', 'Corporate Workshop', 'Performance Development Training', 'K-12 Professional Development', 'University Student Success Programs'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Speaking & Performance Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Corporate Keynote', description: '60-minute keynote on engagement, performance under pressure, and execution strategy for corporate audiences' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Half-Day Workshop', description: 'Interactive half-day workshop on emotional regulation, engagement, and team performance' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Full-Day Training', description: 'Comprehensive full-day immersive training using The Recharge Method™' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Multi-Session Program', description: 'Extended multi-session performance development program for lasting organizational transformation' },
      },
    ],
  },
  address: [
    { '@type': 'PostalAddress', addressLocality: 'Cleveland', addressRegion: 'OH', addressCountry: 'US' },
    { '@type': 'PostalAddress', addressLocality: 'Atlanta', addressRegion: 'GA', addressCountry: 'US' },
  ],
}

/* ===== STRUCTURED DATA — FAQ ===== */
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does Chris Marvel speak about?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chris Marvel is a performance strategist who helps organizations, schools, and universities increase engagement, elevate thinking, and drive measurable performance outcomes. His signature keynotes include "Pressure Is a Privilege," "The Invisible Injury," and "The What If Effect" — all built on The Recharge Method™. Topics are customizable for corporate, K-12, university, and nonprofit audiences.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost to book Chris Marvel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Speaking engagements start at $7,500 for corporate keynotes. K-12, university, and nonprofit rates are available. Pricing varies based on event type, duration, and customization. Contact Jazmine@pivottraining.us or call (770) 313-1232 for a custom quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is The Recharge Method™?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Recharge Method™ is Chris Marvel\'s structured performance system built on three phases: Diagnose (identify how individuals respond to stress and pressure), Rewire (train individuals to shift from reactive to intentional thinking), and Deploy (apply new behaviors in real-world environments). It delivers sustainable performance improvement, not temporary motivation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes Chris Marvel different from other speakers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most speakers inspire temporarily and focus on awareness. Chris Marvel installs systems, changes behavior, and drives performance outcomes. He uses psychology, behavioral science, and real-world application to deliver a performance system that transforms how people think, behave, and execute.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of events does Chris speak at?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chris speaks at corporate conferences, leadership summits, K-12 school district training, university student success programs, HBCU events, nonprofit galas, team retreats, and industry conventions. He offers 60-minute keynotes, half-day workshops, full-day training, and multi-session programs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What organizations has Chris Marvel worked with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chris has worked with Johnson & Johnson, Cleveland Metropolitan School District, Clark County Schools, Head Start, and professional athletes from the NFL and NBA including Lamar Odom, Terrell Owens, and Ted Ginn Jr.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Chris Marvel based and does he travel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chris Marvel is headquartered in Cleveland, Ohio and Atlanta, Georgia, and is available for speaking engagements nationwide. Virtual and hybrid options are also available.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I book Chris Marvel for my event?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Visit chrismarvelspeaks.com and fill out the booking inquiry form, email Jazmine@pivottraining.us, or call (770) 313-1232. Provide your event date, audience size, and performance goals for a custom proposal.',
      },
    },
  ],
}

/* ===== STRUCTURED DATA — REVIEWS / TESTIMONIALS ===== */
const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://chrismarvelspeaks.com/#person-reviews',
  name: 'Christopher "Chris Marvel" Davis',
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Organization', name: 'Johnson & Johnson' },
      reviewBody: 'Chris doesn\'t just inspire — he installs systems. Our leadership team walked away with actionable strategies they started implementing the same week. Engagement scores improved within the quarter.',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    },
    {
      '@type': 'Review',
      author: { '@type': 'Organization', name: 'Cleveland Metropolitan School District' },
      reviewBody: 'The way Chris reframed performance for our educators was a game-changer. Our teachers finally had a system for managing pressure. Absenteeism dropped and classroom engagement went up within one semester.',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    },
    {
      '@type': 'Review',
      author: { '@type': 'Organization', name: 'Clark County School District' },
      reviewBody: 'We brought Chris in for our annual staff development day and the feedback was overwhelming. Staff rated his session the highest of any professional development we\'ve offered in five years.',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    },
  ],
}

/* ===== STRUCTURED DATA — BOOK ===== */
const bookSchema = {
  '@context': 'https://schema.org',
  '@type': 'Book',
  name: 'The What If Effect: Flip Doubt Into Direction',
  author: { '@id': 'https://chrismarvelspeaks.com/#person' },
  description: 'A psychology-backed performance playbook for breaking through the thinking patterns that keep high performers stuck. Transform fear-based thinking into possibility-driven strategy.',
  genre: 'Self-Help / Psychology / Performance',
  inLanguage: 'en',
  url: 'https://chrismarvelspeaks.com/#book',
}

/* ===== STRUCTURED DATA — BREADCRUMBS ===== */
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://chrismarvelspeaks.com' },
    { '@type': 'ListItem', position: 2, name: 'About Chris Marvel', item: 'https://chrismarvelspeaks.com/#about' },
    { '@type': 'ListItem', position: 3, name: 'The Recharge Method', item: 'https://chrismarvelspeaks.com/#method' },
    { '@type': 'ListItem', position: 4, name: 'Keynote Topics', item: 'https://chrismarvelspeaks.com/#keynotes' },
    { '@type': 'ListItem', position: 5, name: 'Speaker Reel', item: 'https://chrismarvelspeaks.com/#reel' },
    { '@type': 'ListItem', position: 6, name: 'The What If Effect Book', item: 'https://chrismarvelspeaks.com/#book' },
    { '@type': 'ListItem', position: 7, name: 'Testimonials', item: 'https://chrismarvelspeaks.com/#testimonials' },
    { '@type': 'ListItem', position: 8, name: 'Book Chris to Speak', item: 'https://chrismarvelspeaks.com/#contact' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://chrismarvelspeaks.com" />

        {/* Structured Data — Person */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        {/* Structured Data — Website */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        {/* Structured Data — Professional Service */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
        {/* Structured Data — FAQ */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        {/* Structured Data — Reviews */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
        {/* Structured Data — Book */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }} />
        {/* Structured Data — Breadcrumbs */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
