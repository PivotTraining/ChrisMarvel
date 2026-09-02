import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      { source: '/book/what-if-effect', destination: '/book/index.html' },
    ]
  },
}

export default nextConfig
