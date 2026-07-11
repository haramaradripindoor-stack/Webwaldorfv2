import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.colegiowaldorftrekan.cl'
  
  const baseRoutes = [
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

  const cities = [
    'puerto-varas',
    'puerto-montt',
    'frutillar',
    'llanquihue',
    'osorno',
    'valdivia',
    'chiloe',
    'santiago'
  ]

  const cityRoutes = cities.map((city) => ({
    url: `${baseUrl}/colegio-waldorf-${city}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...baseRoutes, ...cityRoutes]
}
