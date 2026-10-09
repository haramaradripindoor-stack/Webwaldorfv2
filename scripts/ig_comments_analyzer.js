const token = process.env.META_ACCESS_TOKEN || "EAAgQyrZAs2TIBSqLfz5iN8tZCyhPei7kc4yZCnFHRxibGK5YFAZBWaEQDzioxtJ16K2MBC3UN8WeaXPNGdMRMPoaW02z0q2Blz2u26WDoBD61VnloKEzRIlwZAnKSZBglzRRdGKnWQEA2GP3ajFauzpzjTLTi4YXh0s2Dvl70hsnEXorCxb8SHZAQgCZAgZDZD";
const igAccountId = "17841470279792011";

async function fetchComments() {
  let commentsPool = [];
  try {
    // Obtenemos los ultimos 15 posts primero para extraer sus comentarios
    const res = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media?fields=id,comments_count,comments{text}&limit=15&access_token=${token}`);
    const data = await res.json();
    
    if (data.error) throw data.error;

    data.data.forEach(post => {
      if (post.comments && post.comments.data) {
        post.comments.data.forEach(c => {
          // Filtrar respuestas propias o spam corto si es posible
          if (c.text && c.text.length > 5) {
            commentsPool.push(c.text);
          }
        });
      }
    });

    console.log(`\n=== HECHOS MEDIDOS ===`);
    console.log(`Total de comentarios extraídos (n): ${commentsPool.length} (de las últimas 15 publicaciones)`);
    
    // Categorización básica
    let aranceles = 0;
    let ubicacion = 0;
    let cupos_admision = 0;
    let elogios = 0;
    let otros = 0;

    commentsPool.forEach(text => {
      const t = text.toLowerCase();
      if (t.includes('valor') || t.includes('precio') || t.includes('arancel') || t.includes('mensualidad')) aranceles++;
      else if (t.includes('dónde') || t.includes('ubicacion') || t.includes('dirección')) ubicacion++;
      else if (t.includes('cupo') || t.includes('admision') || t.includes('matrícula') || t.includes('postular')) cupos_admision++;
      else if (t.includes('hermoso') || t.includes('lindo') || t.includes('amor') || t.includes('gracias') || t.includes('bell')) elogios++;
      else otros++;
    });

    console.log(`- Preguntas sobre Aranceles/Valores (n): ${aranceles}`);
    console.log(`- Preguntas sobre Cupos/Admisión (n): ${cupos_admision}`);
    console.log(`- Preguntas sobre Ubicación (n): ${ubicacion}`);
    console.log(`- Elogios/Comunidad (n): ${elogios}`);
    console.log(`- Otros (n): ${otros}`);
    
    console.log(`\n=== MUESTRA DE TEXTOS (Anonimizados) ===`);
    commentsPool.slice(0, 5).forEach(c => console.log(`> "${c}"`));

  } catch (e) {
    console.error("Error fetching comments:", e.message);
  }
}

fetchComments();
