import json
import urllib.request
import urllib.error
from urllib.parse import urlencode

ACCESS_TOKEN = "EAAgQyrZAs2TIBSNbdjcHoNxsJGIYb8bBZAsvvKpEswHeOfwIzdWia1xfqwHv7OGsEw0PvcJlfWQ35ivy9ZBDF6uzHnNxhR3op7obqMdilZCmUObZCLL4HQlxIjSPR9LZBiQ1nlVqtcjKeO2xaVqIDAkYO0SkUxQ3JaFM6cBSR5HByWUuxigUTDUR4HZBejZBvRBVSZB4ZD"
AD_ACCOUNT_ID = "act_179839693305358"
GRAPH_API_URL = f"https://graph.facebook.com/v20.0/{AD_ACCOUNT_ID}"

def send_request(endpoint, payload):
    data = urlencode(payload).encode('utf-8')
    url = f"{GRAPH_API_URL}/{endpoint}?access_token={ACCESS_TOKEN}"
    req = urllib.request.Request(url, data=data, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode('utf-8')
            return json.loads(res_data)
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode('utf-8')
        print(f"HTTPError: {e.code} - {error_msg}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def create_campaign():
    print("Creando Campaña en Meta Ads...")
    payload = {
        "name": "Trekan 2026 - Captación Admisiones",
        "objective": "OUTCOME_TRAFFIC",
        "status": "PAUSED",
        "special_ad_categories": "NONE",
        "is_adset_budget_sharing_enabled": "false"  # Requerido por v20.0+ para CBO desactivado
    }
    
    result = send_request("campaigns", payload)
    if result and "id" in result:
        print(f"✅ Campaña Creada exitosamente. ID: {result['id']}")
        return result['id']
    else:
        print("❌ Falla al crear la campaña.")
        return None

def create_adset(campaign_id):
    print("Creando AdSet (Conjunto de Anuncios)...")
    payload = {
        "name": "Padres Puerto Varas - Tráfico Admisión",
        "campaign_id": campaign_id,
        "status": "PAUSED",
        "daily_budget": "5000",  # 5,000 CLP diarios (Modificar después en UI si necesario)
        "billing_event": "IMPRESSIONS",
        "optimization_goal": "LINK_CLICKS",
        "bid_amount": "200",
        "targeting": json.dumps({
            "geo_locations": {"countries": ["CL"], "cities": [{"key": "1273934", "radius": 20, "distance_unit": "kilometer"}]}, # Puerto Varas aproximado
            "age_min": 25,
            "age_max": 50,
            "targeting_automation": {"advantage_audience": 0}
        }),
        "promoted_object": json.dumps({
            "pixel_id": "1351193506984796", # El Pixel del Trekan
            "custom_event_type": "LEAD"
        }),
        "destination_type": "WEBSITE"
    }
    
    result = send_request("adsets", payload)
    if result and "id" in result:
        print(f"✅ AdSet Creado exitosamente. ID: {result['id']}")
        return result['id']
    else:
        print("❌ Falla al crear el AdSet.")
        return None

if __name__ == "__main__":
    print("--- INICIANDO DESPLIEGUE META ADS ---")
    camp_id = create_campaign()
    if camp_id:
        adset_id = create_adset(camp_id)
        if adset_id:
            print("\n🚀 ¡Despliegue estructural completado!")
            print("Instrucción al usuario: Ve a tu Administrador de Anuncios. Las campañas están PAUSADAS.")
            print("Solo necesitas seleccionar el AdSet y crear/enlazar el Anuncio visual (Video/Imagen).")
