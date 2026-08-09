import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TextReveal from '@/components/TextReveal';
import PedagogiaHorizontal from '@/components/PedagogiaHorizontal';
import ActividadesSection from '@/components/ActividadesSection';
import NewsSection from '@/components/NewsSection';
import BentoGrid from '@/components/BentoGrid';
import MasonryGallery from '@/components/MasonryGallery';
import TeamSection from '@/components/TeamSection';
import ComunidadSection from '@/components/ComunidadSection';
import ImmersiveTestimonials from '@/components/ImmersiveTestimonials';
import FAQSection from '@/components/FAQSection';
import MicroSegmentador from '@/components/MicroSegmentador';
import DeslizadorCompromiso from '@/components/DeslizadorCompromiso';
import ContactSection from '@/components/ContactSection';
import MapSection from '@/components/MapSection';
import InstagramSection from '@/components/InstagramSection';
import RadicalTransparency from '@/components/RadicalTransparency';
import Footer from '@/components/Footer';
import { getMarkdownPosts } from '@/lib/markdown';
import { createClient } from '@/utils/supabase/server';
import SmoothScroll from '@/components/SmoothScroll';

// Generar rutas estáticas para estas ciudades clave
export function generateStaticParams() {
  return [
    { ciudad: 'puerto-varas' },
    { ciudad: 'puerto-montt' },
    { ciudad: 'frutillar' },
    { ciudad: 'osorno' },
    { ciudad: 'llanquihue' },
    { ciudad: 'santiago' }, // Para atrapar a las familias que quieren migrar al sur
    { ciudad: 'valdivia' },
    { ciudad: 'chiloe' }
  ];
}

// Meta-Tags dinámicos hiper-optimizados por ciudad
export async function generateMetadata({ params }: { params: { ciudad: string } }): Promise<Metadata> {
  const ciudadLimpia = params.ciudad.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const title = `Colegio Waldorf ${ciudadLimpia} | Educación hacia la libertad en Trekan`;
  const description = `¿Buscas un Colegio Waldorf cerca de ${ciudadLimpia}? Conoce Trekan, una comunidad educativa en el sur de Chile basada en la Pedagogía Waldorf.`;
  
  return {
    title,
    description,
    keywords: `colegio waldorf ${ciudadLimpia}, educacion waldorf ${ciudadLimpia}, escuela waldorf ${ciudadLimpia}, pedagogia waldorf, sur de chile`,
    openGraph: {
      title,
      description,
      url: `https://www.colegiowaldorftrekan.cl/colegio-waldorf-${params.ciudad}`,
      siteName: 'Colegio Waldorf Trekan',
      images: [
        {
          url: '/assets/logo.png',
          width: 800,
          height: 600,
        },
      ],
      locale: 'es_CL',
      type: 'website',
    },
  };
}

export const revalidate = 3600; // Cache de 1 hora — contenido estático SEO


export default async function RegionalPage({ params }: { params: { ciudad: string } }) {
  const supabase = createClient();
  const ciudadLimpia = params.ciudad.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  // Fetch Homepage Content CMS
  let homeContent = null;
  try {
    const { data, error } = await supabase.from('homepage_content').select('*').eq('id', 1).maybeSingle();
    if (data && !error) {
      homeContent = data;
    }
  } catch (e) {
    console.error('Error fetching home content:', e);
  }

  // Modificamos el Hero para que inyecte la ciudad y aumente la relevancia local
  const baseHeroData = homeContent?.hero_section || { title: 'La Vida en Trekan', subtitle: 'Educación con sentido', media_url: '/assets/testimonial.mp4', media_type: 'video' };
  const regionalHeroData = {
    ...baseHeroData,
    title: `Comunidad Waldorf cerca de ${ciudadLimpia}`,
    subtitle: `A minutos de tu hogar. ${baseHeroData.subtitle}`
  };

  const textRevealData = homeContent?.text_reveal || `Educar no es llenar un cubo, es encender un fuego. Si vienes de ${ciudadLimpia}, en Trekan respetamos el ritmo natural de cada niño, cultivando la cabeza, el corazón y las manos en perfecta armonía en el sur de Chile.`;
  const masonryData = homeContent?.masonry_gallery || null;

  // Noticias
  let displayNews = [];
  try {
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(5);
      
    if (data && !error && data.length > 0) {
      displayNews = data;
    } else {
      const allNews = getMarkdownPosts('_noticias');
      displayNews = allNews.slice(0, 5);
    }
  } catch (e) {
    const allNews = getMarkdownPosts('_noticias');
    displayNews = allNews.slice(0, 5);
  }

  // Coordenadas geográficas para anclar el LocalBusiness al mapa zonal
  const geoMap: Record<string, { lat: number, lon: number }> = {
    'puerto-varas': { lat: -41.3195, lon: -72.9854 },
    'puerto-montt': { lat: -41.4693, lon: -72.9424 },
    'frutillar': { lat: -41.1274, lon: -73.0287 },
    'osorno': { lat: -40.5739, lon: -73.1336 },
    'llanquihue': { lat: -41.2581, lon: -73.0084 },
    'santiago': { lat: -33.4489, lon: -70.6693 },
    'valdivia': { lat: -39.8142, lon: -73.2459 },
    'chiloe': { lat: -42.4823, lon: -73.7644 }
  };

  const cityGeo = geoMap[params.ciudad.toLowerCase()] || geoMap['puerto-varas'];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "name": `Colegio Waldorf Trekan - Sede para familias de ${ciudadLimpia}`,
    "image": "https://www.colegiowaldorftrekan.cl/assets/logo.png",
    "description": `Comunidad educativa Waldorf recibiendo familias de ${ciudadLimpia} y el sur de Chile.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": ciudadLimpia,
      "addressRegion": "Los Lagos",
      "addressCountry": "CL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": cityGeo.lat,
      "longitude": cityGeo.lon
    },
    "url": `https://www.colegiowaldorftrekan.cl/colegio-waldorf-${params.ciudad}`,
    "telephone": "+56912345678", // Reemplazar por teléfono real si está disponible
    "sameAs": [
      "https://www.instagram.com/colegiowaldorftrekan"
    ]
  };

  return (
    <SmoothScroll>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[var(--color-waldorf-cream)] overflow-x-clip">
        <Navbar />
        {/* Usamos un Hero ligeramente modificado para el SEO Local */}
        <Hero data={regionalHeroData} />
        
        {/* Banner SEO Estático de Confianza */}
        <div className="bg-[var(--color-waldorf-moss)] text-white text-center py-3 px-4 shadow-inner">
          <p className="text-sm md:text-base font-serif tracking-wide">
            Recibiendo a familias de <strong className="font-bold text-[var(--color-waldorf-earth)]">{ciudadLimpia}</strong> y todo el sur de Chile para la admisión 2026.
          </p>
        </div>

        <TextReveal text={textRevealData} />
        <PedagogiaHorizontal />
        <BentoGrid />
        <ComunidadSection />
        <ActividadesSection />
        <ImmersiveTestimonials />
        <NewsSection displayNews={displayNews} />
        <MasonryGallery data={masonryData} />
        <TeamSection />
        <DeslizadorCompromiso />
        <MicroSegmentador />
        <FAQSection />
        <ContactSection />
        <MapSection />
        <InstagramSection />
        <RadicalTransparency />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
