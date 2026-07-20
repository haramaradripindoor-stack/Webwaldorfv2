import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import CustomCursor from '@/components/CustomCursor'
import AIChatWidget from '@/components/AIChatWidget'
import SmoothScroll from '@/components/SmoothScroll'
import LiquidSplash from '@/components/LiquidSplash'

const quicksand = { variable: 'font-sans' }
const merriweather = { variable: 'font-serif' }

export const metadata: Metadata = {
  title: 'Colegio Waldorf Trekan | Pedagogía Waldorf en Puerto Varas, Chile',
  description: 'Colegio Waldorf Trekan en Puerto Varas. Educación con metodología Waldorf para niños de 3 a 14 años. Conoce nuestro proyecto de educación hacia la libertad. Admisión 2026 abierta.',
  keywords: ['colegio waldorf', 'pedagogia waldorf', 'educacion waldorf', 'metodo waldorf', 'colegios waldorf chile', 'colegio waldorf puerto varas', 'metodología waldorf', 'colegios con metodología waldorf'],
  alternates: {
    canonical: 'https://www.colegiowaldorftrekan.cl',
  },
  openGraph: {
    title: 'Colegio Waldorf Trekan | Pedagogía Waldorf en Puerto Varas',
    description: 'Educación con el corazón en armonía con la naturaleza. Colegio con metodología Waldorf para niños de 3 a 14 años.',
    url: 'https://www.colegiowaldorftrekan.cl',
    siteName: 'Colegio Waldorf Trekan',
    locale: 'es_CL',
    images: [
      {
        url: 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/paseocerro20261.jpg',
        width: 1200,
        height: 630,
        alt: 'Niños explorando la naturaleza - Colegio Waldorf Trekan',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Colegio Waldorf Trekan | Pedagogía Waldorf en Puerto Varas',
    description: 'Educación con el corazón en armonía con la naturaleza. Colegio con metodología Waldorf para niños de 3 a 14 años.',
    images: ['https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/paseocerro20261.jpg'],
  },
  icons: {
    icon: '/assets/logo-mini.webp',
    shortcut: '/assets/logo-mini.webp',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "School", "LocalBusiness"],
        "@id": "https://www.colegiowaldorftrekan.cl/#organization",
        "name": "Colegio Waldorf Trekan",
        "alternateName": "Trekan Puerto Varas",
        "url": "https://www.colegiowaldorftrekan.cl",
        "logo": "https://www.colegiowaldorftrekan.cl/assets/logo.png",
        "image": "https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/paseocerro20261.jpg",
        "description": "Colegio Waldorf en Puerto Varas para niños de 3 a 14 años. Educación hacia la libertad sustentada en la Antroposofía y la Trimembración Social.",
        "telephone": "+56 9 6776 5106",
        "email": "admision@colegiowaldorftrekan.cl",
        "sameAs": [
          "https://www.instagram.com/waldorftrekanpv/",
          "https://www.facebook.com/profile.php?id=61573063135723"
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Las Azaleas 96, Parque Ivian 1",
          "addressLocality": "Puerto Varas",
          "addressRegion": "Región de Los Lagos",
          "postalCode": "5550000",
          "addressCountry": "CL"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "-41.319460",
          "longitude": "-72.985380"
        },
        "areaServed": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": "-41.319460",
            "longitude": "-72.985380"
          },
          "geoRadius": "50000"
        },
        "founder": {
          "@id": "https://www.colegiowaldorftrekan.cl/#ivonneparada"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Programas Educativos Waldorf",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "EducationalOccupationalProgram",
                "name": "Jardín Infantil Waldorf",
                "description": "Programa preescolar enfocado en el juego libre, el ritmo y la conexión con la naturaleza."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "EducationalOccupationalProgram",
                "name": "Educación Básica Waldorf",
                "description": "Educación primaria basada en currículum Waldorf, arte, música y desarrollo anímico."
              }
            }
          ]
        }
      },
      {
        "@type": "Person",
        "@id": "https://www.colegiowaldorftrekan.cl/#ivonneparada",
        "name": "Ivonne Parada Aravena",
        "jobTitle": "Familia Fundadora y Especialista en Convivencia Escolar",
        "worksFor": {
          "@id": "https://www.colegiowaldorftrekan.cl/#organization"
        },
        "description": "Trabajadora Social UV, especialista en convivencia escolar con formación en peritaje social, polivagal y gestalt."
      }
    ]
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
      </head>
      <body className="font-sans antialiased bg-[var(--color-waldorf-cream)] text-[var(--color-waldorf-text)]">
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
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* Meta Pixel (noscript) */}
        <noscript>
          <img height="1" width="1" style={{display: 'none'}}
               src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        
        <LiquidSplash />
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
        
        {/* Widget Flotante Global */}
        <AIChatWidget />
      </body>
    </html>
  )
}
