/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['gray-matter']
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/recursos-waldorf-chile',
        destination: '/recursos',
        permanent: true,
      },
      {
        source: '/postula',
        destination: '/admision',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/colegio-waldorf-:ciudad',
        destination: '/ciudades/:ciudad',
      },
    ]
  },
}

module.exports = nextConfig
