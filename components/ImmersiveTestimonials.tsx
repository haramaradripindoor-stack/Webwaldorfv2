'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ImmersiveTestimonials() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Mueve los testimonios horizontalmente a medida que el usuario hace scroll vertical
  const xLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
  const xRight = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"])

  const testimonialsRow1 = [
    { text: "Nuestra hija recuperó el asombro por aprender.", author: "Familia González", media: "/assets/testimonial.mp4", type: "video" },
    { text: "La conexión con la naturaleza es invaluable.", author: "Familia Silva", media: "/assets/fb/fb_post_2.jpg", type: "image" },
    { text: "Una comunidad que abraza y sostiene.", author: "Apoderada de Básica", media: "/assets/fb/fb_post_4.jpg", type: "image" },
    { text: "El arte es el corazón del currículo.", author: "Apoderado de Media", media: "/assets/ig/post_5.jpg", type: "image" }
  ]

  const testimonialsRow2 = [
    { text: "Verlos amasar el pan cada semana es mágico.", author: "Mamá de Jardín", media: "/assets/fb/fb_post_6.jpg", type: "image" },
    { text: "Aprenden matemáticas tejiendo y cantando.", author: "Familia Rojas", media: "/assets/fb/fb_post_1.jpg", type: "image" },
    { text: "No hay notas, hay un profundo respeto por sus ritmos.", author: "Apoderado Nuevo", media: "/assets/fb/fb_post_3.jpg", type: "image" },
    { text: "El vínculo con su Maestro Guía es para toda la vida.", author: "Familia de 5° Básico", media: "/assets/ig/post_4.jpg", type: "image" }
  ]

  return (
    <section ref={containerRef} className="py-32 bg-[#1a2e25] text-[var(--color-waldorf-cream)] overflow-hidden relative">

      
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-[var(--color-waldorf-mustard)]">
          Voces de la <br/>Comunidad
        </h2>
      </div>

      <div className="flex flex-col gap-8 relative z-10">
        {/* Row 1 moving left */}
        <motion.div style={{ x: xLeft }} className="flex items-center gap-8 whitespace-nowrap px-6 h-[400px]">
          {[...testimonialsRow1, ...testimonialsRow1].map((t, i) => {
            const widthClass = i % 3 === 0 ? 'md:w-[700px]' : i % 3 === 1 ? 'md:w-[450px]' : 'md:w-[550px]';
            const heightClass = i % 2 === 0 ? 'h-[340px]' : 'h-[280px]';
            const marginClass = i % 2 === 0 ? 'mt-8' : '-mt-8';
            const borderRadiuses = ['2rem 3.5rem 1.5rem 2.5rem', '3.5rem 2rem 2.5rem 1.5rem', '1.5rem 2.5rem 2rem 3.5rem', '2.5rem 1.5rem 3.5rem 2rem'];
            
            return (
            <div key={i} style={{ borderRadius: borderRadiuses[i % 4] }} className={`flex-shrink-0 w-[85vw] sm:w-[400px] ${widthClass} ${heightClass} ${marginClass} relative overflow-hidden group shadow-xl`}>
              {t.type === 'video' ? (
                <video 
                  src={t.media}
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
                />
              ) : (
                <img 
                  src={t.media}
                  alt={t.author}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
                />
              )}
              <div className="absolute inset-0 bg-[var(--color-waldorf-moss)]/20 mix-blend-multiply pointer-events-none transition-colors duration-700 group-hover:bg-[var(--color-waldorf-moss)]/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e25]/90 via-[#1a2e25]/30 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full whitespace-normal relative z-10 transition-transform duration-700 md:group-hover:translate-x-4">
                <p className="text-2xl md:text-3xl font-serif font-bold mb-4 leading-tight drop-shadow-md">"{t.text}"</p>
                <p className="text-base font-serif italic opacity-90 drop-shadow-sm">— {t.author}</p>
              </div>
            </div>
            )
          })}
        </motion.div>

        {/* Row 2 moving right */}
        <motion.div style={{ x: xRight }} className="flex items-center gap-8 whitespace-nowrap px-6 h-[400px]">
          {[...testimonialsRow2, ...testimonialsRow2].map((t, i) => {
            const widthClass = i % 3 === 0 ? 'md:w-[450px]' : i % 3 === 1 ? 'md:w-[650px]' : 'md:w-[500px]';
            const heightClass = i % 2 === 0 ? 'h-[280px]' : 'h-[340px]';
            const marginClass = i % 2 === 0 ? '-mt-8' : 'mt-8';
            const borderRadiuses = ['3.5rem 2rem 2.5rem 1.5rem', '2.5rem 1.5rem 3.5rem 2rem', '2rem 3.5rem 1.5rem 2.5rem', '1.5rem 2.5rem 2rem 3.5rem'];
            
            return (
            <div key={i} style={{ borderRadius: borderRadiuses[i % 4] }} className={`flex-shrink-0 w-[85vw] sm:w-[400px] ${widthClass} ${heightClass} ${marginClass} relative overflow-hidden group shadow-xl`}>
              {t.type === 'video' ? (
                <video 
                  src={t.media}
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
                />
              ) : (
                <img 
                  src={t.media}
                  alt={t.author}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
                />
              )}
              <div className="absolute inset-0 bg-[var(--color-waldorf-moss)]/20 mix-blend-multiply pointer-events-none transition-colors duration-700 group-hover:bg-[var(--color-waldorf-moss)]/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e25]/90 via-[#1a2e25]/30 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full whitespace-normal relative z-10 transition-transform duration-700 md:group-hover:translate-x-4">
                <p className="text-2xl md:text-3xl font-serif font-bold mb-4 leading-tight drop-shadow-md">"{t.text}"</p>
                <p className="text-base font-serif italic opacity-90 drop-shadow-sm">— {t.author}</p>
              </div>
            </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
