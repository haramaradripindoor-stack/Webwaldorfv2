const token = "EAAgQyrZAs2TIBSrgO8KJJEz15BHAEQZCPiuSTY0hp3pHFKcvnIYZBYFyPTLZA6CxahghZATJIOVihv5CUnWQ6wHMabf3QtldrrOVRAMrhLEkwU0H7ZByGi7yHk5DiUNJJTJzABRpE6MlAnR2ZBSk9pZA8WcxyZAaW2TPqsqNYK8V8bhqbzTZAZBS14TPjlcxaNfiihr9jJsCYBMqpDSJNnvC4T78WKj8JBzlC3zM5rDMXIzJJRS8YViFGynqYIbVwW0jZBuYNIUuO04GOABPCOxvYgZDZD";
const igAccountId = "17841470279792011";

async function runAnalyst() {
  console.log("🕵️ Iniciando Analista de Datos de Antigravity (Nuevo Token)...");
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media?fields=id,caption,media_type,like_count,comments_count,timestamp,insights.metric(reach,impressions)&limit=3&access_token=${token}`);
    const data = await res.json();
    
    if (data.error) {
      console.error("Error de Meta API:", JSON.stringify(data.error, null, 2));
      return;
    }

    console.log("✅ Conexión Exitosa. Datos obtenidos:");
    data.data.forEach((post, i) => {
      const shortCaption = post.caption ? post.caption.substring(0, 40).replace(/\n/g, ' ') + '...' : '[Sin Texto]';
      const date = new Date(post.timestamp).toLocaleString('es-CL', {timeZone: 'America/Santiago'});
      console.log(`\n[${i+1}] ${post.media_type} - ${date}`);
      console.log(`📝 "${shortCaption}"`);
      console.log(`❤️ Likes: ${post.like_count} | 💬 Comentarios: ${post.comments_count}`);
      
      if(post.insights) {
          console.log(`📈 Insights extraídos exitosamente!`);
      }
    });
    
  } catch(e) {
    console.error("Fallo la conexión:", e);
  }
}

runAnalyst();
