import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const rootDirectory = path.join(process.cwd(), '..')

export interface MarkdownPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image_url: string
  published_at: string
  [key: string]: any
}

export function getMarkdownPosts(folder: '_noticias' | '_actividades'): MarkdownPost[] {
  const directory = path.join(rootDirectory, folder)
  
  if (!fs.existsSync(directory)) {
    return []
  }

  const fileNames = fs.readdirSync(directory)
  
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(directory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      const match = fileName.match(/^(\d{4}-\d{2}-\d{2})-/)
      const fallbackDate = match ? match[1] : new Date().toISOString()

      // Intentamos parsear la fecha, si no es válida, usamos el fallback del archivo
      let validDate = fallbackDate
      if (data.date || data.published_at) {
        const parsed = new Date(data.date || data.published_at)
        if (!isNaN(parsed.getTime())) {
          validDate = parsed.toISOString()
        }
      } else if (data.fecha) {
        // En los md antiguos, la fecha es string en español, por lo que fallará el Date().
        // En ese caso, dejamos validDate = fallbackDate que viene del nombre del archivo.
      }

      return {
        id: slug,
        slug,
        title: data.title || data.nombre || data.titulo || 'Sin título',
        excerpt: data.excerpt || data.descripcion || content.substring(0, 150) + '...',
        content,
        image_url: (() => {
          let img = data.image_url || data.imagen || data.foto || '/images/galeria3.webp';
          if (img && !img.startsWith('/') && !img.startsWith('http')) {
            img = '/' + img;
          }
          return img;
        })(),
        published_at: validDate,
        fecha_display: data.fecha || null, // Guardamos el string original en español por si se quiere mostrar
        ...data,
      } as MarkdownPost
    })

  // Para ordenar, usamos el fallbackDate o intentamos parsear la fecha
  return posts.sort((a, b) => {
    const dateA = new Date(a.published_at).getTime() || new Date(a.slug.substring(0, 10)).getTime() || 0;
    const dateB = new Date(b.published_at).getTime() || new Date(b.slug.substring(0, 10)).getTime() || 0;
    return dateB - dateA;
  })
}
