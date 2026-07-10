import { getMarkdownPosts } from '@/lib/markdown'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import SmoothScroll from '@/components/SmoothScroll'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'

// Removed generateStaticParams since we are now fully dynamic with Supabase
// (or we could fetch from Supabase to generate static params, but dynamic is better for CMS)

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  const decodedSlug = decodeURIComponent(slug)
  
  const supabase = createClient()
  let post = null

  // Intentar buscar en Supabase primero
  const { data } = await supabase
    .from('noticias')
    .select('*')
    .eq('slug', decodedSlug)
    .single()

  if (data) {
    post = data
  } else {
    // Fallback a archivos Markdown
    const posts = getMarkdownPosts('_noticias')
    post = posts.find((p) => 
      p.slug === slug || 
      p.slug === decodedSlug ||
      decodeURIComponent(p.slug) === decodedSlug ||
      p.slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === decodedSlug.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    )
  }

  if (!post) {
    return {
      title: 'Noticia no encontrada | Colegio Waldorf Trekan',
    }
  }

  return {
    title: `${post.title} | Colegio Waldorf Trekan`,
    description: post.excerpt || 'Noticias y crónicas de la comunidad Waldorf Trekan.',
    keywords: post.meta_keywords || 'colegio waldorf, pedagogia waldorf, puerto varas, educacion alternativa',
    alternates: {
      canonical: `https://www.colegiowaldorftrekan.cl/noticias/${post.slug}`,
    }
  }
}

export default async function NoticiaPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const decodedSlug = decodeURIComponent(slug)
  
  const supabase = createClient()
  let post = null

  // Intentar buscar en Supabase primero
  const { data } = await supabase
    .from('noticias')
    .select('*')
    .eq('slug', decodedSlug)
    .single()

  if (data) {
    post = data
  } else {
    // Fallback a archivos Markdown
    const posts = getMarkdownPosts('_noticias')
    post = posts.find((p) => 
      p.slug === slug || 
      p.slug === decodedSlug ||
      decodeURIComponent(p.slug) === decodedSlug ||
      p.slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === decodedSlug.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[var(--color-waldorf-cream)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-[var(--color-waldorf-moss)] mb-4">Noticia no encontrada</h1>
          <Link href="/" className="text-[var(--color-waldorf-terracotta)] hover:underline">Volver al inicio</Link>
        </div>
      </main>
    )
  }

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[var(--color-waldorf-cream)]">
        <Navbar />
        
        <article className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
          <Link href="/#noticias" className="inline-flex items-center gap-2 text-[var(--color-waldorf-moss)] hover:text-[var(--color-waldorf-terracotta)] transition-colors mb-10 text-sm font-semibold">
            <ArrowLeft size={16} /> Volver a noticias
          </Link>

          <header className="mb-12 text-center md:text-left">
            <time className="text-sm font-semibold text-[var(--color-waldorf-terracotta)] flex items-center justify-center md:justify-start gap-2 mb-6">
              <Calendar size={16} />
              {new Date(post.published_at).toLocaleDateString('es-CL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <h1 className="text-4xl md:text-6xl font-bold font-serif text-[var(--color-waldorf-moss)] leading-tight mb-8">
              {post.title}
            </h1>
          </header>

          <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 earth-shadow">
            <Image
              src={post.image_url || '/images/galeria3.webp'}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="mx-auto max-w-3xl">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-waldorf-moss)] mt-12 mb-6 leading-tight" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-waldorf-moss)] mt-10 mb-4 leading-snug" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-2xl font-serif text-[var(--color-waldorf-moss)] mt-8 mb-4 leading-snug" {...props} />,
                p: ({node, ...props}) => <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 font-light tracking-wide" {...props} />,
                ul: ({node, ...props}) => <ul className="list-none pl-0 mb-8 space-y-4 text-lg md:text-xl text-gray-700 font-light" {...props} />,
                li: ({node, ...props}) => (
                  <li className="flex items-start">
                    <span className="text-[var(--color-waldorf-terracotta)] mr-3 mt-1 text-xl">•</span>
                    <span {...props} />
                  </li>
                ),
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[var(--color-waldorf-terracotta)] pl-6 italic text-xl md:text-2xl text-[var(--color-waldorf-moss)] my-10 bg-[var(--color-waldorf-sage)]/10 py-6 pr-6 rounded-r-2xl" {...props} />,
                a: ({node, ...props}) => <a className="text-[var(--color-waldorf-terracotta)] hover:text-[#903a22] hover:underline underline-offset-4 font-medium transition-colors" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        <Footer />
      </main>
    </SmoothScroll>
  )
}
