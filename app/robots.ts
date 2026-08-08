import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/*.mp4$', '/*.webm$'],
      },
      {
        userAgent: 'Googlebot-Video',
        disallow: ['/imagenes-web/', '/assets/'],
      }
    ],
    sitemap: 'https://www.colegiowaldorftrekan.cl/sitemap.xml',
  }
}
