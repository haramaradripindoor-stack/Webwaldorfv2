/** @type {import('next').NextConfig} */
const nextConfig = {
  // Images from the parent project folder
  images: {
    unoptimized: true,
  },
  // Serve static assets from the parent project's images/ and assets/ folders
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/images/:path*',
      },
    ]
  },
}

module.exports = nextConfig
