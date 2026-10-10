const token = process.env.META_ACCESS_TOKEN || "EAAgQyrZAs2TIBSqLfz5iN8tZCyhPei7kc4yZCnFHRxibGK5YFAZBWaEQDzioxtJ16K2MBC3UN8WeaXPNGdMRMPoaW02z0q2Blz2u26WDoBD61VnloKEzRIlwZAnKSZBglzRRdGKnWQEA2GP3ajFauzpzjTLTi4YXh0s2Dvl70hsnEXorCxb8SHZAQgCZAgZDZD";
const adAccountId = "act_179839693305358";
const campaignId = "120250826194830041"; // [ANTIGRAVITY] Captura Admisión 2027 (Mensajes)
const pageId = "593570633832768";

async function createRetargetingAdSet() {
  console.log("Creando Grupo de Anuncios BoFu para Públicos Personalizados...");
  
  const targeting = {
    geo_locations: { countries: ['CL'] },
    targeting_automation: { advantage_audience: 0 },
    publisher_platforms: ['instagram'],
    instagram_positions: ['stream', 'story', 'reels'],
    custom_audiences: [
      { id: "120250205562330041" }, // Prospectos Activos 2026
      { id: "120250205117240041" }  // Audiencia Historica 2024-2027
    ]
  };

  const res = await fetch(`https://graph.facebook.com/v21.0/${adAccountId}/adsets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: token,
      name: '🎯 Fase BoFu: Retargeting (Prospectos + Exámenes Libres)',
      campaign_id: campaignId,
      status: 'PAUSED',
      optimization_goal: 'CONVERSATIONS',
      billing_event: 'IMPRESSIONS',
      bid_amount: 200,
      daily_budget: 3000, // Presupuesto ligeramente menor para retargeting
      destination_type: 'INSTAGRAM_DIRECT',
      promoted_object: { page_id: pageId },
      targeting: targeting
    })
  });

  const data = await res.json();
  if (data.error) console.error("Error creando AdSet:", JSON.stringify(data.error));
  else console.log("✅ AdSet de Retargeting creado exitosamente. ID:", data.id);
}
createRetargetingAdSet();
