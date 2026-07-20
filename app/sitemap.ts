import { MetadataRoute } from 'next'
import { getMarkdownPosts } from '@/lib/markdown'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()
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

  const { data: dbNoticias } = await supabase.from('noticias').select('slug, published_at')
  
  const dbNoticiasUrls = (dbNoticias || []).map((post) => {
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

  const mdNoticiasUrls = getMarkdownPosts('_noticias').map((post) => {
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

  // Deduplicar URLs (por si una noticia está en ambos lados)
  const urlsMap = new Map()
  ;[...dbNoticiasUrls, ...mdNoticiasUrls].forEach(item => {
    urlsMap.set(item.url, item)
  })
  const todasLasNoticias = Array.from(urlsMap.values())

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

  return [...baseRoutes, ...cityRoutes, ...todasLasNoticias, ...actividades]
}
