const fs = require('fs');

const content = fs.readFileSync('style.css', 'utf8');
const blocks = content.split('/* ======================\n');

let cssModules = {};

const mapping = {
  'variables': ['variables-css-globales'],
  'base': ['reset-y-base', 'tipograf-a', 'contenedores', 'optimizaciones-de-imagen', 'accesibilidad', 'print-styles'],
  'layout': ['header-principal', 'navegaci-n-mejorada', 'submen-desplegable-5-items-nav', 'footer', 'nav-container-overflow-visible-garantizado'],
  'hero': ['hero-section', 'hero-redise-ado'],
  'components': ['botones', 'secciones-de-contenido', 'features-grid', 'quote-section', 'about-grid', 'grid-list', 'slideshow-mejorado', 'modal-mejorado', 'formulario-de-contacto', 'bot-n-whatsapp-flotante-sin-solapamiento', 'bot-n-volver-arriba', 'dots-touch-target-ampliado', 'estados-active-feedback-t-ctil', 'barra-de-progreso-de-scroll'],
  'sections': ['noticias', 'admisi-n', 'faq-acorde-n', 'contacto', 'arriendo-de-sal-n', 'pr-ximas-actividades', 'instagram-section', 'instagram-grid-fotos-reales'],
  'utilities': ['animaciones-y-efectos', 'utilidades', 'animaciones-al-scroll-data-animate', 'content-visibility-mejora-de-render-en-secciones-off-screen-solo-para-secciones-que-no-son-visibles-en-el-viewport-inicial'],
  'responsive': ['responsive-m-vil', 'mobile-ux-fixes-completos', 'iphone-notch-safe-area', 'mejoras-tipograf-a-m-vil', 'back-to-top-m-vil-posici-n-corregida', 'slideshow-mejoras-mobile', 'galer-a-de-noticias-mobile', 'formulario-contacto-dark-section', 'mapa-mobile', 'preview-galer-a-arriendo-mobile', 'mobile-ux-section-padding', 'fix-logo-header-fondo-blanco']
};

let rawTitles = [];

for (let i = 1; i < blocks.length; i++) {
  const block = blocks[i];
  const titleEnd = block.indexOf('\n   ====================== */');
  let rawTitle = block.substring(0, titleEnd).trim();
  let cleanTitle = rawTitle.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase().replace(/-+/g, '-');
  
  if (cleanTitle.startsWith('-')) cleanTitle = cleanTitle.substring(1);
  if (cleanTitle.endsWith('-')) cleanTitle = cleanTitle.substring(0, cleanTitle.length - 1);
  
  rawTitles.push(cleanTitle);
  
  let category = 'misc';
  for (const [cat, titles] of Object.entries(mapping)) {
    if (titles.includes(cleanTitle)) {
      category = cat;
      break;
    }
  }
  
  if (!cssModules[category]) cssModules[category] = '';
  cssModules[category] += '/* ======================\n' + block + '\n';
}

// Ensure the src/css folder exists
if (!fs.existsSync('src/css')) {
  fs.mkdirSync('src/css', { recursive: true });
}

for (const [cat, css] of Object.entries(cssModules)) {
  fs.writeFileSync(`src/css/${cat}.css`, css);
  console.log(`Created src/css/${cat}.css`);
}
