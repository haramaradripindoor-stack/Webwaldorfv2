import urllib.request
import urllib.parse
import json
import os

TOKEN = os.environ.get("META_ACCESS_TOKEN", "EAAgQyrZAs2TIBSqLfz5iN8tZCyhPei7kc4yZCnFHRxibGK5YFAZBWaEQDzioxtJ16K2MBC3UN8WeaXPNGdMRMPoaW02z0q2Blz2u26WDoBD61VnloKEzRIlwZAnKSZBglzRRdGKnWQEA2GP3ajFauzpzjTLTi4YXh0s2Dvl70hsnEXorCxb8SHZAQgCZAgZDZD")
AD_ACCOUNT_ID = "act_179839693305358"
PAGE_ID = "593570633832768"

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

def create_campaign():
    print("Creando Campaña 2027 con Objetivo de MENSAJES (Engagement)...")
    payload = {
        'name': '🤖 [ANTIGRAVITY] Captura Admisión 2027 (Mensajes)',
        'objective': 'OUTCOME_ENGAGEMENT',
        'status': 'PAUSED',
        'special_ad_categories': '["NONE"]',
        'is_adset_budget_sharing_enabled': 'false',
        'access_token': TOKEN
    }
    return api_call(AD_ACCOUNT_ID + "/campaigns", payload)

def create_adset(campaign_id):
    print("Creando Conjunto de Anuncios enfocado en Iniciar Conversaciones...")
    payload = {
        'name': 'Audiencia Lookalike / Intereses Waldorf (IG Direct)',
        'campaign_id': campaign_id,
        'status': 'PAUSED',
        'optimization_goal': 'CONVERSATIONS',
        'billing_event': 'IMPRESSIONS',
        'bid_amount': 200,
        'daily_budget': 5000, # 5000 CLP
        'promoted_object': json.dumps({"page_id": PAGE_ID}),
        'targeting': json.dumps({
            'geo_locations': {'countries': ['CL']},
            'targeting_automation': {'advantage_audience': 0},
            'publisher_platforms': ['instagram'],
            'instagram_positions': ['stream', 'story', 'reels']
        }),
        'access_token': TOKEN
    }
    return api_call(AD_ACCOUNT_ID + "/adsets", payload)

if __name__ == "__main__":
    camp_res = create_campaign()
    if camp_res and 'id' in camp_res:
        campaign_id = camp_res['id']
        print(f"✅ Campaña creada exitosamente. ID: {campaign_id}")
        
        adset_res = create_adset(campaign_id)
        if adset_res and 'id' in adset_res:
            print(f"✅ AdSet creado exitosamente. ID: {adset_res['id']}")
        else:
            print("❌ Falló la creación del AdSet.")
    else:
        print("❌ Falló la creación de la Campaña.")
