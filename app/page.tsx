import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TextReveal from '@/components/TextReveal'
import MasonryGallery from '@/components/MasonryGallery'
import dynamic from 'next/dynamic'

// Lazy loaded client components (Code Splitting)
const PedagogiaHorizontal = dynamic(() => import('@/components/PedagogiaHorizontal'))
const ActividadesSection = dynamic(() => import('@/components/ActividadesSection'))
const NewsSection = dynamic(() => import('@/components/NewsSection'))
const BentoGrid = dynamic(() => import('@/components/BentoGrid'))
const TeamSection = dynamic(() => import('@/components/TeamSection'))
const TrimembracionSocial = dynamic(() => import('@/components/TrimembracionSocial'))
const ComunidadSection = dynamic(() => import('@/components/ComunidadSection'))
const ImmersiveTestimonials = dynamic(() => import('@/components/ImmersiveTestimonials'), { ssr: false })
const FAQSection = dynamic(() => import('@/components/FAQSection'))
const MicroSegmentador = dynamic(() => import('@/components/MicroSegmentador'), { ssr: false })
const DeslizadorCompromiso = dynamic(() => import('@/components/DeslizadorCompromiso'), { ssr: false })
const ContactSection = dynamic(() => import('@/components/ContactSection'))
const MapSection = dynamic(() => import('@/components/MapSection'), { ssr: false })
const InstagramSection = dynamic(() => import('@/components/InstagramSection'), { ssr: false })
const RadicalTransparency = dynamic(() => import('@/components/RadicalTransparency'))
import Footer from '@/components/Footer'
import { getMarkdownPosts } from '@/lib/markdown'
import { createClient } from '@/utils/supabase/server'
import SmoothScroll from '@/components/SmoothScroll'

export const revalidate = 3600; // Cache de 1 hora para Vercel Edge

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

  // Obtener noticias de Supabase y Markdown, y combinarlas
  let displayNews: any[] = [];
  try {
    // 1. Obtener de Supabase
    let supabaseNews: any[] = [];
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(10);
      
    if (data && !error) {
      supabaseNews = data;
    }

    // 2. Obtener de Markdown
    const markdownNews = getMarkdownPosts('_noticias');

    // 3. Combinar y ordenar por fecha
    const allCombinedNews = [...supabaseNews, ...markdownNews].sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime() || 0;
      const dateB = new Date(b.published_at || b.created_at).getTime() || 0;
      return dateB - dateA;
    });

    // 4. Tomar las 5 más recientes
    displayNews = allCombinedNews.slice(0, 5);
  } catch (e) {
    console.error('Error fetching news:', e);
    const allNews = getMarkdownPosts('_noticias');
    displayNews = allNews.slice(0, 5);
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
        <TrimembracionSocial />
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
