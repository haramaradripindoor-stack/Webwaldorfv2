# Colegio Waldorf Trekan — Sitio Web v2.1

Sitio web oficial del Colegio Waldorf Trekan, Puerto Varas, Chile.  
URL: [www.colegiowaldorftrekan.cl](https://www.colegiowaldorftrekan.cl)

---

## 📖 Para el equipo del colegio

**¿Quieres agregar una noticia o editar contenido?**  
→ Lee primero: **[GUIA-EDICION.md](GUIA-EDICION.md)**  
→ Copia plantillas desde: **[PLANTILLAS.html](PLANTILLAS.html)**

### Cómo editar sin instalar nada:
1. Entra a github.com con tu cuenta
2. Abre el archivo `index.html`
3. Haz clic en el ✏️ lápiz para editar
4. Haz los cambios
5. Clic en **"Commit changes"**
6. En 2 minutos el sitio se actualiza ✅

---

## 📁 Estructura del proyecto

```
/
├── index.html              → Página principal ← EDITAR AQUÍ
├── cotizacion-salon.html   → Formulario cotización salón
├── GUIA-EDICION.md         → Guía para el equipo ← LEER ESTO
├── PLANTILLAS.html         → Plantillas para copiar/pegar
├── style.css               → Estilos (no tocar)
├── manifest.json           → PWA config (no tocar)
├── robots.txt              → SEO (no tocar)
├── sitemap.xml             → SEO (no tocar)
├── 404.html                → Página de error (no tocar)
├── assets/                 → Logo y fondo del header
├── images/                 → FOTOS DEL SITIO ← subir fotos aquí
├── fonts/                  → Fuentes (no tocar)
└── js/
    └── script.js           → JavaScript (no tocar)
```

---

## 🔧 Stack técnico

- HTML5 + CSS3 + JavaScript vanilla
- Hosted en **GitHub Pages** con dominio propio via CNAME
- EmailJS para formulario de cotización
- Google Tag Manager + GA4 (`G-WNCT5SCLQ9`)
- FormSubmit para formulario de contacto

---

## 🚀 Deploy

Push a `main` → deploy automático en ~2 minutos.

```bash
git add .
git commit -m "descripción del cambio"
git push
```

---

## 📧 Contactos técnicos

- **Coordinación:** coordinacion@colegiowaldorftrekan.cl
- **Analytics:** analytics.google.com (cuenta fvivancorne@gmail.com)
- **Tag Manager:** tagmanager.google.com

## 🔄 Historial

- **v2.1** (abril 2026): Mobile UX, WebP, SEO schemas, formularios, GA4, nav con dropdowns, guía editorial
- **v2.0** (agosto 2025): Versión inicial
