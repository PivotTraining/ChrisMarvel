import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://chrismarvelspeaks.com'),
  title: {
    default: 'Chris Marvel — Keynote Speaker | Mental Health Performance Coach | Book for Events',
    template: '%s | Chris Marvel Speaks',
  },
  description:
    'Book Chris Marvel — keynote speaker, mental health performance coach, and author of The What If Effect. Trusted by Johnson & Johnson, NFL/NBA athletes, and school districts nationwide. Corporate keynotes, workshops, and training programs available.',
  keywords: [
    'Chris Marvel',
    'Chris Marvel speaker',
    'Chris Marvel keynote',
    'book Chris Marvel',
    'keynote speaker',
    'mental health keynote speaker',
    'corporate keynote speaker',
    'motivational speaker',
    'performance coach',
    'workplace wellness speaker',
    'mental health speaker for schools',
    'corporate wellness keynote',
    'leadership keynote speaker',
    'keynote speaker Atlanta',
    'keynote speaker Cleveland',
    'keynote speaker Ohio',
    'keynote speaker Georgia',
    'hire keynote speaker',
    'book motivational speaker',
    'mental health workshop speaker',
    'employee wellness speaker',
    'school mental health speaker',
    'NFL mental health coach',
    'The What If Effect',
    'Pivot Training and Development',
    'stress management keynote',
    'resilience speaker',
    'emotional intelligence speaker',
    'psychology keynote speaker',
    'youth mental health speaker',
    'nonprofit speaker',
    'conference speaker mental health',
    'professional development speaker',
    'HBCU speaker',
    'education keynote speaker',
  ],
  authors: [{ name: 'Christopher "Chris Marvel" Davis', url: 'https://chrismarvelspeaks.com' }],
  creator: 'Chris Marvel Davis',
  publisher: 'Pivot Training & Development',
  category: 'Professional Speaker',
  classification: 'Keynote Speaker, Mental Health, Performance Coaching',
  alternates: {
    canonical: 'https://chrismarvelspeaks.com',
  },
  openGraph: {
    title: 'Chris Marvel — Keynote Speaker | Mental Health Performance Coach',
    description:
      'From NFL locker rooms to Fortune 500 boardrooms — book Chris Marvel for your next corporate keynote, workshop, or training program. Trusted by Johnson & Johnson, Cleveland Metro Schools, and professional athletes.',
    type: 'website',
    locale: 'en_US',
    url: 'https://chrismarvelspeaks.com',
    siteName: 'Chris Marvel Speaks',
    images: [
      {
        url: '/images/hero-headshot.jpg',
        width: 1400,
        height: 1400,
        alt: 'Chris Marvel — Keynote Speaker and Mental Health Performance Coach available for corporate events, conferences, and workshops',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chris Marvel — Keynote Speaker | Book for Your Next Event',
    description:
      'Mental Health Performance Coach trusted by Fortune 500 companies and professional athletes. Corporate keynotes, workshops & training programs.',
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

/* ===== STRUCTURED DATA — PERSON (Enhanced for Speaker SEO) ===== */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://chrismarvelspeaks.com/#person',
  name: 'Christopher "Chris Marvel" Davis',
  givenName: 'Christopher',
  familyName: 'Davis',
  additionalName: 'Chris Marvel',
  jobTitle: 'Mental Health Performance Coach & Keynote Speaker',
  description:
    'Chris Marvel is a keynote speaker, mental health performance coach, and published author who has delivered 200+ keynotes for Fortune 500 companies, NFL/NBA athletes, school districts, and nonprofits nationwide.',
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
    description: 'Mental health professional development company serving corporate clients, school districts, and nonprofits.',
  },
  knowsAbout: [
    'Mental Health',
    'Performance Coaching',
    'Keynote Speaking',
    'Psychology',
    'Corporate Wellness',
    'Emotional Intelligence',
    'Stress Management',
    'Resilience Training',
    'Leadership Development',
    'Workplace Wellbeing',
    'Youth Mental Health',
    'Team Performance',
    'Employee Engagement',
    'Organizational Culture',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Keynote Speaker',
    description: 'Professional keynote speaker specializing in mental health, performance coaching, and workplace wellness',
    occupationLocation: { '@type': 'Country', name: 'United States' },
    skills: 'Keynote Speaking, Workshop Facilitation, Corporate Training, Mental Health Education, Performance Coaching',
  },
  sameAs: [],
}

/* ===== STRUCTURED DATA — WEBSITE ===== */
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://chrismarvelspeaks.com/#website',
  url: 'https://chrismarvelspeaks.com',
  name: 'Chris Marvel Speaks',
  description: 'Official website of keynote speaker and mental health performance coach Chris Marvel Davis',
  publisher: { '@id': 'https://chrismarvelspeaks.com/#person' },
  inLanguage: 'en-US',
}

/* ===== STRUCTURED DATA — PROFESSIONAL SERVICE ===== */
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://chrismarvelspeaks.com/#service',
  name: 'Chris Marvel — Keynote Speaking & Training',
  description: 'Professional keynote speaking, corporate workshops, and multi-session mental health training programs for organizations nationwide.',
  url: 'https://chrismarvelspeaks.com',
  telephone: '(770) 313-1232',
  email: 'Jazmine@pivottraining.us',
  image: 'https://chrismarvelspeaks.com/images/hero-headshot.jpg',
  priceRange: 'Contact for Custom Quote',
  areaServed: { '@type': 'Country', name: 'United States' },
  provider: { '@id': 'https://chrismarvelspeaks.com/#person' },
  serviceType: ['Keynote Speaking', 'Corporate Workshop', 'Professional Development Training', 'Mental Health Workshop'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Speaking & Training Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Corporate Keynote', description: '60-minute keynote presentation on mental health, resilience, and performance for corporate audiences' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Half-Day Workshop', description: 'Interactive half-day workshop on workplace wellness, emotional intelligence, and team performance' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Full-Day Training', description: 'Comprehensive full-day immersive training program on mental health and organizational culture' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Multi-Session Program', description: 'Extended multi-session training program designed for lasting organizational transformation' },
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
      name: 'What topics does Chris Marvel speak about?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chris Marvel delivers keynotes on mental health performance, workplace wellness, emotional intelligence, resilience, and leadership. His signature keynotes include "Pressure Is a Privilege," "The Invisible Injury," and "The What If Effect." All topics are customizable for corporate, education, and nonprofit audiences.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get a quote for booking Chris Marvel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every engagement is customized based on your event type, audience size, duration, and goals. We offer flexible options for corporate, education, and nonprofit organizations. Contact Jazmine@pivottraining.us or call (770) 313-1232 to receive a tailored proposal.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of events does Chris Marvel speak at?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chris Marvel speaks at corporate conferences, leadership summits, professional development days, school district training, HBCU events, nonprofit galas, team retreats, and industry conventions. He offers 60-minute keynotes, half-day workshops, full-day training, and multi-session programs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Chris Marvel based and does he travel for speaking engagements?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chris Marvel is headquartered in Cleveland, Ohio and Atlanta, Georgia, and is available for speaking engagements nationwide across the United States. Virtual and hybrid speaking options are also available.',
      },
    },
    {
      '@type': 'Question',
      name: 'What organizations has Chris Marvel worked with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chris Marvel has worked with Johnson & Johnson, Cleveland Metropolitan School District, Clark County Schools, Head Start, and professional athletes from the NFL and NBA including Lamar Odom, Terrell Owens, and Ted Ginn Jr.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is The What If Effect book about?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The What If Effect: Flip Doubt Into Direction is a psychology-backed book by Chris Marvel Davis that reveals the mental patterns keeping high performers stuck and provides precise strategies to break through them. It draws on a decade of coaching elite athletes and corporate leaders.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are Chris Marvel\'s credentials and qualifications?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chris Marvel holds a Master\'s degree and Bachelor\'s degree in Psychology, along with multiple life coaching certifications. He has over a decade of experience coaching professional athletes (NFL/NBA), Fortune 500 executives, and educators, and is the founder of Pivot Training & Development.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I book Chris Marvel for my event?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To book Chris Marvel, visit chrismarvelspeaks.com and fill out the booking inquiry form, email Jazmine@pivottraining.us, or call (770) 313-1232. Provide your event date, audience size, and goals for a custom proposal. Early booking is recommended as availability fills quickly.',
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
      reviewBody: 'Chris has a rare ability to connect complex psychology concepts to real-world workplace challenges. Our leadership team walked away with actionable strategies they started implementing the same week.',
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    },
    {
      '@type': 'Review',
      author: { '@type': 'Organization', name: 'Cleveland Metropolitan School District' },
      reviewBody: 'The way Chris broke down mental health for our educators was a game-changer. Our teachers finally felt seen and equipped. Absenteeism dropped and morale went up within one semester.',
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
  description: 'A psychology-backed playbook for breaking through the mental barriers that keep high performers stuck. Transform fear-based thinking into possibility-driven strategy.',
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
    { '@type': 'ListItem', position: 3, name: 'Keynote Topics', item: 'https://chrismarvelspeaks.com/#keynotes' },
    { '@type': 'ListItem', position: 4, name: 'Speaker Reel', item: 'https://chrismarvelspeaks.com/#reel' },
    { '@type': 'ListItem', position: 5, name: 'The What If Effect Book', item: 'https://chrismarvelspeaks.com/#book' },
    { '@type': 'ListItem', position: 6, name: 'Testimonials', item: 'https://chrismarvelspeaks.com/#testimonials' },
    { '@type': 'ListItem', position: 7, name: 'Book Chris to Speak', item: 'https://chrismarvelspeaks.com/#contact' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
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
