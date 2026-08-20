import { getMarkdownPosts } from '@/lib/markdown'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShareButtons from '@/components/ShareButtons'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import SmoothScroll from '@/components/SmoothScroll'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  const decodedSlug = decodeURIComponent(slug)
  const supabase = createClient()
  let post = null

  const { data } = await supabase.from('noticias').select('*').eq('slug', decodedSlug).single()

  if (data) {
    post = data
  } else {
    const posts = getMarkdownPosts('_noticias')
    post = posts.find((p) => 
      p.slug === slug || 
      p.slug === decodedSlug ||
      decodeURIComponent(p.slug) === decodedSlug ||
      p.slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === decodedSlug.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    )
  }

  if (!post) return { title: 'Noticia no encontrada | Colegio Waldorf Trekan' }

  return {
    title: `${post.title} | Colegio Waldorf Trekan`,
    description: post.excerpt || 'Noticias y crónicas de la comunidad Waldorf Trekan.',
    keywords: post.meta_keywords || 'colegio waldorf, pedagogia waldorf, puerto varas, educacion alternativa',
    alternates: { canonical: `https://www.colegiowaldorftrekan.cl/noticias/${post.slug}` }
  }
}

export default async function NoticiaPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const decodedSlug = decodeURIComponent(slug)
  const supabase = createClient()
  let post = null

  const { data } = await supabase.from('noticias').select('*').eq('slug', decodedSlug).single()

  if (data) {
    post = data
  } else {
    const posts = getMarkdownPosts('_noticias')
    post = posts.find((p) => 
      p.slug === slug || p.slug === decodedSlug || decodeURIComponent(p.slug) === decodedSlug || p.slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === decodedSlug.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-[#EAE6DF] mb-4">Noticia no encontrada</h1>
          <Link href="/" className="text-[#D35D3E] hover:underline">Volver al inicio</Link>
        </div>
      </main>
    )
  }

  const dateStr = new Date(post.published_at).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
  const readTime = Math.ceil((post.content?.split(' ').length || 300) / 200) + ' min de lectura'

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.colegiowaldorftrekan.cl/noticias/${post.slug}`
    },
    "headline": post.title,
    "image": post.image_url ? [
      post.image_url.startsWith('/') 
        ? `https://www.colegiowaldorftrekan.cl${post.image_url}` 
        : post.image_url.replace('/images/', '/imagenes-web/')
    ] : ["https://www.colegiowaldorftrekan.cl/assets/logo.png"],
    "datePublished": new Date(post.published_at).toISOString(),
    "dateModified": new Date(post.published_at).toISOString(),
    "author": {
      "@type": post.author ? "Person" : "Organization",
      "name": post.author || "Colegio Waldorf Trekan",
      "url": "https://www.colegiowaldorftrekan.cl"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Colegio Waldorf Trekan",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.colegiowaldorftrekan.cl/assets/logo.png"
      }
    },
    "description": post.excerpt || "Noticia del Colegio Waldorf Trekan"
  };

  return (
    <SmoothScroll>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#FAF9F6] selection:bg-[#D35D3E] selection:text-white relative">
        <Navbar />
        
        {/* Progress Bar Header */}
        <div className="fixed top-0 left-0 w-full h-1 bg-[#EAE6DF] z-50">
          <div className="h-full bg-[#D35D3E] origin-left animate-[scaleX_scroll_linear]" style={{ animationTimeline: 'scroll()' }} />
        </div>

        {/* HERO SECTION - SPLIT LAYOUT AWWWARDS STYLE */}
        <section className={`relative w-full min-h-[90vh] flex flex-col pt-24 md:pt-0 ${post.image_url ? 'md:flex-row' : 'items-center justify-center'}`}>
          {/* Typographic Side */}
          <div className={`w-full flex flex-col justify-center px-6 md:px-16 lg:px-24 py-12 z-10 ${post.image_url ? 'md:w-1/2' : 'max-w-5xl items-center text-center'}`}>
            <Link href="/#noticias" className={`group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#2C3E35] hover:text-[#D35D3E] transition-colors mb-16 w-fit ${!post.image_url && 'mx-auto'}`}>
              <span className="w-8 h-[1px] bg-[#2C3E35] group-hover:bg-[#D35D3E] group-hover:w-12 transition-all duration-300"></span>
              Volver a Diario
            </Link>

            <div className={`flex gap-4 items-center mb-8 ${!post.image_url && 'justify-center'}`}>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D35D3E]">{dateStr}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{readTime}</span>
            </div>

            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-serif text-[#2C3E35] leading-[0.95] tracking-tight mb-8 ${!post.image_url && 'text-center mx-auto'}`}>
              {post.title}
            </h1>

            {post.excerpt && (
              <p className={`text-xl md:text-2xl text-gray-500 font-light max-w-md leading-relaxed ${post.image_url ? 'border-l-2 pl-6' : 'border-t-2 pt-6 text-center mx-auto'} border-[#D35D3E] mt-8`}>
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Photographic Right Side (Only if image exists) */}
          {post.image_url && (
            <div className="w-full md:w-1/2 h-[60vh] md:h-screen sticky top-0">
              <div className="absolute inset-0 bg-[#2C3E35]/20 mix-blend-multiply z-10 pointer-events-none" />
              {(post.image_url.includes('youtube.com') || post.image_url.includes('youtu.be')) ? (
                <iframe 
                  src={`https://www.youtube.com/embed/${post.image_url.split('v=')[1]?.split('&')[0] || post.image_url.split('youtu.be/')[1]}?autoplay=1&mute=1&loop=1&playlist=${post.image_url.split('v=')[1]?.split('&')[0] || post.image_url.split('youtu.be/')[1]}&controls=0`} 
                  className="absolute top-1/2 left-1/2 w-[150vw] md:w-[150vh] h-[150vh] md:h-[150vw] -translate-x-1/2 -translate-y-1/2 object-cover"
                  allow="autoplay; fullscreen"
                />
              ) : post.image_url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <video src={post.image_url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
              ) : (
                <Image
                  src={post.image_url.startsWith('/images/') ? post.image_url.replace('/images/', '/imagenes-web/') : post.image_url.startsWith('images/') ? post.image_url.replace('images/', '/imagenes-web/') : post.image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
          )}
        </section>

        {/* EDITORIAL CONTENT SECTION */}
        <article className="relative w-full bg-[#FAF9F6] z-20 px-6 md:px-16 lg:px-24 py-24 md:py-32">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            
            {/* Left Metadata / Share Column (Sticky) */}
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-40 space-y-12">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Escrito por</p>
                  <p className="font-serif text-xl text-[#2C3E35]">Comunidad Trekan</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Compartir</p>
                  <ShareButtons url={`https://www.colegiowaldorftrekan.cl/noticias/${post.slug}`} title={post.title} />
                </div>
                <div className="w-full h-[1px] bg-gray-200" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#D35D3E] leading-relaxed">
                  "Educar no es llenar un cubo, es encender un fuego."
                </p>
              </div>
            </aside>

            {/* Main Content Column */}
            <div className="lg:col-span-8 lg:col-start-5">
              <div className="prose-container">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2C3E35] mt-16 mb-8 leading-tight tracking-tight" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#2C3E35] mt-16 mb-8 leading-tight tracking-tight" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-2xl md:text-3xl font-serif text-[#2C3E35] mt-12 mb-6 leading-snug" {...props} />,
                    p: ({node, ...props}) => <p className="text-lg md:text-2xl text-gray-700 leading-[1.8] mb-8 font-light" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-none pl-0 mb-12 space-y-4 text-lg md:text-xl text-gray-700 font-light" {...props} />,
                    li: ({node, ...props}) => (
                      <li className="flex items-start">
                        <span className="text-[#D35D3E] mr-4 mt-1.5 text-xl">✦</span>
                        <span className="leading-relaxed" {...props} />
                      </li>
                    ),
                    blockquote: ({node, children}) => (
                      <blockquote className="my-16 md:my-24 py-8 md:py-12 border-t border-b border-[#2C3E35]/20">
                        <p className="font-serif text-3xl md:text-5xl text-[#2C3E35] leading-tight text-center italic">
                          {children}
                        </p>
                      </blockquote>
                    ),
                    a: ({node, ...props}) => <a className="text-[#D35D3E] hover:text-[#903a22] hover:bg-[#D35D3E]/10 underline underline-offset-8 decoration-1 font-medium transition-all px-1 -mx-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-gray-900 bg-[#FAF9F6] px-1" {...props} />
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
            
          </div>
        </article>

        {/* NEXT ARTICLE TEASER / CALL TO ACTION */}
        <section className="w-full bg-[#2C3E35] text-[#FAF9F6] py-32 px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D35D3E] mb-6">El viaje continúa</p>
          <h2 className="text-4xl md:text-6xl font-serif mb-12 max-w-4xl mx-auto leading-tight">
            ¿Listo para ser parte de una educación con sentido?
          </h2>
          <Link href="/#admision" className="inline-flex items-center justify-center px-10 py-5 bg-[#D35D3E] text-white font-bold uppercase tracking-widest text-sm hover:bg-[#b04a32] transition-colors rounded-full">
            Inicia tu postulación
          </Link>
        </section>

        <Footer />
      </main>

      {/* Global CSS animation for progress bar */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scaleX {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}} />
    </SmoothScroll>
  )
}
