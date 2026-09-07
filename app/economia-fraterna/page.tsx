import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Economía Fraterna | Colegio Waldorf Trekan',
  description: 'Apoya el impulso educativo de nuestro organismo vivo mediante aportes directos al aula y al sostenimiento de nuestros maestros.',
};

export default function EconomiaFraternaPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E3E3E] font-sans selection:bg-[#7D8F69] selection:text-white">
      
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20 px-6 md:px-12 flex flex-col items-center text-center">
        <div className="max-w-3xl mx-auto z-10">
          <h1 className="text-4xl md:text-6xl font-serif text-[#2C3E2D] mb-6 tracking-tight">
            Economía Fraterna y Sostenimiento
          </h1>
          <div className="w-24 h-[2px] bg-[#D4C3A3] mx-auto mb-8"></div>
          <p className="text-lg md:text-xl leading-relaxed text-[#5A5A5A] mb-8 font-light">
            El Colegio Waldorf Trekan es un organismo vivo que respira y crece gracias al impulso genuino de las familias y amigos que creen en una educación libre. Nuestro colegio se sostiene mediante los principios de la <strong>Economía Fraterna</strong>: donde el capital no es un fin en sí mismo, sino una semilla que permite el florecimiento de la infancia.
          </p>
          <p className="text-lg md:text-xl leading-relaxed text-[#5A5A5A] font-light">
            Si resuenas con nuestro proyecto, puedes apadrinar nuestro impulso educativo con un aporte directo. Cada contribución se destina <strong>100% al aula, a los materiales nobles y al sostenimiento de nuestros maestros</strong>.
          </p>
        </div>
        
        {/* Decorative organic shape */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#E5E0D8] mix-blend-multiply blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-[#E8EDE1] mix-blend-multiply blur-3xl"></div>
        </div>
      </section>

      {/* Bank Details Section */}
      <section className="py-16 px-6 md:px-12 relative">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-[#F0EBE1] relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F9F7F1] rounded-bl-full -z-0"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              
              {/* Data Column */}
              <div>
                <h2 className="text-2xl font-serif text-[#2C3E2D] mb-6">Datos de Transferencia</h2>
                
                <ul className="space-y-4">
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-[#8A8A8A] font-medium mb-1">Nombre</span>
                    <span className="text-lg font-medium text-[#3E3E3E]">Colegio Waldorf Trekan</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-[#8A8A8A] font-medium mb-1">RUT</span>
                    <span className="text-lg font-medium text-[#3E3E3E]">17.926.217-7</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-[#8A8A8A] font-medium mb-1">Banco</span>
                    <span className="text-lg font-medium text-[#3E3E3E]">Banco Santander</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-[#8A8A8A] font-medium mb-1">Tipo de Cuenta</span>
                    <span className="text-lg font-medium text-[#3E3E3E]">Cuenta Corriente</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-[#8A8A8A] font-medium mb-1">Número de Cuenta</span>
                    <span className="text-lg font-medium text-[#3E3E3E]">00-120-38001-14</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-[#8A8A8A] font-medium mb-1">Correo (Para comprobante)</span>
                    <a href="mailto:administracion@colegiowaldorftrekan.cl" className="text-lg font-medium text-[#657A54] hover:text-[#4A5D3B] transition-colors">
                      administracion@colegiowaldorftrekan.cl
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Disclaimer Column */}
              <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-[#F0EBE1]">
                <h3 className="text-lg font-serif text-[#2C3E2D] mb-4 flex items-center gap-2">
                  <span>🌿</span> Transparencia del Aporte
                </h3>
                <p className="text-sm leading-relaxed text-[#5A5A5A] mb-4">
                  Al ser una iniciativa educativa independiente, autogestionada y libre de ataduras corporativas, los aportes que recibimos nacen exclusivamente desde el altruismo y el libre albedrío.
                </p>
                <p className="text-sm leading-relaxed text-[#5A5A5A]">
                  Por esta razón, las contribuciones se reciben como aportes directos a la comunidad escolar y <strong>no están sujetas a la emisión de certificados de exención tributaria (Ley de Donaciones) ni vouchers fiscales</strong>.
                </p>
                <div className="mt-6 pt-6 border-t border-[#E5E0D8]">
                  <p className="text-sm font-medium italic text-[#657A54] text-center">
                    "Tu aporte no es una transacción, es un regalo directo a la infancia."
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
