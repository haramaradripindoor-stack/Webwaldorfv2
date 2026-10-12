const token = process.env.META_ACCESS_TOKEN || "EAAgQyrZAs2TIBSqLfz5iN8tZCyhPei7kc4yZCnFHRxibGK5YFAZBWaEQDzioxtJ16K2MBC3UN8WeaXPNGdMRMPoaW02z0q2Blz2u26WDoBD61VnloKEzRIlwZAnKSZBglzRRdGKnWQEA2GP3ajFauzpzjTLTi4YXh0s2Dvl70hsnEXorCxb8SHZAQgCZAgZDZD";
const igAccountId = "17841470279792011";

async function run() {
  try {
    console.log("Consultando Stories activas e Insights...");
    const res = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/stories?fields=id,caption,media_type,timestamp,insights.metric(impressions,reach,replies,shares,taps_forward,taps_back,exits)&access_token=${token}`);
    const data = await res.json();
    console.log("Stories API Response:", JSON.stringify(data, null, 2));

    // También consultemos los highlights / destacadas o media reciente
    const resMedia = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media?fields=id,caption,timestamp,insights.metric(reach,impressions,saved,shares)&limit=3&access_token=${token}`);
    const dataMedia = await resMedia.json();
    console.log("Media reciente:", JSON.stringify(dataMedia, null, 2));

  } catch(e) {
    console.error("Error:", e.message);
  }
}
run();
