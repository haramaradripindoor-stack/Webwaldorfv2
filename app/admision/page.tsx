import AdmisionClient from '@/components/AdmisionClient'
import ADMISION_CONFIG from '@/config/admision'

export const metadata = {
  title: `${ADMISION_CONFIG.title} | Colegio Waldorf Trekan Puerto Varas`,
  description: `Proceso de ${ADMISION_CONFIG.title.toLowerCase()} abierto para los niveles de jardín infantil y básica (de 3 a 14 años). Conoce cómo es llegar a Trekan, aranceles y nuestro proyecto pedagógico.`,
  alternates: {
    canonical: 'https://www.colegiowaldorftrekan.cl/admision',
  },
  openGraph: {
    title: `${ADMISION_CONFIG.title} | Colegio Waldorf Trekan Puerto Varas`,
    description: `Proceso de ${ADMISION_CONFIG.title.toLowerCase()} abierto para los niveles de jardín infantil y básica (de 3 a 14 años) en Parque Ivian, Puerto Varas.`,
    url: 'https://www.colegiowaldorftrekan.cl/admision',
    siteName: 'Trekan',
    locale: 'es_CL',
    type: 'website',
  }
}

export default function AdmisionPage() {
  return <AdmisionClient />
}
