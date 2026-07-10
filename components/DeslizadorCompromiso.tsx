'use client'

import { motion } from 'framer-motion'
import { Heart, HandHeart, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function DeslizadorCompromiso() {
  
  const handleWhatsApp = () => {
    const text = `Hola Ivonne, me interesa conocer más sobre los aranceles y el aporte solidario de Trekan.`;
    const whatsappUrl = `https://wa.me/56967765106?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  }

  return (
    <section id="aranceles" className="py-32 bg-[#FAF8F5] text-[#1a2e25] relative overflow-hidden">
      
      {/* Decorative large element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-waldorf-mustard)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-waldorf-sage)] bg-[var(--color-waldorf-sage)]/10 text-[var(--color-waldorf-moss)] mb-8">
              <HandHeart size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Aporte Comunitario</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-[var(--color-waldorf-moss)] mb-8 leading-[1.1]">
              Una comunidad que se <span className="italic font-light text-[var(--color-waldorf-terracotta)]">sostiene</span> a sí misma.
            </h2>
            
            <p className="text-lg md:text-xl text-[var(--color-waldorf-text-light)] leading-relaxed mb-10">
              En Colegio Waldorf Trekan, creemos que el acceso a la educación no debe ser una barrera insuperable. Nuestro modelo de aranceles incluye un componente solidario voluntario que permite becar a familias de nuestra propia comunidad, asegurando diversidad y apoyo mutuo.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <button 
                onClick={handleWhatsApp}
                className="px-8 py-5 rounded-full bg-[var(--color-waldorf-moss)] text-white font-bold text-sm hover:bg-[#12221b] transition-all duration-300 flex items-center justify-center gap-3 group shadow-xl"
              >
                Conocer Valores y Aportes
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center gap-3 text-sm font-medium text-[var(--color-waldorf-moss)]/70">
                <Heart size={20} className="text-[var(--color-waldorf-terracotta)]" />
                <span>Tu aporte hace florecer el bosque</span>
              </div>
            </div>
          </div>

          {/* Image & Aesthetic Elements */}
          <div className="order-1 lg:order-2 relative h-[500px] md:h-[700px] w-full rounded-[3rem] overflow-hidden">
            <motion.div
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Image 
                src="/assets/fb/fb_post_6.jpg" 
                alt="Comunidad Waldorf" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-waldorf-moss)]/80 via-transparent to-transparent mix-blend-multiply" />
            </motion.div>

            {/* Floating Info Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-white"
            >
              <h4 className="font-serif font-bold text-2xl mb-2 text-[var(--color-waldorf-mustard)]">¿Cómo funciona?</h4>
              <p className="text-sm text-white/90 leading-relaxed">
                Al momento de la matrícula, las familias pueden elegir voluntariamente sumar un Aporte Solidario a su mensualidad. Este fondo va directa y exclusivamente a financiar becas internas.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
