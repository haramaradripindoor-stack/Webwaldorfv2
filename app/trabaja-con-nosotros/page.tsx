import type { Metadata } from 'next'
import TeacherForm from '@/components/TeacherForm'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.colegiowaldorftrekan.cl'),
  title: 'Trabaja con Nosotros | Convocatoria Docente Colegio Waldorf Trekan',
  description: 'Buscamos educadores y maestros comprometidos con la infancia, la contención y la Pedagogía Waldorf en Puerto Varas. Postula a nuestras convocatorias docentes.',
  keywords: [
    'Trabajo profesor Waldorf Puerto Varas',
    'Convocatoria docente Puerto Varas',
    'Colegio Waldorf Trekan vacantes',
    'Maestro Waldorf Chile',
    'Educación alternativa empleo Los Lagos'
  ],
  alternates: {
    canonical: 'https://www.colegiowaldorftrekan.cl/trabaja-con-nosotros',
  },
  openGraph: {
    title: 'Trabaja con Nosotros | Convocatoria Docente Colegio Waldorf Trekan',
    description: 'Buscamos educadores y maestros comprometidos con la infancia, la contención y la Pedagogía Waldorf en Puerto Varas.',
    url: 'https://www.colegiowaldorftrekan.cl/trabaja-con-nosotros',
    siteName: 'Colegio Waldorf Trekan',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: 'https://www.colegiowaldorftrekan.cl/imagenes-web/paseocerro20261.jpg',
        width: 1200,
        height: 630,
        alt: 'Equipo pedagógico Colegio Waldorf Trekan Puerto Varas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trabaja con Nosotros | Convocatoria Docente Colegio Waldorf Trekan',
    description: 'Buscamos educadores y maestros comprometidos con la infancia y la Pedagogía Waldorf en Puerto Varas.',
    images: ['https://www.colegiowaldorftrekan.cl/imagenes-web/paseocerro20261.jpg'],
  },
}

export default function TrabajaConNosotrosPage() {
  return <TeacherForm />
}
