const token = process.env.META_ACCESS_TOKEN || "EAAgQyrZAs2TIBSqLfz5iN8tZCyhPei7kc4yZCnFHRxibGK5YFAZBWaEQDzioxtJ16K2MBC3UN8WeaXPNGdMRMPoaW02z0q2Blz2u26WDoBD61VnloKEzRIlwZAnKSZBglzRRdGKnWQEA2GP3ajFauzpzjTLTi4YXh0s2Dvl70hsnEXorCxb8SHZAQgCZAgZDZD";
const adAccountId = "act_179839693305358";

async function run() {
  // 1. Fetch campaigns
  const res = await fetch(`https://graph.facebook.com/v21.0/${adAccountId}/campaigns?fields=id,name,objective&limit=10&access_token=${token}`);
  const data = await res.json();
  
  if (data.error) {
    console.error("Fetch Error:", data.error);
    return;
  }

  const targetCampaign = data.data.find(c => c.name === "Captura Admisión 2027 (Tardes de Té)");
  if (!targetCampaign) {
    console.log("No se encontró la campaña objetivo.");
    return;
  }

  console.log(`Intentando actualizar la campaña: ${targetCampaign.id} (${targetCampaign.name})`);
  console.log(`Objetivo actual: ${targetCampaign.objective}`);

  // 2. Attempt to update objective to OUTCOME_ENGAGEMENT
  const updateRes = await fetch(`https://graph.facebook.com/v21.0/${targetCampaign.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: token,
      objective: 'OUTCOME_ENGAGEMENT'
    })
  });
  
  const updateData = await updateRes.json();
  if (updateData.error) {
    console.log("\n❌ Resultado del update (esperado según reglas de Meta):");
    console.log(updateData.error.message);
  } else {
    console.log("✅ Update successful!", updateData);
  }
}
run();
