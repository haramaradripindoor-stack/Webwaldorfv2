import { getMarkdownPosts, parseFrontMatter } from '@/lib/markdown'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShareButtons from '@/components/ShareButtons'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import MDXGallery from '@/components/MDXGallery'

import remarkGfm from 'remark-gfm'
import { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

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

  const title = `${post.title} | Colegio Waldorf Trekan`;
  const description = post.excerpt || post.description || 'Noticias, pedagogía y reflexiones de la comunidad del Colegio Waldorf Trekan en Puerto Varas.';
  const canonicalUrl = `https://www.colegiowaldorftrekan.cl/noticias/${post.slug}`;
  
  let rawImg = post.image_url || post.imageUrl || post.coverImage || '/imagenes-web/galeria3.webp';
  if (rawImg.startsWith('/images/')) rawImg = rawImg.replace('/images/', '/imagenes-web/');
  if (rawImg.startsWith('images/')) rawImg = rawImg.replace('images/', '/imagenes-web/');
  const ogImageUrl = rawImg.startsWith('http') ? rawImg : `https://www.colegiowaldorftrekan.cl${rawImg.startsWith('/') ? rawImg : '/' + rawImg}`;
  const keywords = post.meta_keywords || post.keywords || `${post.title}, colegio waldorf puerto varas, pedagogia waldorf, educacion alternativa sur de chile`;

  const { data: metaFrontData } = post.content ? parseFrontMatter(post.content) : { data: {} as Record<string, any> };
  const authorName = post.author || metaFrontData.author || 'Colegio Waldorf Trekan';

  return {
    metadataBase: new URL('https://www.colegiowaldorftrekan.cl'),
    title,
    description,
    keywords,
    authors: [{ name: authorName, url: 'https://www.colegiowaldorftrekan.cl' }],
    creator: 'Colegio Waldorf Trekan',
    publisher: 'Colegio Waldorf Trekan',
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Colegio Waldorf Trekan',
      locale: 'es_CL',
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      authors: [authorName],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${post.title} | Colegio Waldorf Trekan Puerto Varas`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl]
    }
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

  // Parse frontmatter if the content comes raw from Supabase
  const { data: frontData, content: parsedContent } = post.content ? parseFrontMatter(post.content) : { data: {} as Record<string, any>, content: '' };
  const postAuthor = post.author || frontData.author || 'Equipo Pedagógico Trekan';

  const dateStr = new Date(post.published_at || post.created_at || Date.now()).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
  const readTime = Math.ceil((parsedContent.split(' ').length || 300) / 200) + ' min de lectura'

  let rawImg = post.image_url || post.imageUrl || post.coverImage || '/imagenes-web/galeria3.webp';
  if (rawImg.startsWith('/images/')) rawImg = rawImg.replace('/images/', '/imagenes-web/');
  if (rawImg.startsWith('images/')) rawImg = rawImg.replace('images/', '/imagenes-web/');
  const fullImageUrl = rawImg.startsWith('http') ? rawImg : `https://www.colegiowaldorftrekan.cl${rawImg.startsWith('/') ? rawImg : '/' + rawImg}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.colegiowaldorftrekan.cl/noticias/${post.slug}`
    },
    "headline": post.title,
    "description": post.excerpt || post.description || "Noticia y reflexión pedagógica del Colegio Waldorf Trekan en Puerto Varas.",
    "image": [fullImageUrl],
    "datePublished": new Date(post.published_at || post.created_at || Date.now()).toISOString(),
    "dateModified": new Date(post.published_at || post.created_at || Date.now()).toISOString(),
    "author": {
      "@type": "Organization",
      "name": postAuthor,
      "url": "https://www.colegiowaldorftrekan.cl"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Colegio Waldorf Trekan",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.colegiowaldorftrekan.cl/assets/logo.png"
      }
    }
  };

  const heroAlt = post.title 
    ? `${post.title} | Colegio Waldorf Trekan Puerto Varas` 
    : 'Comunidad y educación en el Colegio Waldorf Trekan, Puerto Varas';

  return (
    <>
      {/* JSON-LD Schema.org SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
        }}
      />
      <main className="w-full bg-[#FAF9F6] min-h-screen font-sans selection:bg-[#D35D3E]/20 selection:text-white relative">
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

            <div className={`flex flex-wrap gap-4 items-center mb-8 ${!post.image_url && 'justify-center'}`}>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D35D3E]">{dateStr}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{readTime}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-xs font-medium text-[#2C3E35]/80">
                Por: <strong className="font-semibold text-[#2C3E35]">{postAuthor}</strong>
              </span>
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
                  alt={heroAlt}
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
                  <p className="font-serif text-xl text-[#2C3E35]">{postAuthor}</p>
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
                    strong: ({node, ...props}) => <strong className="font-semibold text-gray-900 bg-[#FAF9F6] px-1" {...props} />,
                    img: ({node, src, alt, ...props}) => {
                      const rawSrc = typeof src === 'string' ? src : '';
                      const safeSrc = rawSrc.startsWith('/images/') 
                        ? rawSrc.replace('/images/', '/imagenes-web/') 
                        : rawSrc.startsWith('images/') 
                        ? rawSrc.replace('images/', '/imagenes-web/') 
                        : rawSrc;
                      const safeAlt = alt && alt.trim().length > 0 
                        ? `${alt} | Colegio Waldorf Trekan Puerto Varas` 
                        : `${post.title} | Colegio Waldorf Trekan Puerto Varas`;
                      return (
                        <figure className="my-12">
                          <img
                            src={safeSrc}
                            alt={safeAlt}
                            loading="lazy"
                            className="w-full h-auto rounded-2xl shadow-sm border border-[#2C3E35]/10 object-cover"
                            {...props}
                          />
                          {alt && alt.trim().length > 0 && (
                            <figcaption className="text-center text-xs text-gray-500 mt-3 font-light italic">
                              {alt}
                            </figcaption>
                          )}
                        </figure>
                      );
                    },
                    code: ({node, className, children, ...props}) => {
                      const match = /language-(\w+)/.exec(className || '');
                      if (match && match[1] === 'gallery') {
                        const images = String(children).trim().split('\n').filter(Boolean).map(s => s.trim());
                        return <MDXGallery images={images} />;
                      }
                      return <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-[#D35D3E]" {...props}>{children}</code>;
                    }
                  }}
                >
                  {parsedContent}
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
    </>
  )
}
