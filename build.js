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
    .filter(item => Object.keys(item.data).length > 0)
    .sort((a, b) => b.file.localeCompare(a.file));
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
const CSS_MARKER = '/* CMS-GALLERY-v2 */';
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
</style>
`;

// ─────────────────────────────────────────────────────────────────────────────
//  JS del lightbox — se inyecta antes de </body> (idempotente)
// ─────────────────────────────────────────────────────────────────────────────
const JS_MARKER = '/* CMS-LIGHTBOX-v2 */';
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
})();
</script>
`;

function injectCss(html) {
  if (html.includes(CSS_MARKER)) return html;
  return html.replace('</head>', GALLERY_CSS + '\n</head>');
}

function injectJs(html) {
  if (html.includes(JS_MARKER)) return html;
  return html.replace('</body>', GALLERY_JS + '\n</body>');
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
console.log('🔨 Building Colegio Waldorf Trekan v2...\n');

const noticias    = readFolder('_noticias');
const actividades = readFolder('_actividades');

console.log('   📰 Noticias:    ' + noticias.length);
console.log('   📅 Actividades: ' + actividades.length);

let html = fs.readFileSync('index.html', 'utf8');

const noticiasBlock = noticias.length
  ? noticias.map(noticiaHtml).join('\n\n')
  : '        <div class="info-card"><p>Próximamente nuevas noticias.</p></div>';
html = injectBetweenMarkers(html, 'NOTICIAS', noticiasBlock);

const actividadesBlock = actividades.length
  ? actividades.map(actividadHtml).join('\n\n')
  : '        <div class="info-card"><p>Próximamente nuevas actividades.</p></div>';
html = injectBetweenMarkers(html, 'ACTIVIDADES', actividadesBlock);

html = injectCss(html);
html = injectJs(html);

fs.writeFileSync('index.html', html, 'utf8');

console.log('\n✅ index.html actualizado');
console.log('   🖼  Galería con lightbox habilitada');
console.log('   🎥  YouTube / Vimeo responsive (16:9) habilitado');
console.log('   📝  Markdown enriquecido activo');
console.log('\n── Sintaxis en tus .md ─────────────────────────────────────');
console.log('  foto:             images/portada.jpg');
console.log('  galeria:          [images/f1.jpg, images/f2.jpg, images/f3.jpg]');
console.log('  galeria_completa: true   ← incluye portada en la galería');
console.log('  video_id:         dQw4w9WgXcQ');
console.log('  video_ids:        [id1, id2]');
console.log('  video_url:        https://vimeo.com/...');
console.log('────────────────────────────────────────────────────────────\n');
