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

  // Todos los assets locales (/imagenes-web, /assets, /brand, etc.) se sirven directo desde el CDN local / Vercel
  return src;
}
