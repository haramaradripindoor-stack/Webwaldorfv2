import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TextReveal from '@/components/TextReveal'
import PedagogiaHorizontal from '@/components/PedagogiaHorizontal'
import ActividadesSection from '@/components/ActividadesSection'
import NewsSection from '@/components/NewsSection'
import BentoGrid from '@/components/BentoGrid'
import MasonryGallery from '@/components/MasonryGallery'
import TeamSection from '@/components/TeamSection'
import ComunidadSection from '@/components/ComunidadSection'
import ImmersiveTestimonials from '@/components/ImmersiveTestimonials'
import FAQSection from '@/components/FAQSection'
import MicroSegmentador from '@/components/MicroSegmentador'
import DeslizadorCompromiso from '@/components/DeslizadorCompromiso'
import ContactSection from '@/components/ContactSection'
import MapSection from '@/components/MapSection'
import InstagramSection from '@/components/InstagramSection'
import RadicalTransparency from '@/components/RadicalTransparency'
import Footer from '@/components/Footer'
import { getMarkdownPosts } from '@/lib/markdown'
import { createClient } from '@/utils/supabase/server'
import SmoothScroll from '@/components/SmoothScroll'

export const revalidate = 0; // Para que actualice siempre que haya cambios en BD

export default async function Home() {
  const supabase = createClient();
  
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

  // Fallback defaults si falla la DB o no existe la fila
  const heroData = homeContent?.hero_section || { title: 'La Vida en Trekan', subtitle: 'Educación con sentido', media_url: '/assets/testimonial.mp4', media_type: 'video' };
  const textRevealData = homeContent?.text_reveal || "Educar no es llenar un cubo, es encender un fuego. En Trekan, respetamos el ritmo natural de cada niño, cultivando la cabeza, el corazón y las manos en perfecta armonía.";
  const masonryData = homeContent?.masonry_gallery || null;

  // Intentar obtener noticias de Supabase
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
      // Fallback a Markdown si falla o está vacío
      const allNews = getMarkdownPosts('_noticias')
      displayNews = allNews.slice(0, 5)
    }
  } catch (e) {
    const allNews = getMarkdownPosts('_noticias')
    displayNews = allNews.slice(0, 5)
  }

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[var(--color-waldorf-cream)] overflow-x-clip">
        <Navbar />
        
        {/* 1. EL DESPERTAR (Inspiración y Manifiesto) */}
        <Hero data={heroData} />
        <TextReveal text={textRevealData} />
        
        {/* 2. LA EXPERIENCIA VISUAL (Mostrar el ambiente antes de la teoría) */}
        <MasonryGallery data={masonryData} />
        
        {/* 3. EL CAMINO EDUCATIVO (Qué hacemos y nuestros pilares) */}
        <PedagogiaHorizontal />
        <BentoGrid />
        
        {/* 4. EL ELEMENTO HUMANO Y EL RITMO (Maestros, Vida Comunitaria y Calendario) */}
        <TeamSection />
        <ComunidadSection />
        <ActividadesSection />
        
        {/* 5. VALIDACIÓN Y FILTRO (Prueba social y autoevaluación para prospectos) */}
        <ImmersiveTestimonials />
        <MicroSegmentador />
        <DeslizadorCompromiso />
        
        {/* 6. EL PULSO ACTUAL (Noticias y Redes Sociales) */}
        <NewsSection displayNews={displayNews} />
        <InstagramSection />
        
        {/* 7. RESOLUCIÓN DE DUDAS Y CONVERSIÓN (El paso final hacia la admisión) */}
        <FAQSection />
        <ContactSection />
        <MapSection />
        <RadicalTransparency />
        
        <Footer />
      </main>
    </SmoothScroll>
  )
}
