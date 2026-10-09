const fs = require('fs');
const xlsx = require('xlsx');

const token = process.env.META_ACCESS_TOKEN || "EAAgQyrZAs2TIBSqLfz5iN8tZCyhPei7kc4yZCnFHRxibGK5YFAZBWaEQDzioxtJ16K2MBC3UN8WeaXPNGdMRMPoaW02z0q2Blz2u26WDoBD61VnloKEzRIlwZAnKSZBglzRRdGKnWQEA2GP3ajFauzpzjTLTi4YXh0s2Dvl70hsnEXorCxb8SHZAQgCZAgZDZD";
const igAccountId = "17841470279792011";

async function fetchAllMedia() {
  let mediaList = [];
  let url = `https://graph.facebook.com/v21.0/${igAccountId}/media?fields=id,caption,media_type,like_count,comments_count,timestamp&limit=50&access_token=${token}`;
  
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  console.log("Extrayendo publicaciones (Últimos 12 meses)...");

  while (url) {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.error) {
      console.error("Error API:", data.error.message);
      break;
    }

    let stop = false;
    for (const post of data.data) {
      if (new Date(post.timestamp) < oneYearAgo) {
        stop = true;
        break;
      }
      mediaList.push(post);
    }

    if (stop || !data.paging || !data.paging.next) break;
    url = data.paging.next;
  }
  
  return mediaList;
}

async function fetchInsights(mediaId, mediaType) {
  // Insights varian por tipo de medio
  let metrics = "reach,impressions,saved"; // Base
  if (mediaType === 'VIDEO') {
    metrics += ",plays,shares"; 
  } else if (mediaType === 'CAROUSEL_ALBUM' || mediaType === 'IMAGE') {
    metrics = "reach,impressions,saved,shares,profile_visits"; 
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${mediaId}/insights?metric=${metrics}&access_token=${token}`);
    const data = await res.json();
    
    let insights = {};
    if (data.data) {
      data.data.forEach(m => {
        insights[m.name] = m.values[0].value;
      });
    }
    return insights;
  } catch (e) {
    return {};
  }
}

function categorizeTheme(caption) {
  if (!caption) return "Sin clasificar";
  const text = caption.toLowerCase();
  if (text.includes("pantalla") || text.includes("tecnología")) return "Pantallas";
  if (text.includes("ritmo") || text.includes("rutina")) return "Ritmo";
  if (text.includes("leer") || text.includes("lectoescritura") || text.includes("letras")) return "Lectoescritura";
  if (text.includes("comunidad") || text.includes("minga") || text.includes("familia")) return "Comunidad";
  if (text.includes("pedagogía") || text.includes("waldorf") || text.includes("steiner")) return "Pedagogía";
  if (text.includes("evento") || text.includes("feria") || text.includes("pascua")) return "Eventos";
  return "General";
}

async function run() {
  const media = await fetchAllMedia();
  console.log(`Analizando insights de ${media.length} publicaciones...`);
  
  const processedData = [];
  
  for (const post of media) {
    const insights = await fetchInsights(post.id, post.media_type);
    const theme = categorizeTheme(post.caption);
    
    // Engagement
    const likes = post.like_count || 0;
    const comments = post.comments_count || 0;
    const saves = insights.saved || 0;
    const shares = insights.shares || 0;
    const reach = insights.reach || 1; // avoid division by 0
    
    const engagementScore = ((likes + comments + saves + shares) / reach) * 100;

    processedData.push({
      ID: post.id,
      Fecha: new Date(post.timestamp).toISOString().split('T')[0],
      Hora: new Date(post.timestamp).getHours(),
      Formato: post.media_type,
      Tema: theme,
      Alcance: insights.reach || 0,
      Impresiones: insights.impressions || 0,
      Vistas_Plays: insights.plays || 0,
      Likes: likes,
      Comentarios: comments,
      Guardados: saves,
      Compartidos: shares,
      Engagement_Percent: engagementScore.toFixed(2) + '%',
      // Notas sobre datos faltantes API
      Nota_API: "Visitas perfil/Nuevos follows/DMs directos limitados por API IG Graph."
    });
  }

  // Escribir a Excel (Regla Estricta: PROHIBICIÓN ABSOLUTA DE CSV)
  const ws = xlsx.utils.json_to_sheet(processedData);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Analisis_IG_Trekan");
  xlsx.writeFile(wb, "Analisis_IG_Trekan_Deep.xlsx");

  console.log("¡Análisis profundo completado!");
  console.log("Archivo Excel generado: Analisis_IG_Trekan_Deep.xlsx");
  
  // Resumen rápido para el prompt de la IA
  const themes = {};
  processedData.forEach(p => {
    if(!themes[p.Tema]) themes[p.Tema] = { count: 0, reach: [] };
    themes[p.Tema].count++;
    themes[p.Tema].reach.push(p.Alcance);
  });
  
  console.log("\nEstadísticas por Tema:");
  for (const t in themes) {
    const arr = themes[t].reach.sort((a,b)=>a-b);
    const median = arr[Math.floor(arr.length/2)];
    console.log(`- ${t}: ${themes[t].count} posts (Mediana Alcance: ${median}) ${themes[t].count < 5 ? '[Muestra insuficiente]' : ''}`);
  }
}

run();
