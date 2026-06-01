const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const markers = [
  { name: 'head', start: '<!DOCTYPE html>', end: '<body>' },
  { name: 'header', start: '  <!-- Barra de progreso de scroll -->', end: '  <!-- NAVEGACIÓN -->' },
  { name: 'nav', start: '  <!-- NAVEGACIÓN -->', end: '  <!-- Hero Section -->' },
  { name: 'hero', start: '  <!-- Hero Section -->', end: '  <!-- Pedagogía Section -->' },
  { name: 'pedagogia', start: '  <!-- Pedagogía Section -->', end: '  <!-- Quiénes Somos Section -->' },
  { name: 'quienes-somos', start: '  <!-- Quiénes Somos Section -->', end: '  <!-- PRÓXIMAS ACTIVIDADES -->' },
  { name: 'actividades', start: '  <!-- PRÓXIMAS ACTIVIDADES -->', end: '  <!-- Vida Comunitaria Section -->' },
  { name: 'comunidad', start: '  <!-- Vida Comunitaria Section -->', end: '  <!-- NOTICIAS -->' },
  { name: 'noticias', start: '  <!-- NOTICIAS -->', end: '  <!-- Propuesta Curricular Section -->' },
  { name: 'curricular', start: '  <!-- Propuesta Curricular Section -->', end: '  <!-- Admisión Section -->' },
  { name: 'admision', start: '  <!-- Admisión Section -->', end: '  <!-- FAQ Section -->' },
  { name: 'faq', start: '  <!-- FAQ Section -->', end: '  <!-- SECCIÓN ARRIENDO DE SALÓN -->' },
  { name: 'arriendo', start: '  <!-- SECCIÓN ARRIENDO DE SALÓN -->', end: '  <!-- Contacto Section -->' },
  { name: 'contacto', start: '  <!-- Contacto Section -->', end: '  <!-- INSTAGRAM -->' },
  { name: 'instagram', start: '  <!-- INSTAGRAM -->', end: '  <!-- Footer -->' },
  { name: 'footer', start: '  <!-- Footer -->', end: '  <!-- Modal Galería Principal -->' },
  { name: 'modals-scripts', start: '  <!-- Modal Galería Principal -->', end: '</html>' }
];

for (const marker of markers) {
  const startIdx = html.indexOf(marker.start);
  const endIdx = marker.end === '<body>' ? html.indexOf(marker.end) + 6 : (marker.end === '</html>' ? html.length : html.indexOf(marker.end));
  
  if (startIdx !== -1 && endIdx !== -1) {
    let content = html.substring(startIdx, endIdx);
    
    // For 'head', include up to <body>
    if (marker.name === 'head') {
      content = html.substring(0, endIdx);
    }
    
    fs.writeFileSync(`src/templates/${marker.name}.html`, content.trim() + '\n', 'utf8');
    console.log(`✅ ${marker.name}.html created`);
  } else {
    console.log(`❌ Failed to find markers for ${marker.name}`);
  }
}
