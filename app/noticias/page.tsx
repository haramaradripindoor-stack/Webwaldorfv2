import { createClient } from '@/utils/supabase/server'
import { getMarkdownPosts } from '@/lib/markdown'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NoticiasFilterGrid from '@/components/NoticiasFilterGrid'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.colegiowaldorftrekan.cl'),
  title: 'Noticias y Vida Escolar | Colegio Waldorf Trekan Puerto Varas',
  description: 'Entérate de las últimas novedades, reflexiones pedagógicas y acontecimientos de nuestra comunidad escolar Waldorf en Puerto Varas.',
  keywords: [
    'Colegio Waldorf Trekan',
    'Noticias Waldorf Puerto Varas',
    'Pedagogía Waldorf sur de Chile',
    'Educación alternativa Puerto Varas',
    'Vida comunitaria Waldorf',
    'Crianza consciente Puerto Varas'
  ],
  alternates: {
    canonical: 'https://www.colegiowaldorftrekan.cl/noticias',
  },
  openGraph: {
    title: 'Noticias y Vida Escolar | Colegio Waldorf Trekan Puerto Varas',
    description: 'Entérate de las últimas novedades, reflexiones pedagógicas y acontecimientos de nuestra comunidad escolar Waldorf en Puerto Varas.',
    url: 'https://www.colegiowaldorftrekan.cl/noticias',
    siteName: 'Colegio Waldorf Trekan',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: 'https://www.colegiowaldorftrekan.cl/imagenes-web/galeria10.webp',
        width: 1200,
        height: 630,
        alt: 'Comunidad escolar y vida pedagógica en el Colegio Waldorf Trekan, Puerto Varas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noticias y Vida Escolar | Colegio Waldorf Trekan Puerto Varas',
    description: 'Entérate de las últimas novedades, reflexiones pedagógicas y acontecimientos de nuestra comunidad escolar Waldorf en Puerto Varas.',
    images: ['https://www.colegiowaldorftrekan.cl/imagenes-web/galeria10.webp'],
  },
}

export const revalidate = 60; // ISR para permitir lectura de Markdown en Vercel (1 min)

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

    const uniqueNewsMap = new Map();
    [...markdownNews, ...supabaseNews].forEach(item => {
      const normalizedTitle = (item.title || '').toLowerCase().trim().replace(/[\W_]+/g, '-');
      const key = normalizedTitle || item.slug;
      
      // Si el item nuevo no tiene imagen y el existente sí, conservamos el existente.
      if (uniqueNewsMap.has(key)) {
        const existing = uniqueNewsMap.get(key);
        if (existing.image_url && !item.image_url) {
          return; // No sobreescribir si perderíamos la foto
        }
      }
      uniqueNewsMap.set(key, item);
    });
    
    const uniqueItems = Array.from(uniqueNewsMap.values());
    
    allNews = uniqueItems.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at || a.date).getTime() || 0;
      const dateB = new Date(b.published_at || b.created_at || b.date).getTime() || 0;
      return dateB - dateA;
    });

  } catch (e) {
    console.error("Error fetching news:", e);
    allNews = getMarkdownPosts('_noticias');
  }

  return (
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

        <NoticiasFilterGrid initialPosts={allNews} />
      </div>
      <Footer />
    </main>
  )
}
