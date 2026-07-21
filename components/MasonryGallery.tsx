'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const fallbackImages = [
  { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/paseocerro20264.jpg', alt: 'Exploración en la naturaleza', span: 'col-span-2 row-span-2' },
  { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/actividapedagogicahumedales5.jpg', alt: 'Conexión vivencial', span: 'col-span-1 row-span-1' },
  { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/fiesta%20de%20la%20luz202610.jpg', alt: 'Ritmos y tradiciones', span: 'col-span-1 row-span-2' },
  { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/paseocerro20268.jpg', alt: 'Comunidad en movimiento', span: 'col-span-1 row-span-1' },
  { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/actividapedagogicahumedales6.jpg', alt: 'Aprendizaje en el entorno', span: 'col-span-2 row-span-1' },
  { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/paseocerro20269.jpg', alt: 'Libertad y asombro', span: 'col-span-1 row-span-1' },
  { url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/fiesta%20de%20la%20luz20268.jpg', alt: 'Luz y calidez', span: 'col-span-1 row-span-1' },
]

export default function MasonryGallery({ data }: { data?: any }) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const images = data || fallbackImages;

  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;

    const cards = gridRef.current.children;
    const ctx = gsap.context(() => {

      // 1. Animación del Título (Sprout Text)
      gsap.fromTo([subtitleRef.current, titleRef.current], 
        { y: 50, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        { 
          y: 0, 
          opacity: 1, 
          clipPath: 'inset(0% 0 0 0)', 
          duration: 1.2, 
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );

      // 2. Parallax Asimétrico en las Cajas del Grid
      // Cada tarjeta sube a velocidades distintas a medida que scrolleamos
      Array.from(cards).forEach((card, i) => {
        const speed = i % 2 === 0 ? 0.05 : 0.15; // Velocidades alternas
        const yOffset = i % 2 === 0 ? 100 : 200; // Desplazamiento inicial

        // Entrada inicial (Brotar)
        gsap.fromTo(card, 
          { y: yOffset, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%", // Apenas entra a la pantalla brota
            }
          }
        );

        // Parallax continuo (Scrub)
        gsap.to(card, {
          y: () => -window.innerHeight * speed, // Desfase según scroll
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1 // Conectado orgánicamente al Lenis
          }
        });
        
        // Efecto Parallax en la Imagen interna
        const img = card.querySelector('img');
        if(img) {
            gsap.fromTo(img, 
                { y: '-10%', scale: 1.15 },
                {
                    y: '10%',
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5
                    }
                }
            );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [])

  // Lightbox keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight' && lightbox !== null) setLightbox((lightbox + 1) % images.length)
      if (e.key === 'ArrowLeft' && lightbox !== null) setLightbox((lightbox - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox])

  return (
    <section ref={sectionRef} id="galeria" className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative overflow-hidden">
      <div className="mb-24 text-center md:text-left relative z-10 max-w-3xl">
        <span ref={subtitleRef} className="text-[var(--color-waldorf-terracotta)] text-sm font-bold tracking-widest uppercase block mb-6">
          Nuestro Mundo
        </span>
        <h2 ref={titleRef} className="text-5xl md:text-7xl font-bold font-serif text-[var(--color-waldorf-moss)] leading-[1.1] tracking-tighter">
          La Vida en Trekan
        </h2>
      </div>

      {/* Masonry Asimétrico */}
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[280px] gap-6 md:gap-8 relative z-0">
        {images.map((img: any, i: number) => (
          <div
            key={i}
            className={`relative overflow-hidden group cursor-pointer ${img.span} rounded-xl will-change-transform`}
            onClick={() => setLightbox(i)}
          >
            <div className="w-full h-full relative overflow-hidden">
                <Image
                src={img.url || img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105 will-change-transform"
                />
            </div>

            {/* Capa de Hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-[#1a2e25]/50 transition-colors duration-700 flex items-end p-6 md:p-8 pointer-events-none">
              <span className="text-white text-lg font-medium opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-700 ease-[0.16,1,0.3,1]">
                {img.alt}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Minimalista */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-[#0A0A10]/95 flex items-center justify-center p-4 backdrop-blur-md transition-opacity"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-8 right-8 text-white/60 hover:text-white text-4xl z-10 transition-colors mix-blend-difference"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length) }}
            className="absolute left-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-6xl z-10 transition-colors mix-blend-difference hidden md:block"
          >
            ‹
          </button>
          
          <div className="relative max-w-[90vw] max-h-[85vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightbox].url || images[lightbox].src}
              alt={images[lightbox].alt}
              fill
              sizes="90vw"
              className="object-contain shadow-2xl animate-fade-in"
            />
          </div>
          
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length) }}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-6xl z-10 transition-colors mix-blend-difference hidden md:block"
          >
            ›
          </button>
          <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm font-mono tracking-widest mix-blend-difference">
            {lightbox + 1} / {images.length}
          </span>
        </div>
      )}
    </section>
  )
}
