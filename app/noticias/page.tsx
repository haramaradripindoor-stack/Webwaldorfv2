import { getMarkdownPosts, MarkdownPost } from '@/lib/markdown'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'

export const metadata = {
  title: 'Noticias y Vida Escolar | Colegio Waldorf Trekan',
  description: 'Entérate de las últimas novedades, reflexiones y acontecimientos de nuestra comunidad escolar Waldorf en Puerto Varas.',
}

export const revalidate = 0; // Para que actualice siempre que haya cambios en BD

export default async function NoticiasPage() {
  const supabase = createClient();
  let allNews: any[] = [];
  
  try {
    let supabaseNews: any[] = [];
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .order('published_at', { ascending: false });
      
    if (data && !error) {
      supabaseNews = data;
    }
    
    const markdownNews = getMarkdownPosts('_noticias');
    
    const combinedNews = [...supabaseNews, ...markdownNews].sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime() || 0;
      const dateB = new Date(b.published_at || b.created_at).getTime() || 0;
      return dateB - dateA;
    });

    allNews = combinedNews;
  } catch (e) {
    allNews = getMarkdownPosts('_noticias');
  }

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[var(--color-waldorf-paper)] pt-32 pb-24 relative">
        <Navbar />
        {/* Fondo orgánico */}
        <div className="absolute top-0 left-0 w-full h-[50vh] rounded-b-[100%] bg-[var(--color-waldorf-sage)]/10 blur-[60px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <header className="mb-16 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-6">
              Vida Escolar y Noticias
            </h1>
            <p className="text-[var(--color-waldorf-text-light)] text-lg md:text-xl leading-relaxed">
              Reflexiones pedagógicas, crónicas de nuestras festividades y el día a día de nuestra comunidad educativa en el sur de Chile.
            </p>
          </header>

          {allNews.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--color-waldorf-text-light)] text-lg">Aún no hay noticias publicadas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allNews.map((post: MarkdownPost) => (
                <Link href={`/noticias/${post.slug}`} key={post.id}>
                  <article 
                    className="group flex flex-col h-full bg-[var(--color-waldorf-cream)] rounded-3xl overflow-hidden border border-[var(--color-waldorf-sage)]/20 hover:border-[var(--color-waldorf-sage)]/40 earth-shadow earth-shadow-hover transition-all duration-500 interactive"
                  >
                    {post.image_url && (
                      <div className="relative h-64 w-full overflow-hidden shrink-0 border-b border-[var(--color-waldorf-sage)]/10">
                        <Image
                          src={post.image_url.startsWith('/images/') ? post.image_url.replace('/images/', '/imagenes-web/') : post.image_url}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    )}
                    
                    <div className="p-8 flex flex-col flex-grow">
                      <time className="text-xs font-semibold text-[var(--color-waldorf-terracotta)] flex items-center gap-2 mb-4">
                        <Calendar size={14} />
                        {new Date(post.published_at).toLocaleDateString('es-CL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <h3 className="text-2xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-4 leading-snug group-hover:text-[var(--color-waldorf-terracotta)] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-[var(--color-waldorf-text-light)] leading-relaxed mb-8 flex-grow">
                        {post.excerpt}
                      </p>
                      
                      <span className="text-[var(--color-waldorf-moss)] font-semibold text-sm flex items-center gap-2 mt-auto">
                        Leer artículo completo
                        <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </main>
    </SmoothScroll>
  )
}
