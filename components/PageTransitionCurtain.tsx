'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PageTransitionCurtain — Transición Cinemática Orgánica entre Rutas
 * 
 * Implementa la directriz Awwwards: "Craft lives between states".
 * Elimina los cortes duros (hard-cuts) entre páginas con una cortina fluida
 * inspirada en la física de "ease-out" de Franco Beltramella (cubic-bezier(0.16, 1, 0.3, 1)).
 */
export default function PageTransitionCurtain() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathRef = useRef(pathname);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // Si la ruta no cambió o es admin/login, no animar
    if (pathname === prevPathRef.current) return;
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
      prevPathRef.current = pathname;
      return;
    }

    prevPathRef.current = pathname;

    if (reducedMotion) return;

    // Disparar cortina de transición
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [pathname, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <AnimatePresence>
      {isTransitioning && (
        <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden" aria-hidden="true">
          {/* Capa 1: Lino Suave */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1], // Franchu.web Entrance Ease
            }}
            className="absolute inset-0 bg-[#FAF8F5] shadow-2xl flex items-center justify-center"
          >
            {/* Monograma Editorial Trekan en relieve sutil */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="w-14 h-14 rounded-full border border-[#EBBA7A]/40 bg-[#1A2E25] flex items-center justify-center text-[#EBBA7A] font-serif font-bold text-2xl shadow-xl">
                T
              </div>
              <span className="font-serif italic text-xs tracking-widest text-[#1A2E25]/70 uppercase">
                Colegio Waldorf Trekan
              </span>
            </motion.div>
          </motion.div>

          {/* Capa 2: Musgo Patagónico (Cresta de la Ola) */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute bottom-0 left-0 right-0 h-2 bg-[#1A2E25] origin-bottom"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
