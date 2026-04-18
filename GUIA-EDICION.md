# 📖 Guía de Edición — Colegio Waldorf Trekan
**Para el equipo del colegio — sin necesitar conocimientos de programación**

---

## 🌐 Cómo editar el sitio web desde GitHub (sin instalar nada)

### Paso 1 — Entrar al repositorio
1. Ve a **github.com**
2. Inicia sesión con `fvivancorne@gmail.com`
3. Entra al repositorio **Webwaldorfv2**

### Paso 2 — Editar un archivo
1. Haz clic en el archivo que quieres editar (ej: `index.html`)
2. Haz clic en el ícono del **lápiz ✏️** (arriba a la derecha del archivo)
3. Edita el contenido
4. Al terminar, baja hasta "Commit changes"
5. Escribe un mensaje corto (ej: "Agregué noticia de la fiesta")
6. Haz clic en **"Commit changes"** (botón verde)
7. En 2 minutos el sitio se actualiza solo ✅

---

## 📰 Agregar una noticia nueva

### Opción A — Solo texto y foto
En `index.html`, busca la sección `<!-- 📰 NOTICIAS -->` y copia este bloque:

```html
<div class="news-card">
  <div class="news-image">
    <picture>
      <source srcset="images/NOMBRE-FOTO.webp" type="image/webp">
      <img src="images/NOMBRE-FOTO.jpg" alt="DESCRIPCIÓN DE LA FOTO" loading="lazy">
    </picture>
  </div>
  <div class="news-content">
    <span class="news-date">15 de mayo de 2026</span>
    <h3>Título de la noticia</h3>
    <p>Texto de la noticia. Puede ser tan largo como necesites.</p>
  </div>
</div>
```

**Qué cambiar:**
| Qué | Dónde | Ejemplo |
|---|---|---|
| Nombre de la foto | `NOMBRE-FOTO.jpg` | `fiesta-otono.jpg` |
| Descripción foto | `alt="..."` | `alt="Fiesta de otoño Trekan"` |
| Fecha | `<span class="news-date">` | `21 de junio de 2026` |
| Título | `<h3>` | `Celebramos la Fiesta de Otoño` |
| Texto | `<p>` | El texto que quieras |

### Opción B — Con video de YouTube
Igual que la anterior pero agrega esto después del `<p>`:

```html
<div class="news-video">
  <iframe width="100%" height="250"
          src="https://www.youtube.com/embed/PEGA-EL-ID-AQUI"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen loading="lazy" title="Nombre del video">
  </iframe>
</div>
```

**Cómo obtener el ID del video de YouTube:**
- Abre el video en YouTube
- La URL es: `https://www.youtube.com/watch?v=`**`ABC123xyz`**
- El ID es la parte después de `v=` → en este caso `ABC123xyz`

---

## 📅 Editar actividades

En `index.html`, busca `<!-- 📅 ACTIVIDADES -->` y edita los bloques existentes:

```html
<div class="actividad-card">
  <div class="actividad-fecha">
    <span class="actividad-dia">28</span>    ← Cambia el número del día
    <span class="actividad-mes">ABR</span>   ← Cambia el mes (3 letras)
  </div>
  <div class="actividad-info">
    <span class="actividad-tipo tipo-asamblea">Asamblea</span>  ← Tipo de evento
    <h3>Nombre del evento</h3>
    <p>Descripción breve.</p>
    <span class="actividad-hora">📍 Las Azaleas 96 · 18:30 hrs</span>
  </div>
</div>
```

**Tipos de evento disponibles:**
| Clase CSS | Texto | Color |
|---|---|---|
| `tipo-asamblea` | Asamblea | Azul claro |
| `tipo-celebracion` | Celebración | Verde |
| `tipo-admision` | Admisión | Naranja |
| `tipo-taller` | Taller | Morado |

---

## 🖼️ Subir una foto nueva

### Desde GitHub web:
1. Entra al repositorio
2. Haz clic en la carpeta **`images/`**
3. Haz clic en **"Add file" → "Upload files"**
4. Arrastra tu foto
5. Escribe "Subí foto [nombre]" en el commit
6. Haz clic en **"Commit changes"**

### Recomendaciones para las fotos:
- **Formato:** JPG (no PNG, pesa menos)
- **Tamaño máximo:** 500KB por foto
- **Nombre:** sin espacios ni tildes → `fiesta-otono-2026.jpg` ✅, `Fiesta Otoño 2026.jpg` ❌
- **Tamaño ideal:** 1280px de ancho

---

## 👥 Editar el equipo

En `index.html`, busca `<div class="team-members">` y edita cada línea:

```html
<p><strong>Nombre Apellido:</strong> Descripción del rol y formación.</p>
```

---

## 📍 Editar información de contacto

Busca en `index.html` la sección `id="contacto"` y edita:
- **Dirección:** busca `Las Azaleas 96`
- **Teléfono:** busca `+56967765106`
- **Email:** busca `admision@colegiowaldorftrekan.cl`

---

## 💰 Editar los aranceles

Busca en `index.html` la sección `id="admission"` y la tabla `<table class="admission-table">`.

Cada fila es:
```html
<tr>
  <td><strong>Nombre del concepto</strong></td>
  <td>$330.000/mes</td>
  <td>Detalle adicional.</td>
</tr>
```

---

## ⚠️ Reglas de oro

1. **Antes de editar** → Haz una copia del archivo (descárgalo)
2. **Nunca borres** una etiqueta de apertura sin borrar su cierre: `<div>` siempre va con `</div>`
3. **Las comillas** en HTML son siempre `"estas"`, no `"estas"` ni `'estas'`
4. **Si algo sale mal** → Ve al historial de commits en GitHub y haz clic en "Revert"
5. **Prueba siempre** en `http://localhost:8000` antes de hacer el push final

---

## 🆘 Si algo sale mal

1. Ve al repositorio en GitHub
2. Haz clic en **"Commits"** (historial)
3. Busca la versión anterior que funcionaba
4. Haz clic en **"..."** → **"Revert"**
5. El sitio vuelve a la versión anterior

---

## 📞 Contacto técnico

Para cambios más grandes (rediseño, nuevas secciones, etc.) contactar al desarrollador.

