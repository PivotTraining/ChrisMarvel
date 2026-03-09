import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://chrismarvel.com'),
  title: 'Chris Marvel — Mental Health Performance Coach & Keynote Speaker',
  description:
    'Chris Marvel is a Mental Health Performance Coach, keynote speaker, and author of The What If Effect. Book Chris for your next corporate, education, or nonprofit event.',
  keywords: [
    'Chris Marvel',
    'keynote speaker',
    'mental health',
    'performance coach',
    'corporate speaker',
    'The What If Effect',
    'Pivot Training',
    'workplace wellness',
  ],
  authors: [{ name: 'Chris Marvel Davis' }],
  openGraph: {
    title: 'Chris Marvel — Mental Health Performance Coach & Keynote Speaker',
    description:
      'From NFL locker rooms to Fortune 500 boardrooms — Chris Marvel transforms how organizations think about mental health.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/images/hero-headshot.jpg',
        width: 420,
        height: 520,
        alt: 'Chris Marvel — Mental Health Performance Coach',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chris Marvel — Mental Health Performance Coach & Keynote Speaker',
    description:
      'From NFL locker rooms to Fortune 500 boardrooms — Chris Marvel transforms how organizations think about mental health.',
    images: ['/images/hero-headshot.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Christopher "Chris Marvel" Davis',
  jobTitle: 'Mental Health Performance Coach & Keynote Speaker',
  description:
    'Mental Health Performance Coach, professional speaker, and author with over a decade of experience optimizing performance through the lens of psychology.',
  url: 'https://chrismarvel.com',
  image: '/images/hero-headshot.jpg',
  email: 'Jazmine@pivottraining.us',
  telephone: '(770) 313-1232',
  address: [
    { '@type': 'PostalAddress', addressLocality: 'Cleveland', addressRegion: 'OH', addressCountry: 'US' },
    { '@type': 'PostalAddress', addressLocality: 'Atlanta', addressRegion: 'GA', addressCountry: 'US' },
  ],
  alumniOf: { '@type': 'EducationalOrganization', name: 'M.S. Psychology Program' },
  worksFor: { '@type': 'Organization', name: 'Pivot Training & Development' },
  knowsAbout: [
    'Mental Health',
    'Performance Coaching',
    'Keynote Speaking',
    'Psychology',
    'Corporate Wellness',
    'Emotional Intelligence',
  ],
  sameAs: [],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
