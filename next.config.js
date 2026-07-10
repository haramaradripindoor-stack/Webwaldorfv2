/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['gray-matter'],
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
}

module.exports = nextConfig
