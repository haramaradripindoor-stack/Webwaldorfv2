import AdmisionClient from '@/components/AdmisionClient'

export const metadata = {
  title: 'Admisión 2027 | Colegio Waldorf Trekan Puerto Varas',
  description: 'Proceso de admisión abierto para los niveles de prebásica y básica (de 3 a 14 años). Conoce cómo es llegar a Trekan, aranceles y nuestro proyecto pedagógico.',
  alternates: {
    canonical: 'https://www.colegiowaldorftrekan.cl/admision',
  },
}

export default function AdmisionPage() {
  return <AdmisionClient />
}
