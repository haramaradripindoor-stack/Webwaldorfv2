const token = "EAAgQyrZAs2TIBSuCLvOkZCRcHxhQYJ0EgSXUirJAvu3ZAmns0AfkuxPVrEM097dEgYP2HbzIm0DtZBetdKw3WXlE0rOyFgsY39UOgstDn8ZB0coVe6SMFynduw3XrIKVRocBpHRbvcNl0ZASilMi5tMq8FyyuFWfoyU11KOzh4xMIaVPu2eZCdjnn7Khm2d4EK4ActMLzkk1n5Qly9FndQSvtR434vuDL4ZAWn1jRYWRBEdvs8TZCtGCqdcgUYwNZCKaMRXUAE58FnBxeGBtisSgZDZD";
const igAccountId = "17841470279792011";

async function runAnalyst() {
  console.log("🕵️ Iniciando Analista de Datos de Antigravity (Usando Token original)...");
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media?fields=id,caption,media_type,like_count,comments_count,timestamp&limit=5&access_token=${token}`);
    const data = await res.json();
    
    if (data.error) {
      console.error("Error de Meta API:", data.error.message);
      return;
    }

    console.log("\n📊 RESUMEN DE LAS ÚLTIMAS 5 PUBLICACIONES:");
    let totalLikes = 0;
    let totalComments = 0;

    data.data.forEach((post, i) => {
      const shortCaption = post.caption ? post.caption.substring(0, 40).replace(/\n/g, ' ') + '...' : '[Sin Texto]';
      const date = new Date(post.timestamp).toLocaleString('es-CL', {timeZone: 'America/Santiago'});
      console.log(`\n[${i+1}] ${post.media_type} - ${date}`);
      console.log(`📝 "${shortCaption}"`);
      console.log(`❤️ Likes: ${post.like_count} | 💬 Comentarios: ${post.comments_count}`);
      
      totalLikes += post.like_count || 0;
      totalComments += post.comments_count || 0;
    });

    console.log(`\n💡 MÉTRICAS GLOBALES (Muestra):`);
    console.log(`Promedio de Likes por Post: ${totalLikes / data.data.length}`);
    console.log(`Promedio de Comentarios: ${totalComments / data.data.length}`);
    
  } catch(e) {
    console.error("Fallo la conexión:", e);
  }
}

runAnalyst();
