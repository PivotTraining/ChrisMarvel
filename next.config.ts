import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      { source: '/book/what-if-effect', destination: '/book/index.html' },
    ]
  },
  async redirects() {
    return [
      { source: '/two-rooms', destination: '/on-camera', permanent: true },
      { source: '/two-rooms/thank-you', destination: '/on-camera/thank-you', permanent: true },
      { source: '/two-rooms/field-kit', destination: '/on-camera/field-kit', permanent: true },
      { source: '/two-rooms/field-kit/thank-you', destination: '/on-camera/field-kit/thank-you', permanent: true },
      { source: '/two-rooms/script-vault', destination: '/on-camera/script-vault', permanent: true },
      { source: '/two-rooms/script-vault/thank-you', destination: '/on-camera/script-vault/thank-you', permanent: true },
      { source: '/two-rooms/lab', destination: '/on-camera/lab', permanent: true },
      { source: '/two-rooms/lab/thank-you', destination: '/on-camera/lab/thank-you', permanent: true },
    ]
  },
}

export default nextConfig
