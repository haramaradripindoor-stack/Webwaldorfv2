#!/usr/bin/env node

/**
 * BUILD SCRIPT v2 — Colegio Waldorf Trekan
 * ─────────────────────────────────────────
 * Soporta:
 *   • Galería de imágenes con lightbox nativo (sin librerías externas)
 *   • YouTube y Vimeo responsive (aspect ratio 16:9 real)
 *   • Múltiples videos por noticia (video_id / video_ids / video_url)
 *   • Markdown enriquecido: h3/h4, ul/ol, blockquote, links, bold, italic, code
 *   • Arrays YAML en frontmatter:
 *       galeria: [images/foto1.jpg, images/foto2.jpg]
 *       video_ids: [abc123, def456]
 *   • Auto-inyección de CSS + JS del lightbox en index.html
 *
 * Marcadores en index.html:
 *   <!-- CMS:NOTICIAS:START -->  …  <!-- CMS:NOTICIAS:END -->
 *   <!-- CMS:ACTIVIDADES:START --> … <!-- CMS:ACTIVIDADES:END -->
 */

const fs   = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ── Compilación de templates HTML y módulos CSS ──────────────────────────────
console.log('📦 Compilando plantillas y estilos...');

const htmlTemplates = [
  'head', 'header', 'nav', 'hero', 'pedagogia', 'quienes-somos', 
  'actividades', 'testimonios', 'comunidad', 'noticias', 'curricular', 'admision', 
  'faq', 'contacto', 'instagram', 'footer', 'modals-scripts'
];

let builtHtml = '';
for (const tpl of htmlTemplates) {
  const p = path.join('src', 'templates', tpl + '.html');
  if (fs.existsSync(p)) {
    builtHtml += fs.readFileSync(p, 'utf8') + '\n';
  } else {
    console.warn(`⚠️  Falta plantilla: ${p}`);
  }
}
if (builtHtml) {
  // Inyectar Configuración Global (contacto.yml)
  if (fs.existsSync(path.join('_config', 'contacto.yml'))) {
    let config = {};
    try {
      config = yaml.load(fs.readFileSync(path.join('_config', 'contacto.yml'), 'utf8'));
    } catch (e) {
      console.warn('Error leyendo contacto.yml:', e.message);
    }
    
    // Limpiar teléfono para links (quitar espacios)
    const telClean = (config.telefono || '').replace(/\s+/g, '');
    
    // Reemplazos (soportando los placeholders en los templates)
    builtHtml = builtHtml.replace(/\{\{CONTACTO_TELEFONO\}\}/g, config.telefono || '');
    builtHtml = builtHtml.replace(/\{\{CONTACTO_TEL_CLEAN\}\}/g, telClean);
    builtHtml = builtHtml.replace(/\{\{CONTACTO_EMAIL_ADMISION\}\}/g, config.email_admision || '');
    builtHtml = builtHtml.replace(/\{\{CONTACTO_DIRECCION\}\}/g, config.direccion || '');
    builtHtml = builtHtml.replace(/\{\{CONTACTO_INSTAGRAM\}\}/g, config.instagram || '');
    builtHtml = builtHtml.replace(/\{\{LINK_POSTULACION\}\}/g, config.link_postulacion || '');
  }

  // Cargar configuraciones de páginas
  function loadConfig(name) {
    const p = path.join('_config', name + '.yml');
    if (fs.existsSync(p)) {
      try { return yaml.load(fs.readFileSync(p, 'utf8')) || {}; }
      catch (e) { console.warn(`Error leyendo ${name}.yml:`, e.message); }
    }
    return {};
  }
  const configInicio = loadConfig('inicio');
  const configQuienes = loadConfig('quienes_somos');
  const configPedagogia = loadConfig('pedagogia');
  const configFaq = loadConfig('faq');

  // Inyectar Inicio (Hero)
  if (configInicio.titulo) {
    builtHtml = builtHtml.replace(/\{\{INICIO_TITULO\}\}/g, configInicio.titulo);
    builtHtml = builtHtml.replace(/\{\{INICIO_SUBTITULO\}\}/g, mdToHtml(configInicio.subtitulo || ''));
    builtHtml = builtHtml.replace(/\{\{INICIO_CTA\}\}/g, configInicio.cta_text || '🌿 Conocer el proceso de admisión');
  }

  // Inyectar Quiénes Somos
  if (configQuienes.titulo) {
    builtHtml = builtHtml.replace(/\{\{QUIENES_TITULO\}\}/g, configQuienes.titulo);
    
    let tarjetasHtml = '';
    if (configQuienes.tarjetas && configQuienes.tarjetas.length > 0) {
      configQuienes.tarjetas.forEach((t, i) => {
        const fullClass = t.full_width ? ' full-width' : '';
        let mediaHtml = '';
        if (t.imagen) {
          const imgSrc = t.imagen.startsWith('/') ? t.imagen : '/' + t.imagen;
          const cleanAlt = t.titulo.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();
          mediaHtml = `<img src="${imgSrc}" alt="${cleanAlt}" class="about-img" loading="lazy">`;
        }
        tarjetasHtml += `
        <div class="about-card${fullClass}" data-animate="fade-up" data-delay="${i * 100}">
          ${mediaHtml}
          <h3>${t.titulo}</h3>
          ${mdToHtml(t.texto)}
        </div>`;
      });
    } else if (configQuienes.historia) {
      // Compatibilidad hacia atrás si usan el formato antiguo
      tarjetasHtml = mdToHtml(configQuienes.historia);
    }
    builtHtml = builtHtml.replace(/\{\{QUIENES_HISTORIA\}\}/g, tarjetasHtml);
  }

  // Inyectar Pedagogía
  if (configPedagogia.titulo) {
    builtHtml = builtHtml.replace(/\{\{PEDAGOGIA_TITULO\}\}/g, configPedagogia.titulo);
    builtHtml = builtHtml.replace(/\{\{PEDAGOGIA_DESCRIPCION\}\}/g, configPedagogia.descripcion || '');
    
    let pilaresHtml = '';
    if (configPedagogia.pilares && configPedagogia.pilares.length > 0) {
      configPedagogia.pilares.forEach((p, i) => {
        let mediaHtml = '';
        if (p.imagen) {
          const imgSrc = p.imagen.startsWith('/') ? p.imagen : '/' + p.imagen;
          const cleanAlt = p.titulo.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();
          mediaHtml = `<img src="${imgSrc}" alt="${cleanAlt}" class="feature-img" loading="lazy">`;
        } else {
          const icono = p.titulo.match(/^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/) ? '' : '✨';
          mediaHtml = `<div class="feature-icon">${icono}</div>`;
        }
        
        pilaresHtml += `
        <div class="feature" data-animate="fade-up" data-delay="${i * 100}">
          ${mediaHtml}
          <h3>${p.titulo}</h3>
          <p>${p.descripcion}</p>
        </div>`;
      });
    }
    builtHtml = builtHtml.replace(/\{\{PEDAGOGIA_PILARES\}\}/g, pilaresHtml);
  }

  // Inyectar FAQ
  if (configFaq.titulo) {
    builtHtml = builtHtml.replace(/\{\{FAQ_TITULO\}\}/g, configFaq.titulo);
    builtHtml = builtHtml.replace(/\{\{FAQ_SUBTITULO\}\}/g, configFaq.subtitulo || '');
    
    let faqHtml = '';
    if (configFaq.preguntas && configFaq.preguntas.length > 0) {
      configFaq.preguntas.forEach(q => {
        // Extraemos un emoji si lo hay al principio, si no, ponemos un dot
        const match = q.pregunta.match(/^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*(.*)/);
        const emoji = match ? match[1] : '💬';
        const texto = match ? match[2] : q.pregunta;
        
        faqHtml += `
        <div class="faq-item" role="listitem">
          <button class="faq-question">
            <span class="faq-emoji">${emoji}</span>
            <span class="faq-text">${texto}</span>
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            ${mdToHtml(q.respuesta)}
          </div>
        </div>`;
      });
    }
    builtHtml = builtHtml.replace(/\{\{FAQ_LISTA\}\}/g, faqHtml);
  }

  fs.writeFileSync('index.html', builtHtml.trim() + '\n', 'utf8');
  console.log('   ✅ index.html generado desde src/templates (Ajustes Globales inyectados)');
}

const cssModules = [
  'variables', 'base', 'layout', 'responsive', 'hero', 
  'components', 'sections', 'utilities'
];

let builtCss = '';
for (const mod of cssModules) {
  const p = path.join('src', 'css', mod + '.css');
  if (fs.existsSync(p)) {
    builtCss += fs.readFileSync(p, 'utf8') + '\n';
  } else {
    console.warn(`⚠️  Falta módulo CSS: ${p}`);
  }
}
if (builtCss) {
  fs.writeFileSync('style.css', builtCss.trim() + '\n', 'utf8');
  console.log('   ✅ style.css generado desde src/css');
}


// ── Configuración: cantidad máxima a mostrar en la web ───────────────────────
// Cambia estos números si quieres mostrar más o menos.
const MAX_NOTICIAS    = 6;  // las 6 más recientes
const MAX_ACTIVIDADES = 4;  // las 4 más próximas

// ── Parsear frontmatter YAML (soporta arrays, bloques >- y | del CMS) ────────
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: content };

  const data  = {};
  const lines = match[1].split('\n');
  let currentKey  = null;
  let blockMode   = null;   // 'folded' (>-) o 'literal' (|-)
  let blockLines  = [];

  function flushBlock() {
    if (!blockMode || !currentKey) return;
    if (blockMode === 'folded') {
      // Une líneas en párrafos; líneas vacías = salto de párrafo
      let out = '', i = 0;
      while (i < blockLines.length) {
        if (blockLines[i] === '') { out += '\n'; i++; }
        else {
          const para = [];
          while (i < blockLines.length && blockLines[i] !== '') para.push(blockLines[i++]);
          out += para.join(' ');
          if (i < blockLines.length) out += '\n';
        }
      }
      data[currentKey] = out.trim();
    } else {
      data[currentKey] = blockLines.join('\n').trim();
    }
    blockMode  = null;
    blockLines = [];
  }

  lines.forEach(rawLine => {
    const line = rawLine.replace(/\r$/, '');

    // Estamos dentro de un bloque escalar
    if (blockMode) {
      if (line === '' || /^\s/.test(line)) {
        blockLines.push(line.trimStart());
        return;
      }
      // Primera línea sin sangría = fin del bloque
      flushBlock();
    }

    // Ítem de lista YAML (-  valor)
    if (/^\s{1,}-\s+/.test(line)) {
      if (currentKey) {
        if (!Array.isArray(data[currentKey])) data[currentKey] = [];
        data[currentKey].push(line.replace(/^\s*-\s+/, '').trim().replace(/^["']|["']$/g, ''));
      }
      return;
    }

    const i = line.indexOf(':');
    if (i === -1) return;
    const k = line.slice(0, i).trim();
    const v = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (!k) return;
    currentKey = k;

    if (v === '>-' || v === '>') {
      blockMode  = 'folded';
      blockLines = [];
    } else if (v === '|-' || v === '|') {
      blockMode  = 'literal';
      blockLines = [];
    } else if (v.startsWith('[') && v.endsWith(']')) {
      data[k] = v.slice(1, -1).split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      data[k] = v;
    }
  });

  flushBlock(); // por si el bloque es el último campo
  return { data, body: match[2].trim() };
}

// ── Leer carpeta de markdown ──────────────────────────────────────────────────
function readFolder(folder) {
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder)
    .filter(f => f.endsWith('.md'))
    .map(f => ({
      file: f,
      ...parseFrontmatter(fs.readFileSync(path.join(folder, f), 'utf8'))
    }))
    .filter(item => Object.keys(item.data).length > 0);
}

// Noticias: más reciente primero (descendente por fecha en filename)
function readNoticias() {
  return readFolder('_noticias')
    .sort((a, b) => b.file.localeCompare(a.file));
}

// Actividades: próximas primero, filtrando las pasadas
const MES_NUM = {
  ENE:1, FEB:2, MAR:3, ABR:4, MAY:5, JUN:6,
  JUL:7, AGO:8, SEP:9, OCT:10, NOV:11, DIC:12
};

function actividadFecha(a) {
  const d   = a.data;
  const dia = parseInt(d.dia);
  const mes = MES_NUM[d.mes];
  let anio = new Date().getFullYear();

  // Prioridad 1: Año desde el nombre del archivo (Decap)
  const fileMatch = a.file.match(/^(\d{4})-/);
  if (fileMatch) {
    anio = parseInt(fileMatch[1], 10);
  }

  // Prioridad 2: Si existe día y mes en frontmatter, usar con el año extraído
  if (dia && mes) {
    return new Date(anio, mes - 1, dia);
  }

  // Prioridad 3: Fecha completa del nombre de archivo (fallback)
  const fileMatchFull = a.file.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (fileMatchFull) {
    return new Date(
      parseInt(fileMatchFull[1], 10),
      parseInt(fileMatchFull[2], 10) - 1,
      parseInt(fileMatchFull[3], 10)
    );
  }

  return new Date();
}

function readActividades() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return readFolder('_actividades')
    .filter(a => actividadFecha(a) >= hoy)   // solo futuras o de hoy
    .sort((a, b) => actividadFecha(a) - actividadFecha(b)); // ascendente: próximas primero
}


// Todas las actividades sin filtro de fecha (para el calendario completo)
function readTodasActividades() {
  return readFolder('_actividades')
    .sort((a, b) => actividadFecha(a) - actividadFecha(b));
}

// ── Reemplazar bloque entre marcadores ───────────────────────────────────────
function injectBetweenMarkers(html, section, newContent) {
  const start = `<!-- CMS:${section}:START -->`;
  const end   = `<!-- CMS:${section}:END -->`;
  const re    = new RegExp(`(${escRe(start)})[\\s\\S]*?(${escRe(end)})`);
  if (!re.test(html)) {
    console.warn(`⚠️  Marcadores CMS:${section} no encontrados en index.html`);
    return html;
  }
  return html.replace(re, `$1\n${newContent}\n        $2`);
}

function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// ── Markdown → HTML enriquecido ───────────────────────────────────────────────
function mdToHtml(text) {
  if (!text || !text.trim()) return '';

  const inline = s => s
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g,       '<em>$1</em>')
    .replace(/\*(.*?)\*/g,     '<em>$1</em>')
    .replace(/~~(.*?)~~/g,     '<s>$1</s>')
    .replace(/`(.*?)`/g,       '<code>$1</code>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

  return text.split(/\n{2,}/).filter(b => b.trim()).map(block => {
    const t = block.trim();

    const heading = t.match(/^(#{1,4})\s+(.+)/);
    if (heading) {
      const lvl = Math.min(heading[1].length + 2, 6);
      return `<h${lvl}>${inline(heading[2])}</h${lvl}>`;
    }
    if (t.startsWith('> ')) {
      return `<blockquote>${inline(t.replace(/^> /gm, ''))}</blockquote>`;
    }
    if (/^[-*+] /.test(t)) {
      const items = t.split('\n').filter(l => /^[-*+] /.test(l))
        .map(l => `<li>${inline(l.replace(/^[-*+] /, ''))}</li>`).join('');
      return `<ul>${items}</ul>`;
    }
    if (/^\d+\.\s/.test(t)) {
      const items = t.split('\n').filter(l => /^\d+\.\s/.test(l))
        .map(l => `<li>${inline(l.replace(/^\d+\.\s/, ''))}</li>`).join('');
      return `<ol>${items}</ol>`;
    }
    if (/^---+$/.test(t) || /^\*\*\*+$/.test(t)) return '<hr>';
    return `<p>${inline(t)}</p>`;
  }).join('\n            ');
}

// ── Galería de imágenes con lightbox ─────────────────────────────────────────
function galeriaHtml(imagenes, id) {
  if (!imagenes || !imagenes.length) return '';

  const thumbs = imagenes.map((img, idx) => {
    const webp = toWebp(img);
    return `
            <div class="cms-gallery-thumb" data-gallery="${id}" data-index="${idx}"
                 tabindex="0" role="button" aria-label="Ver imagen ${idx + 1}">
              <picture>
                <source srcset="${webp}" type="image/webp">
                <img src="${img}" alt="Foto ${idx + 1}" loading="lazy" width="200" height="150">
              </picture>
              <div class="cms-gallery-overlay">🔍</div>
            </div>`;
  }).join('');

  return `
          <div class="cms-gallery-grid" id="gallery-${id}">
            ${thumbs.trim()}
          </div>`;
}

// ── Video embed: YouTube, múltiples, o URL directa ───────────────────────────
function videoHtml(d) {
  const videos = [];
  if (Array.isArray(d.video_ids)) d.video_ids.forEach(id => videos.push({ type: 'yt', id }));
  if (d.video_id && !Array.isArray(d.video_ids)) videos.push({ type: 'yt', id: d.video_id });
  if (d.video_url) videos.push({ type: 'url', src: d.video_url });
  if (!videos.length) return '';

  return videos.map(v => {
    const src = v.type === 'yt'
      ? `https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1&iv_load_policy=3`
      : v.src;
    return `
            <div class="cms-video-wrap">
              <iframe src="${src}" title="${d.titulo || 'Video'}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen loading="lazy">
              </iframe>
            </div>`;
  }).join('');
}

function toWebp(src) { return src.replace(/\.(jpg|jpeg|png)$/i, '.webp'); }

const TIPO_LABEL = {
  asamblea: 'Asamblea', celebracion: 'Celebración', admision: 'Admisión',
  taller: 'Taller', reunion: 'Reunión', charla: 'Charla',
};

// ── Generar HTML de noticia ───────────────────────────────────────────────────
function noticiaHtml(n, i) {
  const d      = n.data;
  const galeId = `n${i}`;
  const imagenes = Array.isArray(d.galeria) && d.galeria.length
    ? d.galeria
    : d.foto ? [d.foto] : ['images/noticia1.jpg'];

  const fotoMain = imagenes[0];
  const webpMain = toWebp(fotoMain);
  const alt      = d.foto_alt || d.titulo || 'Noticia';

  // galeria_completa: true → todas las imgs en galería; si no, las extra (sin la portada)
  const mostrarGaleria = imagenes.length > 1
    ? (d.galeria_completa === 'true'
        ? galeriaHtml(imagenes, galeId)
        : galeriaHtml(imagenes.slice(1), galeId))
    : '';

  return `        <div class="news-card" data-animate="fade-up" data-delay="${i * 150}">
          <div class="news-image">
            <picture>
              <source srcset="${webpMain}" type="image/webp">
              <img src="${fotoMain}" alt="${alt}" loading="lazy" width="600" height="400">
            </picture>
          </div>
          <div class="news-content">
            <span class="news-date">${d.fecha || ''}</span>
            <h3>${d.titulo || ''}</h3>
            ${mdToHtml(n.body)}
            ${mostrarGaleria}
            ${videoHtml(d)}
          </div>
        </div>`;
}

// ── Generar HTML de actividad ─────────────────────────────────────────────────
function actividadHtml(a, i) {
  const d    = a.data;
  const tipo = d.tipo || 'celebracion';
  const hora  = d.hora  ? `\n            <span class="actividad-hora">🕐 ${d.hora}</span>` : '';
  const lugar = d.lugar ? `\n            <span class="actividad-hora">🏫 ${d.lugar}</span>` : '';
  // Descripción corta (frontmatter) + cuerpo largo del documento (si existe)
  const descCorta = d.descripcion ? `<p>${d.descripcion}</p>` : '';
  const bodyHtml  = a.body && a.body.trim() ? `<div class="actividad-body">${mdToHtml(a.body)}</div>` : '';
  return `        <div class="actividad-card" data-animate="fade-up" data-delay="${i * 100}">
          <div class="actividad-fecha">
            <span class="actividad-dia">${d.dia || ''}</span>
            <span class="actividad-mes">${d.mes || ''}</span>
          </div>
          <div class="actividad-info">
            <span class="actividad-tipo tipo-${tipo}">${TIPO_LABEL[tipo] || tipo}</span>
            <h3>${d.nombre || ''}</h3>
            ${descCorta}${bodyHtml}${hora}${lugar}
          </div>
        </div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
//  CSS del lightbox — se inyecta en <head> (idempotente)
// ─────────────────────────────────────────────────────────────────────────────
const CSS_MARKER = '/* CMS-GALLERY-v4 */';
const GALLERY_CSS = `
<style id="cms-gallery-styles">
${CSS_MARKER}

.cms-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 6px;
  margin-top: 1rem;
}
.cms-gallery-thumb {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
}
.cms-gallery-thumb:focus-visible {
  box-shadow: 0 0 0 3px var(--secondary-green, #A8D8B9);
}
.cms-gallery-thumb picture,
.cms-gallery-thumb img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}
.cms-gallery-thumb:hover img,
.cms-gallery-thumb:focus img { transform: scale(1.1); }
.cms-gallery-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; opacity: 0;
  transition: background 0.2s ease, opacity 0.2s ease;
}
.cms-gallery-thumb:hover .cms-gallery-overlay,
.cms-gallery-thumb:focus .cms-gallery-overlay {
  background: rgba(0,0,0,0.38); opacity: 1;
}

/* ── Lightbox ── */
#cms-lightbox {
  display: none;
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.93);
  z-index: 9999;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
}
#cms-lightbox.open { display: flex; }
#cms-lightbox img {
  max-width: min(90vw, 1200px);
  max-height: 80vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 8px 48px rgba(0,0,0,0.6);
  user-select: none;
}
.cms-lb-counter {
  color: rgba(255,255,255,0.65);
  font-size: 0.85rem;
  margin-top: 0.8rem;
  font-family: monospace;
}
.cms-lb-btn {
  position: absolute;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1.8rem;
  line-height: 1;
  padding: 0.4rem 0.9rem;
  transition: background 0.2s ease;
}
.cms-lb-btn:hover { background: rgba(255,255,255,0.28); }
.cms-lb-close { top: 1rem; right: 1rem; font-size: 1.4rem; }
.cms-lb-prev  { left: 1rem;  top: 50%; transform: translateY(-50%); }
.cms-lb-next  { right: 1rem; top: 50%; transform: translateY(-50%); }
@media (max-width: 480px) {
  .cms-gallery-grid { grid-template-columns: repeat(3, 1fr); }
  .cms-lb-prev { left: 0.4rem; }
  .cms-lb-next { right: 0.4rem; }
}

/* ── Video responsive 16:9 ── */
.cms-video-wrap {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 10px;
  margin-top: 1rem;
  background: #000;
}
.cms-video-wrap iframe {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%; border: none;
}

/* ── Link "Ver archivo completo" en home ── */
.cms-ver-archivo {
  grid-column: 1 / -1;
  text-align: center;
  margin: 2.5rem 0 1rem;
}
.cms-ver-archivo a {
  display: inline-block;
  padding: 0.75rem 1.6rem;
  border: 1.5px solid var(--primary-green, #4A7C59);
  color: var(--primary-green, #4A7C59);
  text-decoration: none;
  border-radius: 999px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.cms-ver-archivo a:hover {
  background: var(--primary-green, #4A7C59);
  color: #fff;
  transform: translateY(-1px);
}

/* ── Archivo de noticias: chips + masonry grid ── */
.cms-archivo-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1rem 0;
  margin: 0 0 1.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.cms-chip {
  border: 1px solid rgba(0,0,0,0.15);
  background: #fff;
  padding: 0.45rem 1.05rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  font-family: inherit;
  color: inherit;
}
.cms-chip:hover { background: #f4f4f4; }
.cms-chip.active {
  background: var(--primary-green, #4A7C59);
  color: #fff;
  border-color: transparent;
}
.cms-archivo-grid {
  columns: 1;
  column-gap: 1.5rem;
}
@media (min-width: 640px)  { .cms-archivo-grid { columns: 2; } }
@media (min-width: 1024px) { .cms-archivo-grid { columns: 3; } }
.cms-archivo-card {
  break-inside: avoid;
  margin: 0 0 1.5rem;
  display: block;
}
.cms-archivo-card.hidden { display: none; }
.cms-archivo-empty {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(0,0,0,0.55);
  font-style: italic;
}

/* ── Calendario de actividades: secciones por mes ── */
.cms-calendario-mes { margin-bottom: 2.5rem; }
.cms-calendario-mes-titulo {
  font-family: 'Merriweather', serif;
  font-size: 1.4rem;
  color: var(--primary-green, #4A7C59);
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(74,124,89,0.15);
  text-transform: capitalize;
}
</style>
`;

// ─────────────────────────────────────────────────────────────────────────────
//  JS del lightbox — se inyecta antes de </body> (idempotente)
// ─────────────────────────────────────────────────────────────────────────────
const JS_MARKER = '/* CMS-LIGHTBOX-v4 */';
const GALLERY_JS = `
<script id="cms-lightbox-script">
${JS_MARKER}
(function () {
  var lb = document.createElement('div');
  lb.id = 'cms-lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Galería de imágenes');
  lb.innerHTML =
    '<button class="cms-lb-btn cms-lb-close" aria-label="Cerrar">✕</button>' +
    '<button class="cms-lb-btn cms-lb-prev"  aria-label="Anterior">‹</button>' +
    '<img src="" alt="Imagen ampliada">' +
    '<div class="cms-lb-counter"></div>' +
    '<button class="cms-lb-btn cms-lb-next"  aria-label="Siguiente">›</button>';
  document.body.appendChild(lb);

  var imgs = [], cur = 0;

  function getImgs(gallery) {
    return Array.from(
      document.querySelectorAll('.cms-gallery-thumb[data-gallery="' + gallery + '"]')
    ).map(function(el) { return el.querySelector('img').src; });
  }

  function open(gallery, idx) {
    imgs = getImgs(gallery);
    if (!imgs.length) return;
    cur = Math.max(0, Math.min(idx, imgs.length - 1));
    render();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.cms-lb-close').focus();
  }

  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  function prev()  { cur = (cur - 1 + imgs.length) % imgs.length; render(); }
  function next()  { cur = (cur + 1) % imgs.length; render(); }

  function render() {
    lb.querySelector('img').src = imgs[cur];
    lb.querySelector('.cms-lb-counter').textContent = (cur + 1) + ' / ' + imgs.length;
    var many = imgs.length > 1;
    lb.querySelector('.cms-lb-prev').style.display = many ? '' : 'none';
    lb.querySelector('.cms-lb-next').style.display = many ? '' : 'none';
  }

  lb.querySelector('.cms-lb-close').addEventListener('click', close);
  lb.querySelector('.cms-lb-prev').addEventListener('click', prev);
  lb.querySelector('.cms-lb-next').addEventListener('click', next);
  lb.addEventListener('click', function(e) { if (e.target === lb) close(); });

  document.addEventListener('keydown', function(e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  var startX = 0;
  lb.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  });

  document.addEventListener('click', function(e) {
    var thumb = e.target.closest('.cms-gallery-thumb');
    if (thumb) open(thumb.dataset.gallery, parseInt(thumb.dataset.index, 10));
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var thumb = document.activeElement && document.activeElement.closest('.cms-gallery-thumb');
      if (thumb) open(thumb.dataset.gallery, parseInt(thumb.dataset.index, 10));
    }
  });

  // ── Filtro de chips (archivo de noticias y calendario de actividades) ──
  document.addEventListener('click', function(e) {
    var chip = e.target.closest('.cms-chip');
    if (!chip) return;
    var filter = chip.dataset.filter || chip.dataset.year;
    var chips = document.querySelectorAll('.cms-chip');
    chips.forEach(function(c) {
      var on = (c === chip);
      c.classList.toggle('active', on);
      c.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    var cards = document.querySelectorAll('.cms-archivo-card');
    var visible = 0;
    cards.forEach(function(card) {
      var cardFilter = card.dataset.filter || card.dataset.year;
      var show = (filter === 'all') || (cardFilter === filter);
      card.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    // Ocultar secciones de mes vacías (solo relevante en calendario)
    var sections = document.querySelectorAll('.cms-calendario-mes');
    sections.forEach(function(section) {
      var sectionKey = section.dataset.month;
      var show = (filter === 'all') || (sectionKey === filter);
      section.style.display = show ? '' : 'none';
    });
    var empty = document.querySelector('.cms-archivo-empty');
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
  });
})();
</script>
`;

function injectCss(html) {
  if (html.includes(CSS_MARKER)) return html;
  // Limpiar versiones anteriores antes de inyectar la nueva (evita bloques zombies)
  html = html.replace(/\s*<style id="cms-gallery-styles">[\s\S]*?<\/style>\s*/g, '\n');
  return html.replace('</head>', GALLERY_CSS + '\n</head>');
}

function injectJs(html) {
  if (html.includes(JS_MARKER)) return html;
  // Limpiar versiones anteriores antes de inyectar la nueva
  html = html.replace(/\s*<script id="cms-lightbox-script">[\s\S]*?<\/script>\s*/g, '\n');
  return html.replace('</body>', GALLERY_JS + '\n</body>');
}

// ── Archivo completo de noticias: genera/actualiza noticias.html ─────────────
function noticiaYear(n) {
  const m = n.file.match(/^(\d{4})/);
  return m ? m[1] : 'sin-fecha';
}

// Convierte anchors del tipo href="#seccion" a href="index.html#seccion"
// para que el navbar/footer heredados lleven de vuelta a la home.
function rewriteAnchors(html) {
  return html.replace(/href="#([^"]+)"/g, 'href="index.html#$1"');
}

// Ajusta el <head> del index para la página de archivo:
// título propio, canonical y og:url apuntando a /noticias.html.
function adjustHeadForArchivo(head) {
  return head
    .replace(/<title>[\s\S]*?<\/title>/i,
      '<title>Archivo de noticias — Colegio Waldorf Trekan</title>')
    .replace(/<meta\s+name="description"\s+content="[^"]*"/i,
      '<meta name="description" content="Archivo histórico de noticias del Colegio Waldorf Trekan. Todas las publicaciones organizadas por año."')
    .replace(/<link\s+rel="canonical"\s+href="([^"]+)"[^>]*>/i, (_, url) => {
      const base = url.replace(/\/$/, '');
      return `<link rel="canonical" href="${base}/noticias.html">`;
    })
    .replace(/<meta\s+property="og:url"\s+content="([^"]+)"[^>]*>/i, (_, url) => {
      const base = url.replace(/\/$/, '');
      return `<meta property="og:url" content="${base}/noticias.html">`;
    })
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"/i,
      '<meta property="og:title" content="Archivo de noticias — Colegio Waldorf Trekan"')
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"/i,
      '<meta name="twitter:title" content="Archivo de noticias — Colegio Waldorf Trekan"');
}

function buildArchivoNoticias(todas) {
  if (!todas.length) return;

  // Años únicos, descendente
  const years = [...new Set(todas.map(noticiaYear))]
    .sort((a, b) => b.localeCompare(a));

  // Chips
  const chipsHtml =
    `          <div class="cms-archivo-chips" role="tablist" aria-label="Filtrar por año">\n` +
    `            <button class="cms-chip active" data-filter="all" role="tab" aria-selected="true">Todas</button>\n` +
    years.map(y =>
      `            <button class="cms-chip" data-filter="${y}" role="tab" aria-selected="false">${y === 'sin-fecha' ? 'Sin fecha' : y}</button>`
    ).join('\n') +
    `\n          </div>`;

  // Cards envueltas con data-filter para filtrar
  const cardsHtml = todas.map((n, i) =>
    `          <article class="cms-archivo-card" data-filter="${noticiaYear(n)}">\n${noticiaHtml(n, i)}\n          </article>`
  ).join('\n\n');

  const archivoBlock =
    chipsHtml + `\n\n          <div class="cms-archivo-grid">\n${cardsHtml}\n          </div>\n          <div class="cms-archivo-empty" style="display:none;">No hay noticias para este año.</div>`;

  const archivoPath = 'noticias.html';
  let archivoHtml;

  if (fs.existsSync(archivoPath)) {
    // Ya existe: solo inyecta entre marcadores (respeta ediciones del usuario)
    archivoHtml = fs.readFileSync(archivoPath, 'utf8');
    archivoHtml = injectBetweenMarkers(archivoHtml, 'ARCHIVO', archivoBlock);
  } else {
    // No existe: genera plantilla heredando head + navbar + footer del index
    const indexHtml = fs.readFileSync('index.html', 'utf8');

    // 1. Head (con title/canonical/og ajustados)
    const headMatch = indexHtml.match(/<head[\s\S]*?<\/head>/i);
    const head = headMatch
      ? adjustHeadForArchivo(headMatch[0])
      : '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Archivo de noticias</title></head>';

    // 2. Nav (con anchors reescritos hacia index.html)
    const navMatch = indexHtml.match(/<nav\b[\s\S]*?<\/nav>/i);
    const nav = navMatch ? rewriteAnchors(navMatch[0]) : '';

    // 3. Footer (con anchors reescritos)
    const footerMatch = indexHtml.match(/<footer\b[\s\S]*?<\/footer>/i);
    const footer = footerMatch ? rewriteAnchors(footerMatch[0]) : '';

    const afterFooterMatch = indexHtml.match(/<\/footer>\s*([\s\S]*?)<\/body>/i);
    const afterFooter = afterFooterMatch ? rewriteAnchors(afterFooterMatch[1]) : '  <script src="js/script.js"></script>\n';

    archivoHtml = `<!DOCTYPE html>
<html lang="es">
${head}
<body>
${nav}

  <main class="container" style="max-width:1200px;margin:0 auto;padding:6rem 1.25rem 4rem;">
    <header style="margin-bottom:1.5rem;">
      <h1 style="margin:0 0 0.4rem;font-family:'Merriweather',serif;">Archivo de noticias</h1>
      <p style="color:rgba(0,0,0,0.6);margin:0;">Todas las publicaciones del colegio, filtrables por año.</p>
    </header>
    <!-- CMS:ARCHIVO:START -->
${archivoBlock}
    <!-- CMS:ARCHIVO:END -->
  </main>

${footer}
${afterFooter}</body>
</html>`;
  }

  // CSS + JS del lightbox/chips (idempotente)
  archivoHtml = injectCss(archivoHtml);
  archivoHtml = injectJs(archivoHtml);

  fs.writeFileSync(archivoPath, archivoHtml, 'utf8');
  console.log('   📂 Archivo:     ' + todas.length + ' noticias en ' + years.length + ' año(s) → noticias.html');
}

// ── Calendario completo de actividades: genera/actualiza actividades.html ────
const MESES_LARGO = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
  5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
  9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
};

function actividadMesKey(a) {
  const d = actividadFecha(a);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

function buildCalendarioActividades(todas) {
  if (!todas.length) return;

  // Agrupar por mes-año (las actividades ya vienen ordenadas cronológicamente)
  const groups = new Map();
  for (const a of todas) {
    const key = actividadMesKey(a);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(a);
  }
  const keys = [...groups.keys()].sort();

  // Mostrar solo el nombre del mes (sin año) para mantener el calendario atemporal
  const labelFor = key => {
    const [, m] = key.split('-');
    return MESES_LARGO[parseInt(m, 10)];
  };

  // Chips (Todos + un chip por mes con actividades)
  const chipsHtml =
    `          <div class="cms-archivo-chips" role="tablist" aria-label="Filtrar por mes">\n` +
    `            <button class="cms-chip active" data-filter="all" role="tab" aria-selected="true">Todos</button>\n` +
    keys.map(k =>
      `            <button class="cms-chip" data-filter="${k}" role="tab" aria-selected="false">${labelFor(k)}</button>`
    ).join('\n') +
    `\n          </div>`;

  // Secciones por mes con heading
  const sectionsHtml = keys.map(k => {
    const cards = groups.get(k).map((a, idx) =>
      `              <article class="cms-archivo-card" data-filter="${k}">\n${actividadHtml(a, idx)}\n              </article>`
    ).join('\n');
    return `          <section class="cms-calendario-mes" data-month="${k}">
            <h2 class="cms-calendario-mes-titulo">${labelFor(k)}</h2>
            <div class="cms-archivo-grid">
${cards}
            </div>
          </section>`;
  }).join('\n\n');

  const calendarioBlock =
    chipsHtml + '\n\n' + sectionsHtml +
    '\n          <div class="cms-archivo-empty" style="display:none;">No hay actividades para este mes.</div>';

  const calendarioPath = 'actividades.html';
  let calendarioHtml;

  if (fs.existsSync(calendarioPath)) {
    // Ya existe: solo inyecta entre marcadores (respeta ediciones del usuario)
    calendarioHtml = fs.readFileSync(calendarioPath, 'utf8');
    calendarioHtml = injectBetweenMarkers(calendarioHtml, 'CALENDARIO', calendarioBlock);
  } else {
    // No existe: genera plantilla heredando head + navbar + footer del index
    const indexHtml = fs.readFileSync('index.html', 'utf8');

    const headMatch = indexHtml.match(/<head[\s\S]*?<\/head>/i);
    let head = headMatch
      ? adjustHeadForArchivo(headMatch[0])
      : '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Calendario de actividades</title></head>';
    // Ajustar específicamente para el calendario (sobreescribe title/canonical que adjustHeadForArchivo puso para noticias)
    head = head
      .replace(/<title>[\s\S]*?<\/title>/i,
        '<title>Calendario de actividades — Colegio Waldorf Trekan</title>')
      .replace(/<link rel="canonical" href="[^"]+"/i, (m) =>
        m.replace(/noticias\.html/, 'actividades.html'))
      .replace(/<meta property="og:url" content="[^"]+"/i, (m) =>
        m.replace(/noticias\.html/, 'actividades.html'))
      .replace(/<meta property="og:title" content="[^"]*"/i,
        '<meta property="og:title" content="Calendario de actividades — Colegio Waldorf Trekan"')
      .replace(/<meta name="twitter:title" content="[^"]*"/i,
        '<meta name="twitter:title" content="Calendario de actividades — Colegio Waldorf Trekan"')
      .replace(/<meta\s+name="description"\s+content="[^"]*"/i,
        '<meta name="description" content="Calendario de próximas actividades del Colegio Waldorf Trekan organizadas por mes."');

    const navMatch = indexHtml.match(/<nav\b[\s\S]*?<\/nav>/i);
    const nav = navMatch ? rewriteAnchors(navMatch[0]) : '';

    const footerMatch = indexHtml.match(/<footer\b[\s\S]*?<\/footer>/i);
    const footer = footerMatch ? rewriteAnchors(footerMatch[0]) : '';

    const afterFooterMatch = indexHtml.match(/<\/footer>\s*([\s\S]*?)<\/body>/i);
    const afterFooter = afterFooterMatch ? rewriteAnchors(afterFooterMatch[1]) : '  <script src="js/script.js"></script>\n';

    calendarioHtml = `<!DOCTYPE html>
<html lang="es">
${head}
<body>
${nav}

  <main class="container" style="max-width:1200px;margin:0 auto;padding:6rem 1.25rem 4rem;">
    <header style="margin-bottom:1.5rem;">
      <h1 style="margin:0 0 0.4rem;font-family:'Merriweather',serif;">Calendario de actividades</h1>
      <p style="color:rgba(0,0,0,0.6);margin:0;">Próximos eventos del colegio, organizados por mes.</p>
    </header>
    <!-- CMS:CALENDARIO:START -->
${calendarioBlock}
    <!-- CMS:CALENDARIO:END -->
  </main>

${footer}
${afterFooter}</body>
</html>`;
  }

  // CSS + JS (idempotente)
  calendarioHtml = injectCss(calendarioHtml);
  calendarioHtml = injectJs(calendarioHtml);

  fs.writeFileSync(calendarioPath, calendarioHtml, 'utf8');
  console.log('   📅 Calendario:  ' + todas.length + ' actividades en ' + keys.length + ' mes(es) → actividades.html');
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
console.log('🔨 Building Colegio Waldorf Trekan v2...\n');

const noticias          = readNoticias();
const actividades         = readActividades();
const todasActividades    = readTodasActividades();

// Totales antes de recortar (para el log)
const totalNoticias    = noticias.length;
const totalActividades = actividades.length;

// Recortar a lo que se mostrará en la web
const noticiasVisibles    = noticias.slice(0, MAX_NOTICIAS);

// Homepage: Mostrar las actividades vigentes que pertenecen al mes actual
const currentMonth = new Date().getMonth();
let actividadesVisibles = actividades.filter(a => actividadFecha(a).getMonth() === currentMonth);
// Si ya no quedan actividades en este mes, mostrar las próximas 4
if (actividadesVisibles.length === 0) {
  actividadesVisibles = actividades.slice(0, MAX_ACTIVIDADES);
}

console.log('   📰 Noticias:    ' + noticiasVisibles.length + ' de ' + totalNoticias + ' (máx ' + MAX_NOTICIAS + ')');
console.log('   📅 Actividades: ' + actividadesVisibles.length + ' de ' + totalActividades + ' (máx ' + MAX_ACTIVIDADES + ')');

let html = fs.readFileSync('index.html', 'utf8');

// Link a archivo completo de noticias (solo si hay más que el máximo visible)
const verArchivoLink = totalNoticias > MAX_NOTICIAS
  ? '\n\n        <div class="cms-ver-archivo"><a href="noticias.html">Ver archivo completo (' + totalNoticias + ' noticias) →</a></div>'
  : '';

// Link a calendario completo (si hay más actividades que el máximo visible)
const verCalendarioLink = todasActividades.length > MAX_ACTIVIDADES
  ? '\n\n        <div class="cms-ver-archivo"><a href="actividades.html">Ver calendario completo (' + todasActividades.length + ' actividades) →</a></div>'
  : '';

const noticiasBlock = noticiasVisibles.length
  ? noticiasVisibles.map(noticiaHtml).join('\n\n') + verArchivoLink
  : '        <div class="info-card"><p>Próximamente nuevas noticias.</p></div>';
html = injectBetweenMarkers(html, 'NOTICIAS', noticiasBlock);

const actividadesBlock = actividadesVisibles.length
  ? actividadesVisibles.map(actividadHtml).join('\n\n') + verCalendarioLink
  : '        <div class="info-card"><p>Próximamente nuevas actividades.</p></div>';
html = injectBetweenMarkers(html, 'ACTIVIDADES', actividadesBlock);

html = injectCss(html);
html = injectJs(html);

fs.writeFileSync('index.html', html, 'utf8');

// Generar páginas completas: archivo de noticias + calendario de actividades
buildArchivoNoticias(noticias);
buildCalendarioActividades(todasActividades);

console.log('\n✅ index.html actualizado');
console.log('   🖼  Galería con lightbox habilitada');
console.log('   🎥  YouTube / Vimeo responsive (16:9) habilitado');
console.log('   📝  Markdown enriquecido activo');
console.log('   📂  Archivo completo de noticias → noticias.html');
console.log('   📅  Calendario de actividades → actividades.html');
console.log('\n── Sintaxis en tus .md ─────────────────────────────────────');
console.log('  foto:             images/portada.jpg');
console.log('  galeria:          [images/f1.jpg, images/f2.jpg, images/f3.jpg]');
console.log('  galeria_completa: true   ← incluye portada en la galería');
console.log('  video_id:         dQw4w9WgXcQ');
console.log('  video_ids:        [id1, id2]');
console.log('  video_url:        https://vimeo.com/...');
console.log('────────────────────────────────────────────────────────────\n');

// ═══════════════════════════════════════════════════════════════════════════
// SOPORTE MULTIIDIOMA — EN / DE
// Lee _noticias/en/, _noticias/de/, _actividades/en/, _actividades/de/
// Genera noticias-en.html, noticias-de.html, actividades-en.html, actividades-de.html
// ═══════════════════════════════════════════════════════════════════════════

const LANG_CONFIG = {
  en: {
    code: 'en',
    suffix: '-en',
    noticias_folder: '_noticias/en',
    actividades_folder: '_actividades/en',
    noticias_file: 'noticias-en.html',
    actividades_file: 'actividades-en.html',
    // Textos UI en inglés
    ui: {
      noticias_titulo: 'News Archive',
      noticias_desc: 'All school publications, filterable by year.',
      noticias_todas: 'All',
      noticias_empty: 'No news for this year.',
      actividades_titulo: 'Activities Calendar',
      actividades_desc: 'Upcoming school events, organized by month.',
      actividades_todos: 'All',
      actividades_empty: 'No activities for this month.',
      ver_archivo: 'View full archive',
      ver_calendario: 'View full calendar',
    }
  },
  de: {
    code: 'de',
    suffix: '-de',
    noticias_folder: '_noticias/de',
    actividades_folder: '_actividades/de',
    noticias_file: 'noticias-de.html',
    actividades_file: 'actividades-de.html',
    ui: {
      noticias_titulo: 'Nachrichtenarchiv',
      noticias_desc: 'Alle Schulpublikationen, nach Jahr filterbar.',
      noticias_todas: 'Alle',
      noticias_empty: 'Keine Neuigkeiten für dieses Jahr.',
      actividades_titulo: 'Aktivitätenkalender',
      actividades_desc: 'Kommende Schulveranstaltungen, nach Monat geordnet.',
      actividades_todos: 'Alle',
      actividades_empty: 'Keine Aktivitäten für diesen Monat.',
      ver_archivo: 'Vollständiges Archiv anzeigen',
      ver_calendario: 'Vollständigen Kalender anzeigen',
    }
  }
};

// Meses largos en cada idioma para el calendario
const MESES_LARGO_LANG = {
  en: { 1:'January',2:'February',3:'March',4:'April',5:'May',6:'June',
        7:'July',8:'August',9:'September',10:'October',11:'November',12:'December' },
  de: { 1:'Januar',2:'Februar',3:'März',4:'April',5:'Mai',6:'Juni',
        7:'Juli',8:'August',9:'September',10:'Oktober',11:'November',12:'Dezember' }
};

// ── Leer noticias/actividades de carpeta de idioma ────────────────────────
function readNoticiasLang(lang) {
  const folder = LANG_CONFIG[lang].noticias_folder;
  if (!fs.existsSync(folder)) {
    console.log(`   ⚠️  Carpeta no encontrada: ${folder}`);
    return [];
  }
  return readFolder(folder).sort((a, b) => b.file.localeCompare(a.file));
}

function readActividadesLang(lang) {
  const folder = LANG_CONFIG[lang].actividades_folder;
  if (!fs.existsSync(folder)) {
    console.log(`   ⚠️  Carpeta no encontrada: ${folder}`);
    return [];
  }
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return readFolder(folder)
    .filter(a => actividadFecha(a) >= hoy)
    .sort((a, b) => actividadFecha(a) - actividadFecha(b));
}

// ── Ajustar <head> para páginas de idioma ─────────────────────────────────
function adjustHeadForLang(head, lang, tipo) {
  const cfg = LANG_CONFIG[lang];
  const isNoticias = tipo === 'noticias';
  const titulo = isNoticias
    ? (lang === 'en' ? 'News Archive' : 'Nachrichtenarchiv')
    : (lang === 'en' ? 'Activities Calendar' : 'Aktivitätenkalender');
  const archivo = isNoticias ? cfg.noticias_file : cfg.actividades_file;

  return head
    .replace(/<html[^>]*>/i, `<html lang="${lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${titulo} — Colegio Waldorf Trekan</title>`)
    .replace(/<link\s+rel="canonical"\s+href="([^"]+)"[^>]*>/i, (_, url) => {
      const base = url.replace(/\/$/, '').replace(/\/[^/]+$/, '');
      return `<link rel="canonical" href="${base}/${archivo}">`;
    })
    .replace(/<meta\s+property="og:url"\s+content="([^"]+)"[^>]*>/i, (_, url) => {
      const base = url.replace(/\/$/, '').replace(/\/[^/]+$/, '');
      return `<meta property="og:url" content="${base}/${archivo}">`;
    })
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"/i,
      `<meta property="og:title" content="${titulo} — Colegio Waldorf Trekan"`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"/i,
      `<meta name="twitter:title" content="${titulo} — Colegio Waldorf Trekan"`);
}

// ── Generar archivo de noticias en un idioma ──────────────────────────────
function buildNoticiasLang(lang) {
  const todas = readNoticiasLang(lang);
  if (!todas.length) {
    console.log(`   📂 Noticias ${lang.toUpperCase()}: sin archivos en ${LANG_CONFIG[lang].noticias_folder}`);
    return;
  }

  const cfg = LANG_CONFIG[lang];
  const ui  = cfg.ui;

  const years = [...new Set(todas.map(noticiaYear))].sort((a, b) => b.localeCompare(a));

  const chipsHtml =
    `          <div class="cms-archivo-chips" role="tablist" aria-label="Filter by year">\n` +
    `            <button class="cms-chip active" data-filter="all" role="tab" aria-selected="true">${ui.noticias_todas}</button>\n` +
    years.map(y =>
      `            <button class="cms-chip" data-filter="${y}" role="tab" aria-selected="false">${y}</button>`
    ).join('\n') +
    `\n          </div>`;

  const cardsHtml = todas.map((n, i) =>
    `          <article class="cms-archivo-card" data-filter="${noticiaYear(n)}">\n${noticiaHtml(n, i)}\n          </article>`
  ).join('\n\n');

  const archivoBlock =
    chipsHtml +
    `\n\n          <div class="cms-archivo-grid">\n${cardsHtml}\n          </div>\n` +
    `          <div class="cms-archivo-empty" style="display:none;">${ui.noticias_empty}</div>`;

  const archivoPath = cfg.noticias_file;
  let archivoHtml;

  if (fs.existsSync(archivoPath)) {
    archivoHtml = fs.readFileSync(archivoPath, 'utf8');
    archivoHtml = injectBetweenMarkers(archivoHtml, 'ARCHIVO', archivoBlock);
  } else {
    const indexHtml = fs.readFileSync('index.html', 'utf8');
    const headMatch = indexHtml.match(/<head[\s\S]*?<\/head>/i);
    const head = headMatch
      ? adjustHeadForLang(headMatch[0], lang, 'noticias')
      : `<head><meta charset="UTF-8"><title>${ui.noticias_titulo}</title></head>`;
    const navMatch   = indexHtml.match(/<nav\b[\s\S]*?<\/nav>/i);
    const nav        = navMatch ? rewriteAnchors(navMatch[0]) : '';
    const footerMatch = indexHtml.match(/<footer\b[\s\S]*?<\/footer>/i);
    const footer     = footerMatch ? rewriteAnchors(footerMatch[0]) : '';
    const afterFooterMatch = indexHtml.match(/<\/footer>\s*([\s\S]*?)<\/body>/i);
    const afterFooter = afterFooterMatch ? rewriteAnchors(afterFooterMatch[1]) : '  <script src="js/script.js"></script>\n';

    archivoHtml = `<!DOCTYPE html>\n<html lang="${lang}">\n${head}\n<body>\n${nav}\n\n  <main class="container" style="max-width:1200px;margin:0 auto;padding:6rem 1.25rem 4rem;">\n    <header style="margin-bottom:1.5rem;">\n      <h1 style="margin:0 0 0.4rem;font-family:'Merriweather',serif;">${ui.noticias_titulo}</h1>\n      <p style="color:rgba(0,0,0,0.6);margin:0;">${ui.noticias_desc}</p>\n    </header>\n    <!-- CMS:ARCHIVO:START -->\n${archivoBlock}\n    <!-- CMS:ARCHIVO:END -->\n  </main>\n\n${footer}\n${afterFooter}</body>\n</html>`;
  }

  archivoHtml = injectCss(archivoHtml);
  archivoHtml = injectJs(archivoHtml);
  fs.writeFileSync(archivoPath, archivoHtml, 'utf8');
  console.log(`   📂 Noticias ${lang.toUpperCase()}:    ${todas.length} artículos → ${archivoPath}`);
}

// ── Generar calendario de actividades en un idioma ────────────────────────
function buildCalendarioLang(lang) {
  const todas = readActividadesLang(lang);
  if (!todas.length) {
    console.log(`   📅 Actividades ${lang.toUpperCase()}: sin archivos en ${LANG_CONFIG[lang].actividades_folder}`);
    return;
  }

  const cfg    = LANG_CONFIG[lang];
  const ui     = cfg.ui;
  const meses  = MESES_LARGO_LANG[lang];

  // Agrupar por mes
  const groups = new Map();
  for (const a of todas) {
    const key = actividadMesKey(a);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(a);
  }
  const keys = [...groups.keys()].sort();

  const uniqueYears  = new Set(keys.map(k => k.split('-')[0]));
  const singleYear   = uniqueYears.size === 1;
  const labelFor = key => {
    const [y, m] = key.split('-');
    const mes = meses[parseInt(m, 10)];
    return singleYear ? mes : `${mes} ${y}`;
  };

  const chipsHtml =
    `          <div class="cms-archivo-chips" role="tablist" aria-label="Filter by month">\n` +
    `            <button class="cms-chip active" data-filter="all" role="tab" aria-selected="true">${ui.actividades_todos}</button>\n` +
    keys.map(k =>
      `            <button class="cms-chip" data-filter="${k}" role="tab" aria-selected="false">${labelFor(k)}</button>`
    ).join('\n') +
    `\n          </div>`;

  const sectionsHtml = keys.map(k => {
    const cards = groups.get(k).map((a, idx) =>
      `              <article class="cms-archivo-card" data-filter="${k}">\n${actividadHtml(a, idx)}\n              </article>`
    ).join('\n');
    return `          <section class="cms-calendario-mes" data-month="${k}">\n            <h2 class="cms-calendario-mes-titulo">${labelFor(k)}</h2>\n            <div class="cms-archivo-grid">\n${cards}\n            </div>\n          </section>`;
  }).join('\n\n');

  const calendarioBlock =
    chipsHtml + '\n\n' + sectionsHtml +
    `\n          <div class="cms-archivo-empty" style="display:none;">${ui.actividades_empty}</div>`;

  const calendarioPath = cfg.actividades_file;
  let calendarioHtml;

  if (fs.existsSync(calendarioPath)) {
    calendarioHtml = fs.readFileSync(calendarioPath, 'utf8');
    calendarioHtml = injectBetweenMarkers(calendarioHtml, 'CALENDARIO', calendarioBlock);
  } else {
    const indexHtml = fs.readFileSync('index.html', 'utf8');
    const headMatch = indexHtml.match(/<head[\s\S]*?<\/head>/i);
    const head = headMatch
      ? adjustHeadForLang(headMatch[0], lang, 'actividades')
      : `<head><meta charset="UTF-8"><title>${ui.actividades_titulo}</title></head>`;
    const navMatch    = indexHtml.match(/<nav\b[\s\S]*?<\/nav>/i);
    const nav         = navMatch ? rewriteAnchors(navMatch[0]) : '';
    const footerMatch = indexHtml.match(/<footer\b[\s\S]*?<\/footer>/i);
    const footer      = footerMatch ? rewriteAnchors(footerMatch[0]) : '';
    const afterFooterMatch = indexHtml.match(/<\/footer>\s*([\s\S]*?)<\/body>/i);
    const afterFooter      = afterFooterMatch ? rewriteAnchors(afterFooterMatch[1]) : '  <script src="js/script.js"></script>\n';

    calendarioHtml = `<!DOCTYPE html>\n<html lang="${lang}">\n${head}\n<body>\n${nav}\n\n  <main class="container" style="max-width:1200px;margin:0 auto;padding:6rem 1.25rem 4rem;">\n    <header style="margin-bottom:1.5rem;">\n      <h1 style="margin:0 0 0.4rem;font-family:'Merriweather',serif;">${ui.actividades_titulo}</h1>\n      <p style="color:rgba(0,0,0,0.6);margin:0;">${ui.actividades_desc}</p>\n    </header>\n    <!-- CMS:CALENDARIO:START -->\n${calendarioBlock}\n    <!-- CMS:CALENDARIO:END -->\n  </main>\n\n${footer}\n${afterFooter}</body>\n</html>`;
  }

  calendarioHtml = injectCss(calendarioHtml);
  calendarioHtml = injectJs(calendarioHtml);
  fs.writeFileSync(calendarioPath, calendarioHtml, 'utf8');
  console.log(`   📅 Actividades ${lang.toUpperCase()}:  ${todas.length} eventos en ${keys.length} mes(es) → ${calendarioPath}`);
}

// ── Ejecutar build multiidioma ────────────────────────────────────────────
console.log('\n🌐 Building versiones EN / DE...\n');
buildNoticiasLang('en');
buildNoticiasLang('de');
buildCalendarioLang('en');
buildCalendarioLang('de');
console.log('\n✅ Build multiidioma completado');
console.log('   📂 noticias-en.html, noticias-de.html');
console.log('   📅 actividades-en.html, actividades-de.html');

// ═══════════════════════════════════════════════════════════════════════════
// ARRIENDO SALON PÁGINA INDEPENDIENTE
// ═══════════════════════════════════════════════════════════════════════════
function buildArriendoSalon() {
  let salonHtml = '';
  const components = ['head', 'nav', 'arriendo', 'footer', 'modals-scripts'];
  for (const tpl of components) {
    const p = path.join('src', 'templates', tpl + '.html');
    if (fs.existsSync(p)) {
      salonHtml += fs.readFileSync(p, 'utf8') + '\n';
    }
  }
  
  if (fs.existsSync(path.join('_config', 'contacto.yml'))) {
    let config = {};
    try {
      config = yaml.load(fs.readFileSync(path.join('_config', 'contacto.yml'), 'utf8'));
    } catch (e) {}
    const telClean = (config.telefono || '').replace(/\s+/g, '');
    salonHtml = salonHtml.replace(/\{\{CONTACTO_TELEFONO\}\}/g, config.telefono || '');
    salonHtml = salonHtml.replace(/\{\{CONTACTO_TEL_CLEAN\}\}/g, telClean);
    salonHtml = salonHtml.replace(/\{\{CONTACTO_EMAIL_ADMISION\}\}/g, config.email_admision || '');
    salonHtml = salonHtml.replace(/\{\{CONTACTO_DIRECCION\}\}/g, config.direccion || '');
    salonHtml = salonHtml.replace(/\{\{CONTACTO_INSTAGRAM\}\}/g, config.instagram || '');
    salonHtml = salonHtml.replace(/\{\{LINK_POSTULACION\}\}/g, config.link_postulacion || '');
  }
  
  salonHtml = injectCss(salonHtml);
  salonHtml = injectJs(salonHtml);
  
  salonHtml = salonHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>Arriendo de Salón — Colegio Waldorf Trekan</title>`);
  
  fs.writeFileSync('arriendo-salon.html', salonHtml, 'utf8');
  console.log('   🏡 Arriendo de Salón -> arriendo-salon.html');
}

console.log('\n🏠 Construyendo página dedicada de Arriendo de Salón...');
buildArriendoSalon();
console.log('✅ Listo!');

