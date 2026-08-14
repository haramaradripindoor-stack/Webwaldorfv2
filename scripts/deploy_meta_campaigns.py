import os
import json
import urllib.request
import urllib.parse

# ============================================================================
# ANTIGRAVITY - META ADS DEPLOYMENT SCRIPT (ADMISION 2027)
# ============================================================================
# Este script levanta la estructura de la campaña en Meta Ads.
# Usa el token generado en la aplicación "Antigravity Trekan Ads".

ACCESS_TOKEN = "EAAgQyrZAs2TIBSNbdjcHoNxsJGIYb8bBZAsvvKpEswHeOfwIzdWia1xfqwHv7OGsEw0PvcJlfWQ35ivy9ZBDF6uzHnNxhR3op7obqMdilZCmUObZCLL4HQlxIjSPR9LZBiQ1nlVqtcjKeO2xaVqIDAkYO0SkUxQ3JaFM6cBSR5HByWUuxigUTDUR4HZBejZBvRBVSZB4ZD"
AD_ACCOUNT_ID = "act_179839693305358"
API_VERSION = "v20.0"
BASE_URL = f"https://graph.facebook.com/{API_VERSION}"

def post_request(url, payload):
    data = urllib.parse.urlencode(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())

def create_campaign():
    print("🚀 Creando Campaña 'Admisión 2027 - Refugiados del Sistema'...")
    url = f"{BASE_URL}/{AD_ACCOUNT_ID}/campaigns"
    payload = {
        "name": "[AGY] Admisión 2027 - Fase 1 (Awareness)",
        "objective": "OUTCOME_TRAFFIC",
        "status": "PAUSED",
        "special_ad_categories": "NONE",
        "is_adset_budget_sharing_enabled": "false",
        "access_token": ACCESS_TOKEN
    }
    
    status, response = post_request(url, payload)
    if status == 200:
        campaign_id = response.get('id')
        print(f"✅ Campaña creada exitosamente! ID: {campaign_id}")
        return campaign_id
    else:
        print(f"❌ Error al crear campaña: {response}")
        return None

def create_adset(campaign_id):
    print("\n🚀 Creando Conjunto de Anuncios (Segmentación Puerto Varas + Padres)...")
    url = f"{BASE_URL}/{AD_ACCOUNT_ID}/adsets"
    
    targeting = {
        "geo_locations": {
            "cities": [{"key": "2286782", "radius": 20, "distance_unit": "kilometer"}]
        },
        "age_min": 28,
        "age_max": 45,
        "flexible_spec": [
            {
                "demographics": [{"id": "6002714886772", "name": "Parents"}]
            }
        ]
    }

    payload = {
        "name": "Padres Puerto Varas - Neurodivergencia & Crianza Respetuosa",
        "campaign_id": campaign_id,
        "daily_budget": 5000,
        "billing_event": "IMPRESSIONS",
        "optimization_goal": "LINK_CLICKS",
        "bid_amount": 200,
        "status": "PAUSED",
        "targeting": json.dumps(targeting),
        "access_token": ACCESS_TOKEN
    }
    
    status, response = post_request(url, payload)
    if status == 200:
        adset_id = response.get('id')
        print(f"✅ Conjunto de anuncios creado! ID: {adset_id}")
        return adset_id
    else:
        print(f"❌ Error al crear conjunto de anuncios: {response}")
        return None

if __name__ == "__main__":
    print("Iniciando inyección de estructura de Meta Ads vía Antigravity...")
    campaign_id = create_campaign()
    if campaign_id:
        create_adset(campaign_id)
        print("\n✨ ESTRUCTURA BASE DESPLEGADA ✨")
        print("Siguiente paso: Entrar al Ads Manager y enlazar los creativos (imágenes/videos) a la campaña.")
