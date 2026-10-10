const token = process.env.META_ACCESS_TOKEN || "EAAgQyrZAs2TIBSqLfz5iN8tZCyhPei7kc4yZCnFHRxibGK5YFAZBWaEQDzioxtJ16K2MBC3UN8WeaXPNGdMRMPoaW02z0q2Blz2u26WDoBD61VnloKEzRIlwZAnKSZBglzRRdGKnWQEA2GP3ajFauzpzjTLTi4YXh0s2Dvl70hsnEXorCxb8SHZAQgCZAgZDZD";
const adAccountId = "act_179839693305358";

async function fetchAds() {
  try {
    console.log("🔍 Buscando campañas en la cuenta publicitaria...");
    const res = await fetch(`https://graph.facebook.com/v21.0/${adAccountId}/campaigns?fields=name,status,objective,start_time,stop_time&limit=5&access_token=${token}`);
    const data = await res.json();
    
    if (data.error) {
      console.error("❌ Error API Meta Ads:", data.error.message);
      return;
    }

    if (!data.data || data.data.length === 0) {
      console.log("No se encontraron campañas históricas recientes (o la cuenta está en blanco).");
      return;
    }

    console.log(`✅ Se encontraron ${data.data.length} campañas. Estado actual:\n`);
    data.data.forEach(camp => {
      console.log(`- Campaña: "${camp.name}"`);
      console.log(`  Estado: ${camp.status}`);
      console.log(`  Objetivo: ${camp.objective}`);
      console.log(`  Inicio: ${camp.start_time ? camp.start_time.split('T')[0] : 'N/A'}`);
      console.log(`  Fin: ${camp.stop_time ? camp.stop_time.split('T')[0] : 'Sin fecha de fin'}\n`);
    });

  } catch(e) {
    console.error("Fallo general:", e.message);
  }
}
fetchAds();
