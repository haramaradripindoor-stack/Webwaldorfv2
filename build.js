#!/usr/bin/env node

/**
 * BUILD SCRIPT — Colegio Waldorf Trekan
 * Lee markdown del CMS y actualiza las secciones del sitio
 * Marcadores: <!-- CMS:SECCION:START --> ... <!-- CMS:SECCION:END -->
 */

const fs   = require('fs');
const path = require('path');

// ── Parsear frontmatter ───────────────────────────────────────────────────────
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: content };
  const data = {};
  match[1].split('\n').forEach(line => {
    const i = line.indexOf(':');
    if (i === -1) return;
    const k = line.slice(0, i).trim();
    const v = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (k) data[k] = v;
  });
  return { data, body: match[2].trim() };
}

// ── Leer carpeta de markdown ──────────────────────────────────────────────────
function readFolder(folder) {
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder)
    .filter(f => f.endsWith('.md'))
    .map(f => ({ file: f, ...parseFrontmatter(fs.readFileSync(path.join(folder, f), 'utf8')) }))
    .filter(i => Object.keys(i.data).length > 0)
    .sort((a, b) => b.file.localeCompare(a.file)); // más reciente primero
}

// ── Reemplazar bloque entre marcadores ───────────────────────────────────────
function injectBetweenMarkers(html, section, newContent) {
  const start = `<!-- CMS:${section}:START -->`;
  const end   = `<!-- CMS:${section}:END -->`;
  const re    = new RegExp(`(${escapeRe(start)})[\\s\\S]*?(${escapeRe(end)})`, 'g');
  if (!re.test(html)) {
    console.warn(`⚠️  Marcadores CMS:${section} no encontrados`);
    return html;
  }
  return html.replace(
    new RegExp(`(${escapeRe(start)})[\\s\\S]*?(${escapeRe(end)})`),
    `$1\n${newContent}\n        $2`
  );
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Markdown → HTML simple ────────────────────────────────────────────────────
function mdToHtml(text) {
  return text.split('\n\n').filter(p => p.trim())
    .map(p => `<p>${p.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}</p>`)
    .join('\n            ');
}

// ── Tipos de actividad ────────────────────────────────────────────────────────
const TIPO_LABEL = {
  asamblea: 'Asamblea', celebracion: 'Celebración',
  admision: 'Admisión', taller: 'Taller'
};

// ── Generar HTML noticia ──────────────────────────────────────────────────────
function noticiaHtml(n, i) {
  const d   = n.data;
  const foto    = d.foto || 'images/noticia1.jpg';
  const webp    = foto.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const alt     = d.foto_alt || d.titulo || 'Noticia Trekan';
  const video   = d.video_id ? `
            <div class="news-video">
              <iframe width="100%" height="250"
                src="https://www.youtube.com/embed/${d.video_id}?rel=0&modestbranding=1&iv_load_policy=3"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen loading="lazy" title="${d.titulo || ''}">
              </iframe>
            </div>` : '';

  return `        <div class="news-card" data-animate="fade-up" data-delay="${i * 150}">
          <div class="news-image">
            <picture>
              <source srcset="${webp}" type="image/webp">
              <img src="${foto}" alt="${alt}" loading="lazy">
            </picture>
          </div>
          <div class="news-content">
            <span class="news-date">${d.fecha || ''}</span>
            <h3>${d.titulo || ''}</h3>
            ${mdToHtml(n.body)}${video}
          </div>
        </div>`;
}

// ── Generar HTML actividad ────────────────────────────────────────────────────
function actividadHtml(a, i) {
  const d    = a.data;
  const tipo = d.tipo || 'celebracion';
  return `        <div class="actividad-card" data-animate="fade-up" data-delay="${i * 100}">
          <div class="actividad-fecha">
            <span class="actividad-dia">${d.dia || ''}</span>
            <span class="actividad-mes">${d.mes || ''}</span>
          </div>
          <div class="actividad-info">
            <span class="actividad-tipo tipo-${tipo}">${TIPO_LABEL[tipo] || tipo}</span>
            <h3>${d.nombre || ''}</h3>
            <p>${d.descripcion || ''}</p>
            <span class="actividad-hora">📍 ${d.hora || ''}</span>
          </div>
        </div>`;
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
console.log('🔨 Building Colegio Waldorf Trekan...');

const noticias    = readFolder('_noticias');
const actividades = readFolder('_actividades');

console.log(`   📰 Noticias: ${noticias.length}`);
console.log(`   📅 Actividades: ${actividades.length}`);

let html = fs.readFileSync('index.html', 'utf8');

// Inyectar noticias
const noticiasBlock = noticias.length
  ? noticias.map(noticiaHtml).join('\n\n')
  : '        <div class="info-card"><p>Próximamente nuevas noticias.</p></div>';

html = injectBetweenMarkers(html, 'NOTICIAS', noticiasBlock);

// Inyectar actividades
const actividadesBlock = actividades.length
  ? actividades.map(actividadHtml).join('\n\n')
  : '        <div class="info-card"><p>Próximamente nuevas actividades.</p></div>';

html = injectBetweenMarkers(html, 'ACTIVIDADES', actividadesBlock);

fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ index.html actualizado con contenido del CMS');
