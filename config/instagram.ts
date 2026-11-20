export interface InstagramPost {
  id: string
  img: string
  link: string
  caption: string
  tag: string
}

// Posts curados de alta resolución (Colegio Waldorf Trekan)
export const FALLBACK_POSTS: InstagramPost[] = [
  {
    id: 'post-1',
    img: '/assets/instagram/post_1_oficios_lana.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'La voluntad vive en las manos: oficios y tejido con palillos en la sala de clases.',
    tag: 'Oficios & Voluntad'
  },
  {
    id: 'post-2',
    img: '/assets/instagram/post_2_casona_bosque.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'Nuestra Casona en Parque Ivian, rodeada de bosque nativo y praderas templadas.',
    tag: 'Entorno Vivo'
  },
  {
    id: 'post-3',
    img: '/assets/instagram/post_3_pizarra_epoca.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'Ritmo de época: inmersión profunda de varias semanas en una sola materia viva.',
    tag: 'Metodología Waldorf'
  },
  {
    id: 'post-4',
    img: '/assets/instagram/post_4_cuaderno_arte.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'Arte y vivencia interior: el cuaderno de época como registro poético del aprendizaje.',
    tag: 'Arte & Color'
  },
  {
    id: 'post-5',
    img: '/assets/instagram/post_5_manos_tejido.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'Reverencia y ritmo: manos pequeñas que aprenden el valor de la perseverancia.',
    tag: 'Motricidad Fina'
  },
  {
    id: 'post-6',
    img: '/assets/instagram/post_6_ruka_madera.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'Materiales nobles y cosmovisión viva en madera nativa.',
    tag: 'Voluntad Creadora'
  },
  {
    id: 'post-7',
    img: '/assets/instagram/post_7_jardin_cobijo.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'El cobijo del Jardín de Infancia: lazure, sedas y calor de hogar.',
    tag: 'Primer Septenio'
  },
  {
    id: 'post-8',
    img: '/assets/instagram/post_8_casona_pradera.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'Parque Ivian, Puerto Varas: donde el niño camina con voluntad hacia la libertad.',
    tag: 'Comunidad Trekan'
  }
]
