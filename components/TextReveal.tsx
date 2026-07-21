'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TextRevealProps {
  text: string
}

export default function TextReveal({ text }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const words = textRef.current.children;

    const ctx = gsap.context(() => {
      // Configuramos el estado inicial transparente y un poco hacia abajo
      gsap.set(words, { opacity: 0.1, y: 30, rotationX: -20 });

      // Creamos la animación atada al Scroll
      gsap.to(words, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%", // Empieza cuando el top del contenedor llega al 80% del viewport
          end: "center 40%", // Termina cuando el centro llega al 40%
          scrub: 1, // Suavizado de 1 segundo (Organic Inertia)
        },
        opacity: 1,
        y: 0,
        rotationX: 0,
        stagger: 0.05,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [text])

  const words = text.split(' ')

  return (
    <section
      ref={containerRef}
      className="py-32 px-6 md:px-16 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh] relative z-10"
      style={{ perspective: "1000px" }}
    >
      <p 
        ref={textRef}
        className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-[var(--color-waldorf-moss)] leading-[1.2] tracking-normal text-center flex flex-wrap justify-center gap-x-4 gap-y-2"
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block transform-gpu will-change-transform">
            {word}
          </span>
        ))}
      </p>
    </section>
  )
}
