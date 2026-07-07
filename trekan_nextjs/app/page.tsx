import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
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

export const revalidate = 0; // Para que actualice siempre que haya cambios en BD

export default async function Home() {
  const supabase = createClient();
  
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
    <main className="min-h-screen bg-[var(--color-waldorf-cream)] overflow-hidden">
      <Navbar />
      <Hero />
      <PedagogiaHorizontal />
      <BentoGrid />
      <ComunidadSection />
      <ActividadesSection />
      <ImmersiveTestimonials />
      <NewsSection displayNews={displayNews} />
      <MasonryGallery />
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
  )
}
