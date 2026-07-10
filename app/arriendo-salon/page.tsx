import ArriendoSalonClient from '@/components/ArriendoSalonClient'

export const metadata = {
  title: 'Arriendo de Salón Multiuso | Comunidad Colegio Waldorf Trekan',
  description: 'Arriendo de nuestro salón principal en Puerto Varas para talleres, charlas, yoga, reuniones comunitarias y actividades educativas. Revisa tarifas e instalaciones.',
  alternates: {
    canonical: 'https://www.colegiowaldorftrekan.cl/arriendo-salon',
  },
}

export default function ArriendoSalonPage() {
  return <ArriendoSalonClient />
}
