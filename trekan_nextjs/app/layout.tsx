import './globals.css'
import type { Metadata } from 'next'
import { Quicksand, Merriweather } from 'next/font/google'
import Script from 'next/script'
import CustomCursor from '@/components/CustomCursor'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import AIChatWidget from '@/components/AIChatWidget'

const quicksand = Quicksand({ 
  subsets: ['latin'],
  variable: '--font-quicksand',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-merriweather',
  weight: ['300', '400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Colegio Waldorf Trekan | Educación y Armonía - Puerto Varas',
  description: 'Espacio educativo en armonía con la naturaleza en Puerto Varas. Pedagogía Waldorf para niños de 3 a 14 años. Admisión 2026 abierta.',
  alternates: {
    canonical: 'https://www.colegiowaldorftrekan.cl',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Colegio Waldorf Trekan",
    "url": "https://www.colegiowaldorftrekan.cl",
    "logo": "https://www.colegiowaldorftrekan.cl/assets/logo.png",
    "description": "Colegio Waldorf en Puerto Varas para niños de 3 a 14 años. Educación con el corazón, en armonía con la naturaleza.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Las Azaleas 96, Parque Ivian 1",
      "addressLocality": "Puerto Varas",
      "addressRegion": "Región de Los Lagos",
      "postalCode": "5550000",
      "addressCountry": "CL"
    },
    "telephone": "+56 9 6776 5106",
    "email": "admision@colegiowaldorftrekan.cl",
    "sameAs": [
      "https://www.instagram.com/waldorftrekanpv/",
      "https://www.facebook.com/profile.php?id=61573063135723"
    ],
    "openingHours": "Mo,Tu,We,Th,Fr 08:00-14:00",
    "educationalProgram": "Pedagogía Waldorf para niños de 3 a 14 años"
  }

  // ID de Google Tag Manager extraído de las capturas
  const GTM_ID = 'GTM-NWT7GVSD'

  return (
    <html lang="es" className={`${quicksand.variable} ${merriweather.variable}`}>
      <head>
        {/* Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Tag Manager - DataLayer Init */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased bg-[var(--color-waldorf-cream)] text-[var(--color-waldorf-text)]">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        <CustomCursor />
        {/* Awwwards Film Grain */}
        <div className="awwwards-noise" />
        
        {/* Google Translate Hidden Element & Scripts */}
        <div id="google_translate_element" style={{ display: 'none' }} />
        <Script 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
          strategy="afterInteractive" 
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new window.google.translate.TranslateElement(
                { pageLanguage: 'es', includedLanguages: 'es,en,de', autoDisplay: false }, 
                'google_translate_element'
              );
            }
          `}
        </Script>

        {children}
        
        {/* Widgets Flotantes Globales */}
        <AIChatWidget />
      </body>
    </html>
  )
}
