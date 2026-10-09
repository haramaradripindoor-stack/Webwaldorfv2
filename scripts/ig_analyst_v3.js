const token = process.env.META_ACCESS_TOKEN || "EAAgQyrZAs2TIBSqLfz5iN8tZCyhPei7kc4yZCnFHRxibGK5YFAZBWaEQDzioxtJ16K2MBC3UN8WeaXPNGdMRMPoaW02z0q2Blz2u26WDoBD61VnloKEzRIlwZAnKSZBglzRRdGKnWQEA2GP3ajFauzpzjTLTi4YXh0s2Dvl70hsnEXorCxb8SHZAQgCZAgZDZD";
const igAccountId = "17841470279792011";

async function runAnalyst() {
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media?fields=id,caption,media_type,like_count,comments_count,timestamp,insights.metric(reach,impressions)&limit=15&access_token=${token}`);
    const data = await res.json();
    
    if (data.error) {
      console.error(JSON.stringify(data.error));
      return;
    }

    console.log(JSON.stringify(data.data, null, 2));
  } catch(e) {
    console.error(e);
  }
}
runAnalyst();
