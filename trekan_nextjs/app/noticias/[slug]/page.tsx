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

// Generar rutas estáticas
export async function generateStaticParams() {
  const posts = getMarkdownPosts('_noticias')
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  const decodedSlug = decodeURIComponent(slug)
  const posts = getMarkdownPosts('_noticias')
  
  const post = posts.find((p) => 
    p.slug === slug || 
    p.slug === decodedSlug ||
    decodeURIComponent(p.slug) === decodedSlug ||
    p.slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === decodedSlug.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  )

  if (!post) {
    return {
      title: 'Noticia no encontrada | Colegio Waldorf Trekan',
    }
  }

  return {
    title: `${post.title} | Colegio Waldorf Trekan`,
    description: post.excerpt || 'Noticias y crónicas de la comunidad Waldorf Trekan.',
    alternates: {
      canonical: `https://www.colegiowaldorftrekan.cl/noticias/${post.slug}`,
    }
  }
}

export default function NoticiaPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const decodedSlug = decodeURIComponent(slug)
  const posts = getMarkdownPosts('_noticias')
  
  const post = posts.find((p) => 
    p.slug === slug || 
    p.slug === decodedSlug ||
    decodeURIComponent(p.slug) === decodedSlug ||
    p.slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === decodedSlug.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  )

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

          <div className="prose prose-lg prose-p:text-[var(--color-waldorf-text-light)] prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-[var(--color-waldorf-moss)] prose-a:text-[var(--color-waldorf-terracotta)] mx-auto max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        <Footer />
      </main>
    </SmoothScroll>
  )
}
