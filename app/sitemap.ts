import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.colegiowaldorftrekan.cl'
  
  const routes = [
    '',
    '/admision',
    '/arriendo-salon',
    '/noticias',
    '/recursos',
    '/actividades'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  return routes
}
