/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['gray-matter']
  },
  images: {
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
