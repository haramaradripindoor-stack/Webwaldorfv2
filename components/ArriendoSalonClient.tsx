'use client'

import React, { useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Clock, Calendar, Info, Mail, Star, Users, Coffee } from 'lucide-react';
import Image from 'next/image';
import CotizadorSalon from '@/components/CotizadorSalon';
import { motion, useScroll, useTransform } from 'framer-motion';
import SmoothScroll from '@/components/SmoothScroll';

export default function ArriendoSalonClient() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacityText = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const instalaciones = [
    { title: "Amplitud", text: "25m² de espacio (hasta 20 personas).", icon: <Users className="text-[var(--color-waldorf-sage)]" size={24} /> },
    { title: "Versatilidad", text: "Mesas y sillas modulares adaptables a cualquier formato.", icon: <Check className="text-[var(--color-waldorf-sage)]" size={24} /> },
    { title: "Comodidades", text: "Cocina equipada y baño de uso común.", icon: <Coffee className="text-[var(--color-waldorf-sage)]" size={24} /> },
    { title: "Luz Natural", text: "Ambiente cálido, rodeado de madera y naturaleza.", icon: <Star className="text-[var(--color-waldorf-sage)]" size={24} /> }
  ];

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[var(--color-waldorf-cream)]">
        <Navbar />
        
        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-40 pb-32 px-6 bg-[#1a2e25] text-white overflow-hidden min-h-[85vh] flex items-center justify-center">
          <motion.div style={{ y: yImage }} className="absolute inset-0 z-0 opacity-40">
             <Image src="https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/galeria3.webp" fill className="object-cover" alt="Salón Trekan" priority />
             <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e25] via-transparent to-transparent" />
          </motion.div>

          <motion.div style={{ opacity: opacityText }} className="max-w-4xl mx-auto relative z-10 text-center mt-20">
            <motion.span 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="inline-block px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-sm font-bold tracking-widest uppercase mb-8 text-[var(--color-waldorf-mustard)] border border-white/20"
            >
              Espacio Comunitario
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl md:text-8xl font-bold font-serif mb-8 leading-tight tracking-tight"
            >
              Arriendo de Salón
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Un refugio cálido y natural en Puerto Varas, diseñado para talleres, reuniones y actividades que nutran el alma comunitaria.
            </motion.p>
          </motion.div>
        </section>

        {/* Contenido Principal */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Bento Grid: Instalaciones */}
            <div className="mb-32">
              <div className="text-center mb-16">
                 <h2 className="text-4xl md:text-5xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-4">Instalaciones & Ambiente</h2>
                 <p className="text-[var(--color-waldorf-text-light)] text-xl">Todo lo necesario para que tu actividad fluya.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <motion.div whileHover={{ scale: 1.02 }} className="md:col-span-2 bg-white rounded-3xl p-10 border border-[var(--color-waldorf-sage)]/20 shadow-xl overflow-hidden relative">
                   <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[var(--color-waldorf-sage)]/10 rounded-full blur-2xl" />
                   <div className="relative z-10 flex flex-col justify-center h-full">
                     <h3 className="text-2xl font-serif font-bold text-[var(--color-waldorf-moss)] mb-6 flex items-center gap-3">
                       <Info className="text-[var(--color-waldorf-terracotta)]" size={28}/> Propósito del Espacio
                     </h3>
                     <p className="text-[var(--color-waldorf-text-light)] text-lg leading-relaxed mb-6">
                       Priorizamos actividades educativas, talleres de crecimiento personal, reuniones comunitarias y eventos que promuevan valores de respeto, conexión con la naturaleza y desarrollo humano integral.
                     </p>
                     <div className="flex gap-4 items-center">
                       <span className="bg-[var(--color-waldorf-sage)]/10 text-[var(--color-waldorf-moss)] px-4 py-2 rounded-full text-sm font-bold">Catering externo permitido</span>
                       <span className="bg-[var(--color-waldorf-sage)]/10 text-[var(--color-waldorf-moss)] px-4 py-2 rounded-full text-sm font-bold">Limpieza básica incluida</span>
                     </div>
                   </div>
                </motion.div>

                <div className="flex flex-col gap-6">
                  {instalaciones.slice(0,2).map((item, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="bg-white rounded-3xl p-8 border border-[var(--color-waldorf-sage)]/20 shadow-sm flex-1 flex flex-col justify-center">
                      <div className="mb-4">{item.icon}</div>
                      <h4 className="font-bold text-[var(--color-waldorf-moss)] text-lg mb-2">{item.title}</h4>
                      <p className="text-[var(--color-waldorf-text-light)] text-sm leading-relaxed">{item.text}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col gap-6">
                  {instalaciones.slice(2,4).map((item, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }} className="bg-white rounded-3xl p-8 border border-[var(--color-waldorf-sage)]/20 shadow-sm flex-1 flex flex-col justify-center">
                      <div className="mb-4">{item.icon}</div>
                      <h4 className="font-bold text-[var(--color-waldorf-moss)] text-lg mb-2">{item.title}</h4>
                      <p className="text-[var(--color-waldorf-text-light)] text-sm leading-relaxed">{item.text}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} className="md:col-span-2 bg-[#1a2e25] text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-waldorf-sage)]/20 rounded-full blur-2xl" />
                   <div className="relative z-10 max-w-sm">
                     <h3 className="text-2xl font-bold font-serif mb-4 flex items-center gap-3">
                       <Calendar className="text-[var(--color-waldorf-mustard)]" size={28}/> Disponibilidad
                     </h3>
                     <ul className="space-y-3 text-white/70 text-base">
                       <li>• <strong className="text-white">Lunes a Viernes:</strong> Post 15:00 hrs.</li>
                       <li>• <strong className="text-white">Fin de Semana:</strong> Todo el día.</li>
                       <li>• <strong className="text-white">Vacaciones:</strong> Horario flexible.</li>
                     </ul>
                   </div>
                   <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                     <a href="https://wa.me/56967765106" target="_blank" rel="noreferrer" className="flex-1 bg-[var(--color-waldorf-mustard)] text-[#1a2e25] px-6 py-4 rounded-full font-bold text-center flex items-center justify-center gap-2 hover:bg-[#c4972e] transition-colors shadow-lg">
                       Consultar Fechas
                     </a>
                   </div>
                </motion.div>

              </div>
            </div>

            {/* Tarifas Bento */}
            <div className="mb-32">
              <div className="text-center mb-16">
                 <h2 className="text-4xl md:text-5xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-4">Tarifas Transparentes</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div whileHover={{ y: -10 }} className="bg-[#FAF8F5] rounded-3xl p-10 text-center shadow-sm">
                  <h4 className="font-bold text-[var(--color-waldorf-text-light)] text-sm tracking-widest uppercase mb-4">Bloque Corto</h4>
                  <p className="text-5xl font-serif font-bold text-[var(--color-waldorf-moss)] mb-2">$10.000</p>
                  <p className="text-[var(--color-waldorf-text-light)] mb-8">por hora</p>
                  <p className="text-sm font-bold text-[var(--color-waldorf-moss)]">1 a 3 horas</p>
                </motion.div>
                
                <motion.div whileHover={{ y: -10 }} className="bg-white border-2 border-[var(--color-waldorf-sage)] rounded-3xl p-10 text-center shadow-xl relative scale-105 z-10">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-waldorf-moss)] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                    Más Solicitado
                  </div>
                  <h4 className="font-bold text-[var(--color-waldorf-text-light)] text-sm tracking-widest uppercase mb-4">Medio Día</h4>
                  <p className="text-6xl font-serif font-bold text-[var(--color-waldorf-moss)] mb-2">$9.000</p>
                  <p className="text-[var(--color-waldorf-text-light)] mb-8">por hora</p>
                  <p className="text-sm font-bold text-[var(--color-waldorf-moss)]">4 a 6 horas</p>
                </motion.div>

                <motion.div whileHover={{ y: -10 }} className="bg-[#FAF8F5] rounded-3xl p-10 text-center shadow-sm">
                  <h4 className="font-bold text-[var(--color-waldorf-text-light)] text-sm tracking-widest uppercase mb-4">Jornada Completa</h4>
                  <p className="text-5xl font-serif font-bold text-[var(--color-waldorf-moss)] mb-2">$50.000</p>
                  <p className="text-[var(--color-waldorf-text-light)] mb-8">fijo por día</p>
                  <p className="text-sm font-bold text-[var(--color-waldorf-moss)]">7 horas completas</p>
                </motion.div>
              </div>
            </div>

          </div>
        </section>

        {/* Cotizador Interactivo */}
        <section className="py-32 px-6 bg-[var(--color-waldorf-paper)] relative">
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-16">
                 <h2 className="text-4xl md:text-5xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-4">Reserva tu Espacio</h2>
                 <p className="text-[var(--color-waldorf-text-light)] text-xl">Cotiza en tiempo real y agenda directamente con nuestro equipo.</p>
              </div>
            <CotizadorSalon />
          </div>
        </section>
        
        <Footer />
      </main>
    </SmoothScroll>
  );
}
