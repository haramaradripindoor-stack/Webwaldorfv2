'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image_url?: string;
  published_at: string;
  category?: string;
  [key: string]: any;
}

const CATEGORIES = [
  'Todas',
  'Comunidad y Gobernanza',
  'Pedagogía y Neurociencia',
  'Crianza y Bienestar',
  'Festividades e Hitos',
] as const;

type CategoryType = (typeof CATEGORIES)[number];

function detectCategory(post: NewsItem): Exclude<CategoryType, 'Todas'> {
  // 1. Si ya viene categorizada explícitamente
  const explicit = (post.category || post.categoria || '').toLowerCase().trim();
  if (explicit.includes('comunidad') || explicit.includes('gobernanza') || explicit.includes('filosofía')) {
    return 'Comunidad y Gobernanza';
  }
  if (explicit.includes('pedagogía') || explicit.includes('neurociencia')) {
    return 'Pedagogía y Neurociencia';
  }
  if (explicit.includes('crianza') || explicit.includes('bienestar') || explicit.includes('hogar')) {
    return 'Crianza y Bienestar';
  }
  if (explicit.includes('festividad') || explicit.includes('hito')) {
    return 'Festividades e Hitos';
  }

  // 2. Inferencia inteligente por slug y título
  const text = `${post.slug} ${post.title} ${post.excerpt}`.toLowerCase();

  if (
    text.includes('fiesta') ||
    text.includes('inauguracion') ||
    text.includes('hitos') ||
    text.includes('arado') ||
    text.includes('construyendo-la-casa') ||
    text.includes('celebracion')
  ) {
    return 'Festividades e Hitos';
  }

  if (
    text.includes('pantalla') ||
    text.includes('juego libre') ||
    text.includes('juego-libre') ||
    text.includes('magia-del-ritmo') ||
    text.includes('tdah') ||
    text.includes('luz artificial') ||
    text.includes('kinder') ||
    text.includes('cambiar de colegio') ||
    text.includes('colegios alternativos') ||
    text.includes('migrar al sur')
  ) {
    return 'Crianza y Bienestar';
  }

  if (
    text.includes('aprendizaje') ||
    text.includes('neurociencia') ||
    text.includes('multigrado') ||
    text.includes('cerebro') ||
    text.includes('curriculum') ||
    text.includes('estudio del niño') ||
    text.includes('cronobiologia') ||
    text.includes('rimas') ||
    text.includes('aulas-waldorf') ||
    text.includes('orden detras de la libertad') ||
    text.includes('ritmo waldorf')
  ) {
    return 'Pedagogía y Neurociencia';
  }

  // Por defecto, tratados de organización, clausto, trimembración, comunidad
  return 'Comunidad y Gobernanza';
}

export default function NoticiasFilterGrid({ initialPosts }: { initialPosts: NewsItem[] }) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('Todas');

  // Enriquecer cada post con su categoría asignada
  const enrichedPosts = useMemo(() => {
    return initialPosts.map((post) => ({
      ...post,
      assignedCategory: detectCategory(post),
    }));
  }, [initialPosts]);

  // Contadores por categoría
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryType, number> = {
      Todas: enrichedPosts.length,
      'Comunidad y Gobernanza': 0,
      'Pedagogía y Neurociencia': 0,
      'Crianza y Bienestar': 0,
      'Festividades e Hitos': 0,
    };

    enrichedPosts.forEach((post) => {
      counts[post.assignedCategory] = (counts[post.assignedCategory] || 0) + 1;
    });

    return counts;
  }, [enrichedPosts]);

  // Filtrado reactivo
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'Todas') return enrichedPosts;
    return enrichedPosts.filter((post) => post.assignedCategory === activeCategory);
  }, [enrichedPosts, activeCategory]);

  return (
    <div className="w-full">
      {/* BARRA DE FILTROS EDITORIAL TÁCTIL WALDORF */}
      <div className="mb-14 flex items-center justify-center">
        <div className="flex items-center gap-2.5 overflow-x-auto py-2 px-3 max-w-full no-scrollbar rounded-full bg-[var(--color-waldorf-paper)]/60 border border-[var(--color-waldorf-sage)]/25 p-1.5 shadow-sm">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count = categoryCounts[cat];

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`group relative whitespace-nowrap px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#2C3E35] text-white shadow-md shadow-[#2C3E35]/20 scale-[1.02]'
                    : 'bg-transparent text-[var(--color-waldorf-moss)]/70 hover:text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-cream)]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[var(--color-waldorf-sage)]/20 text-[var(--color-waldorf-moss)] group-hover:bg-[var(--color-waldorf-sage)]/30'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RESULTADOS / CONTADOR SUTIL */}
      <div className="flex items-center justify-between text-xs text-[var(--color-waldorf-text-light)] mb-6 px-2">
        <p>
          Mostrando <strong className="text-[var(--color-waldorf-moss)]">{filteredPosts.length}</strong> de{' '}
          {enrichedPosts.length} reflexiones
        </p>
        {activeCategory !== 'Todas' && (
          <button
            onClick={() => setActiveCategory('Todas')}
            className="text-[var(--color-waldorf-terracotta)] hover:underline font-semibold"
          >
            Ver todas las publicaciones
          </button>
        )}
      </div>

      {/* GRILLA DE ARTÍCULOS */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-[var(--color-waldorf-cream)]/50 rounded-3xl border border-dashed border-[var(--color-waldorf-sage)]/30">
          <p className="text-[var(--color-waldorf-text-light)] text-base">
            No hay reflexiones en esta categoría en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => {
            const rawImg = post.image_url;
            const imgSrc =
              rawImg && rawImg.startsWith('/images/')
                ? rawImg.replace('/images/', '/imagenes-web/')
                : rawImg && !rawImg.startsWith('/') && !rawImg.startsWith('http')
                ? '/' + rawImg
                : rawImg || '/imagenes-web/galeria3.webp';

            return (
              <Link href={`/noticias/${post.slug}`} key={post.id || post.slug} className="block h-full">
                <article className="group flex flex-col h-full bg-[var(--color-waldorf-cream)] rounded-3xl overflow-hidden border border-[var(--color-waldorf-sage)]/20 hover:border-[var(--color-waldorf-sage)]/40 earth-shadow earth-shadow-hover transition-all duration-500 interactive">
                  {imgSrc && (
                    <div className="relative h-64 w-full overflow-hidden shrink-0 border-b border-[var(--color-waldorf-sage)]/10">
                      <Image
                        src={imgSrc}
                        alt={post.title}
                        fill
                        priority={index <= 2}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Badge de Categoría flotante sobre imagen */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-[#2C3E35] shadow-sm">
                          {post.assignedCategory}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-grow">
                    <time className="text-xs font-semibold text-[var(--color-waldorf-terracotta)] flex items-center gap-2 mb-3">
                      <Calendar size={13} />
                      {new Date(post.published_at).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>

                    <h3 className="text-2xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-3 leading-snug group-hover:text-[var(--color-waldorf-terracotta)] transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-[var(--color-waldorf-text-light)] text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>

                    <span className="text-[var(--color-waldorf-moss)] font-semibold text-sm flex items-center gap-2 mt-auto pt-4 border-t border-[var(--color-waldorf-sage)]/15">
                      Leer reflexión completa
                      <ArrowRight size={15} className="transform group-hover:translate-x-1.5 transition-transform text-[var(--color-waldorf-terracotta)]" />
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
