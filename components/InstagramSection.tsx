'use client'

import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'
import Image from 'next/image'

const posts = [
  { img: '/imagenes-web/galeria3.webp', link: 'https://www.instagram.com/waldorftrekanpv/', delay: 0 },
  { img: '/imagenes-web/galeria7.webp', link: 'https://www.instagram.com/waldorftrekanpv/', delay: 0.1 },
  { img: '/imagenes-web/galeria10.webp', link: 'https://www.instagram.com/waldorftrekanpv/', delay: 0.2 },
  { img: '/imagenes-web/galeria8.webp', link: 'https://www.instagram.com/waldorftrekanpv/', delay: 0.3 },
]

export default function InstagramSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-white relative overflow-hidden border-t border-[var(--color-waldorf-sage)]/10">
      
      {/* Organic background */}
      <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-[var(--color-waldorf-cream)] rounded-[100%] blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[var(--color-waldorf-moss)] flex items-center justify-center md:justify-start gap-3">
              <Instagram size={32} className="text-[var(--color-waldorf-terracotta)]" />
              Comunidad Activa
            </h2>
            <p className="text-[var(--color-waldorf-text-light)] text-base mt-2 font-medium">
              Sigue el día a día de nuestros caminantes en @waldorftrekanpv
            </p>
          </div>
          <a 
            href="https://www.instagram.com/waldorftrekanpv/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[var(--color-waldorf-paper)] text-[var(--color-waldorf-moss)] font-bold text-sm hover:bg-[var(--color-waldorf-cream)] border border-[var(--color-waldorf-sage)]/20 earth-shadow transition-colors"
          >
            Seguir en Instagram
          </a>
        </div>

        <div className="relative w-full overflow-hidden flex pt-8 pb-12 -mx-6 md:-mx-12 px-6 md:px-12 mask-edges">
          <div className="flex gap-4 md:gap-6 w-max animate-marquee interactive">
            {/* Duplicamos los posts para el efecto infinito */}
            {[...posts, ...posts, ...posts].map((post, i) => (
              <a
                key={i}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-64 md:w-80 aspect-square rounded-[32px] overflow-hidden group earth-shadow flex-shrink-0"
              >
                <Image
                  src={post.img}
                  alt="Instagram post"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 256px, 320px"
                />
                <div className="absolute inset-0 bg-[var(--color-waldorf-moss)]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <Instagram size={32} className="text-[var(--color-waldorf-cream)] translate-y-4 group-hover:translate-y-0 transition-transform duration-500" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .mask-edges {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-33.33%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />
      </div>
    </section>
  )
}
