export default function supabaseLoader({ src, width, quality }) {
  const projectId = 'ebpioebxcyjpjgiqpjaw';
  const supabaseUrl = `https://${projectId}.supabase.co`;

  // Si la ruta ya es una URL completa de Supabase Storage (no optimizada)
  if (src.startsWith(supabaseUrl)) {
    if (src.includes('/object/public/')) {
      return src.replace('/object/public/', '/render/image/public/') + `?width=${width}&quality=${quality || 75}&format=webp`;
    }
    return src;
  }

  // Si es una imagen local de /imagenes-web/ que sabemos está replicada en el bucket de Supabase
  if (src.startsWith('/imagenes-web/')) {
    return `${supabaseUrl}/storage/v1/render/image/public${src}?width=${width}&quality=${quality || 75}&format=webp`;
  }

  // Para otros assets locales (ej. /assets/logos), devolvemos la ruta original (carga directa sin optimizar)
  return src;
}
