import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      { source: '/book', destination: '/book/index.html' },
    ]
  },
}

export default nextConfig
