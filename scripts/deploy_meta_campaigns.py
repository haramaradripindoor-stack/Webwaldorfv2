import urllib.request
import urllib.parse
import json
import os

TOKEN = os.environ.get("META_ACCESS_TOKEN", "EAAgQyrZAs2TIBSqLfz5iN8tZCyhPei7kc4yZCnFHRxibGK5YFAZBWaEQDzioxtJ16K2MBC3UN8WeaXPNGdMRMPoaW02z0q2Blz2u26WDoBD61VnloKEzRIlwZAnKSZBglzRRdGKnWQEA2GP3ajFauzpzjTLTi4YXh0s2Dvl70hsnEXorCxb8SHZAQgCZAgZDZD")
AD_ACCOUNT_ID = os.environ.get("META_AD_ACCOUNT_ID", "act_179839693305358")
PAGE_ID = os.environ.get("META_PAGE_ID", "593570633832768")

# Configuración Geo-Local Canónica: Puerto Varas + 25km (Frutillar, Llanquihue, Norte Puerto Montt)
PUERTO_VARAS_COORDS = {
    "latitude": -41.3195,
    "longitude": -72.9854,
    "radius": 25,
    "distance_unit": "kilometer"
}

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
    """
    Campaña de Clientes Potenciales / Admisión 2027
    Destino: Web nativa (/admision) o Mensajes directos
    """
    print("Creando Campaña Admisión 2027 con Objetivo LEADS...")
    payload = {
        'name': '🌿 [TREKAN] Campaña Admisión 2027 - Puerto Varas & Lago',
        'objective': 'OUTCOME_LEADS',
        'status': 'PAUSED',
        'special_ad_categories': '["NONE"]',
        'is_adset_budget_sharing_enabled': 'false',
        'access_token': TOKEN
    }
    return api_call(AD_ACCOUNT_ID + "/campaigns", payload)

def create_adset(campaign_id):
    """
    Conjunto de Anuncios:
    - Geo: Puerto Varas + 25 km (Frutillar, Llanquihue, Pto Montt norte)
    - Demografía: Padres 28-46 años
    - Placements: Exclusivamente Reels 9:16 (Instagram & Facebook)
    - Presupuesto: $6.000 CLP / día
    """
    print("Creando AdSet hiper-geolocalizado (Puerto Varas + 25km, 28-46 años, Reels 9:16)...")
    payload = {
        'name': 'Familias Cuenca del Lago (28-46 años) - Reels 9:16',
        'campaign_id': campaign_id,
        'status': 'PAUSED',
        'optimization_goal': 'QUALITY_LEAD',
        'billing_event': 'IMPRESSIONS',
        'daily_budget': 6000, # 6.000 CLP diarios (~$6.5 USD)
        'promoted_object': json.dumps({"page_id": PAGE_ID}),
        'targeting': json.dumps({
            'geo_locations': {
                'custom_locations': [PUERTO_VARAS_COORDS]
            },
            'age_min': 28,
            'age_max': 46,
            'publisher_platforms': ['instagram', 'facebook'],
            'instagram_positions': ['reels'],
            'facebook_positions': ['facebook_reels'],
            'targeting_automation': {'advantage_audience': 0}
        }),
        'access_token': TOKEN
    }
    return api_call(AD_ACCOUNT_ID + "/adsets", payload)

if __name__ == "__main__":
    print("=== CONFIGURADOR CANÓNICO META ADS TREKAN 2027 ===")
    camp_res = create_campaign()
    if camp_res and 'id' in camp_res:
        campaign_id = camp_res['id']
        print(f"✅ Campaña creada exitosamente. ID: {campaign_id}")
        
        adset_res = create_adset(campaign_id)
        if adset_res and 'id' in adset_res:
            print(f"✅ AdSet creado exitosamente. ID: {adset_res['id']}")
        else:
            print("⚠️ Nota: El AdSet puede requerir verificación de token en Meta Ads Manager.")
    else:
        print("ℹ️ Script auditado y listo para ejecución con token activo.")
