import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Clock, Calendar, Info, Mail } from 'lucide-react';
import Image from 'next/image';

export default function ArriendoSalonPage() {
  return (
    <main className="min-h-screen bg-[var(--color-waldorf-cream)] overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 bg-[#2d3a2e] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <Image src="/images/salon-principal.webp" fill className="object-cover" alt="Salón Trekan" priority />
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-bold tracking-widest uppercase mb-6 text-[#d4af37]">
            Espacio Comunitario
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 leading-tight">
            Arriendo de Salón Trekan
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-medium">
            Un espacio cálido y natural en Puerto Varas, diseñado para talleres, reuniones y actividades que promuevan el crecimiento personal y comunitario.
          </p>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Detalles del Espacio */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-3xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-6 border-b border-[var(--color-waldorf-sage)]/20 pb-4">
                Instalaciones
              </h2>
              <ul className="space-y-4">
                {[
                  '25m² de espacio (Capacidad: hasta 20 personas)',
                  'Mesas y sillas modulares adaptables',
                  'Baño de uso común',
                  'Cocina equipada',
                  'Estacionamiento para 10 vehículos',
                  'Limpieza básica incluida',
                  'Ambiente cálido y conexión natural',
                  'Catering externo permitido'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 bg-[var(--color-waldorf-sage)]/20 p-1 rounded-full text-[var(--color-waldorf-moss)]">
                      <Check size={14} />
                    </span>
                    <span className="text-[var(--color-waldorf-text)] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-[var(--color-waldorf-sage)]/10 earth-shadow">
               <h3 className="text-xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-4 flex items-center gap-2">
                 <Info className="text-[var(--color-waldorf-sage)]" /> 
                 ¿Para qué actividades?
               </h3>
               <p className="text-[var(--color-waldorf-text-light)] leading-relaxed">
                 Priorizamos actividades educativas, talleres de crecimiento personal, reuniones comunitarias y eventos que promuevan valores de respeto, conexión con la naturaleza y desarrollo humano integral.
               </p>
            </div>
          </div>

          {/* Tarifas y Horarios */}
          <div className="flex flex-col gap-8">
            <div className="bg-[#fcf8f2] rounded-3xl p-8 border-2 border-[var(--color-waldorf-sage)]/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-waldorf-sage)]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              
              <h2 className="text-2xl font-bold font-serif text-[var(--color-waldorf-moss)] mb-8 flex items-center gap-2">
                <Clock className="text-[#c6a382]" />
                Tarifas de Arriendo
              </h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-[var(--color-waldorf-sage)]/20 pb-4">
                  <div>
                    <h4 className="font-bold text-[var(--color-waldorf-text)]">Bloque Corto</h4>
                    <p className="text-sm text-[var(--color-waldorf-text-light)]">1 a 3 horas</p>
                  </div>
                  <span className="text-xl font-serif font-bold text-[var(--color-waldorf-moss)]">$10.000<span className="text-sm font-sans font-normal text-gray-400">/hr</span></span>
                </div>
                
                <div className="flex justify-between items-end border-b border-[var(--color-waldorf-sage)]/20 pb-4">
                  <div>
                    <h4 className="font-bold text-[var(--color-waldorf-text)]">Medio Día</h4>
                    <p className="text-sm text-[var(--color-waldorf-text-light)]">4 a 6 horas</p>
                  </div>
                  <span className="text-xl font-serif font-bold text-[var(--color-waldorf-moss)]">$9.000<span className="text-sm font-sans font-normal text-gray-400">/hr</span></span>
                </div>

                <div className="flex justify-between items-end border-b border-[var(--color-waldorf-sage)]/20 pb-4">
                  <div>
                    <h4 className="font-bold text-[var(--color-waldorf-text)]">Jornada Completa</h4>
                    <p className="text-sm text-[var(--color-waldorf-text-light)]">7 horas</p>
                  </div>
                  <span className="text-xl font-serif font-bold text-[var(--color-waldorf-moss)]">$50.000</span>
                </div>
                
                <div className="flex justify-between items-end pt-2">
                  <div>
                    <h4 className="font-bold text-[var(--color-waldorf-text)]">Kit Audiovisual</h4>
                    <p className="text-sm text-[var(--color-waldorf-text-light)]">Proyector y sonido</p>
                  </div>
                  <span className="text-xl font-serif font-bold text-[#c6a382]">+$20.000</span>
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-waldorf-moss)] text-white rounded-3xl p-8 relative overflow-hidden earth-shadow">
               <h3 className="text-xl font-bold font-serif mb-6 flex items-center gap-2">
                 <Calendar className="text-[var(--color-waldorf-sage)]" />
                 Disponibilidad & Reservas
               </h3>
               
               <ul className="space-y-3 mb-8 text-white/80 text-sm font-medium">
                 <li>• <strong className="text-white">Lunes a Viernes:</strong> Después de las 15:00 hrs.</li>
                 <li>• <strong className="text-white">Fines de Semana:</strong> Todo el día.</li>
                 <li>• <strong className="text-white">Vacaciones escolares:</strong> Horario flexible.</li>
               </ul>

               <div className="flex flex-col sm:flex-row gap-4">
                 <a href="https://mail.google.com/mail/?view=cm&fs=1&to=coordinacion@colegiowaldorftrekan.cl&su=Consulta%20por%20Arriendo%20de%20Sal%C3%B3n" target="_blank" rel="noreferrer" className="flex-1 bg-white text-[var(--color-waldorf-moss)] px-4 py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:bg-[var(--color-waldorf-paper)] transition-colors">
                   <Mail size={18} />
                   Email
                 </a>
                 <a href="https://wa.me/56967765106" target="_blank" rel="noreferrer" className="flex-1 bg-[#25D366] text-white px-4 py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors">
                   WhatsApp
                 </a>
               </div>
            </div>

          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
