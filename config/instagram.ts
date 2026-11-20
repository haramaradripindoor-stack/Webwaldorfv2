export interface InstagramPost {
  id: string
  img: string
  link: string
  caption: string
  tag: string
}

// 8 Posts curados de alta resolución (Colegio Waldorf Trekan) - 100% Sin duplicados
export const FALLBACK_POSTS: InstagramPost[] = [
  {
    id: 'post-1',
    img: '/assets/instagram/post_01_bosque_exploracion.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'Caminar por senderos nativos y descubrir el bosque templado en Parque Ivian.',
    tag: 'Bosque & Juego Libre'
  },
  {
    id: 'post-2',
    img: '/assets/instagram/post_02_casona_patrimonio.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'Nuestra Casona histórica al sol de la mañana en Parque Ivian, Puerto Varas.',
    tag: 'Entorno Vivo'
  },
  {
    id: 'post-3',
    img: '/assets/instagram/post_03_concentracion_luz.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'Espacios de silencio y calma donde el pensamiento florece sin apuros ni pantallas.',
    tag: 'Ambiente de Aprendizaje'
  },
  {
    id: 'post-4',
    img: '/assets/instagram/post_04_acuarela_color.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'La vivencia del color puro: acuarela sobre papel húmedo guiada por el ritmo natural.',
    tag: 'Arte & Vivencia'
  },
  {
    id: 'post-5',
    img: '/assets/instagram/post_05_manos_hilado.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'El trabajo con vellón de lana: sentir la textura, templar el calor y crear con propósito.',
    tag: 'Oficios Tradicionales'
  },
  {
    id: 'post-6',
    img: '/assets/instagram/post_06_tallado_madera.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'Modelar la madera nativa con paciencia y respeto por las formas de la naturaleza.',
    tag: 'Voluntad Creadora'
  },
  {
    id: 'post-7',
    img: '/assets/instagram/post_07_jardin_ronda.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'El cobijo del Jardín de Infancia: juguetes nobles y telas de colores que invitan a soñar.',
    tag: 'Primer Septenio'
  },
  {
    id: 'post-8',
    img: '/assets/instagram/post_08_dosel_parque.webp',
    link: 'https://www.instagram.com/waldorftrekanpv/',
    caption: 'El dosel de árboles nativos que cobija a nuestra comunidad en Puerto Varas.',
    tag: 'Comunidad Trekan'
  }
]
