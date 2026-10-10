import urllib.request
import urllib.parse
import json
import os

TOKEN = os.environ.get("META_ACCESS_TOKEN", "EAAgQyrZAs2TIBSqLfz5iN8tZCyhPei7kc4yZCnFHRxibGK5YFAZBWaEQDzioxtJ16K2MBC3UN8WeaXPNGdMRMPoaW02z0q2Blz2u26WDoBD61VnloKEzRIlwZAnKSZBglzRRdGKnWQEA2GP3ajFauzpzjTLTi4YXh0s2Dvl70hsnEXorCxb8SHZAQgCZAgZDZD")
AD_ACCOUNT_ID = "act_179839693305358"
PAGE_ID = "593570633832768"
CAMPAIGN_ID = "120250826194830041" # The one I just created

def api_call(endpoint, payload):
    url = f"https://graph.facebook.com/v21.0/{endpoint}"
    data = urllib.parse.urlencode(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error: {e.read().decode()}")
        return None

print("Intentando crear el AdSet nuevamente con los parámetros de Destino correctos...")
payload = {
    'name': 'Audiencia IG Direct (Fase ToFu/BoFu)',
    'campaign_id': CAMPAIGN_ID,
    'status': 'PAUSED',
    'optimization_goal': 'CONVERSATIONS',
    'billing_event': 'IMPRESSIONS',
    'bid_amount': 200,
    'daily_budget': 5000,
    'destination_type': 'INSTAGRAM_DIRECT',
    'promoted_object': json.dumps({"page_id": PAGE_ID}),
    'targeting': json.dumps({
        'geo_locations': {'countries': ['CL']},
        'targeting_automation': {'advantage_audience': 0},
        'publisher_platforms': ['instagram'],
        'instagram_positions': ['stream', 'story', 'reels']
    }),
    'access_token': TOKEN
}
adset_res = api_call(AD_ACCOUNT_ID + "/adsets", payload)
if adset_res and 'id' in adset_res:
    print(f"✅ AdSet creado exitosamente. ID: {adset_res['id']}")
