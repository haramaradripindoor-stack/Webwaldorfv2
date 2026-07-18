import { MetadataRoute } from 'next'
import { getMarkdownPosts } from '@/lib/markdown'

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

  const noticias = getMarkdownPosts('_noticias').map((post) => {
    // Evitar errores con fechas inválidas
    let lastMod = new Date().toISOString().split('T')[0];
    try {
      if (post.published_at) lastMod = new Date(post.published_at).toISOString().split('T')[0];
    } catch (e) {}

    return {
      url: `${baseUrl}/noticias/${post.slug}`,
      lastModified: lastMod,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  const actividades = getMarkdownPosts('_actividades').map((post) => {
    let lastMod = new Date().toISOString().split('T')[0];
    try {
      if (post.published_at) lastMod = new Date(post.published_at).toISOString().split('T')[0];
    } catch (e) {}

    return {
      url: `${baseUrl}/actividades/${post.slug}`,
      lastModified: lastMod,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  return [...baseRoutes, ...cityRoutes, ...noticias, ...actividades]
}
