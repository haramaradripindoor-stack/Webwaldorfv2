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

    // Respetar prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const words = textRef.current.children;

    const ctx = gsap.context(() => {
      // Estado inicial suave
      gsap.set(words, { opacity: 0.25, y: 20, rotationX: -10 });

      // Animación vinculada al scroll con physics suave
      gsap.to(words, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "center 45%",
          scrub: 0.8,
        },
        opacity: 1,
        y: 0,
        rotationX: 0,
        stagger: 0.04,
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
      <h2 className="sr-only">{text}</h2>
      <p 
        ref={textRef}
        aria-hidden="true"
        className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-[var(--color-waldorf-moss)] leading-[1.2] tracking-normal text-center flex flex-wrap justify-center gap-x-4 gap-y-2 select-none"
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
