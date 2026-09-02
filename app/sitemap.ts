import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://chrismarvelspeaks.com'
  const lastMod = new Date()

  return [
    { url: baseUrl, lastModified: lastMod, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/book`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${baseUrl}/book/what-if-effect`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/two-rooms`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/two-rooms/field-kit`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/two-rooms/script-vault`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.82 },
    { url: `${baseUrl}/two-rooms/lab`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.82 },
    { url: `${baseUrl}/#about`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/#method`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/#keynotes`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/#testimonials`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/#faq`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/#contact`, lastModified: lastMod, changeFrequency: 'monthly', priority: 0.9 },
  ]
}
