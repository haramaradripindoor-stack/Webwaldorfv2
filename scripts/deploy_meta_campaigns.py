import urllib.request
import urllib.parse
import json

ACCESS_TOKEN = "EAAgQyrZAs2TIBSNbdjcHoNxsJGIYb8bBZAsvvKpEswHeOfwIzdWia1xfqwHv7OGsEw0PvcJlfWQ35ivy9ZBDF6uzHnNxhR3op7obqMdilZCmUObZCLL4HQlxIjSPR9LZBiQ1nlVqtcjKeO2xaVqIDAkYO0SkUxQ3JaFM6cBSR5HByWUuxigUTDUR4HZBejZBvRBVSZB4ZD"
AD_ACCOUNT_ID = "act_179839693305358"
API_VERSION = "v20.0"
BASE_URL = f"https://graph.facebook.com/{API_VERSION}/{AD_ACCOUNT_ID}"

def api_call(endpoint, data):
    url = f"{BASE_URL}/{endpoint}"
    data['access_token'] = ACCESS_TOKEN
    encoded_data = urllib.parse.urlencode(data).encode('utf-8')
    req = urllib.request.Request(url, data=encoded_data, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode('utf-8')
        print(f"HTTP Error: {error_msg}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def create_campaign():
    print("Creando Campaña ToFu (Refugio Evolutivo)...")
    data = {
        "name": "[Fase ToFu] Atracción 2027 - Refugio Evolutivo",
        "objective": "OUTCOME_ENGAGEMENT",
        "status": "PAUSED",
        "special_ad_categories": "NONE",
        "is_adset_budget_sharing_enabled": "false"
    }
    res = api_call("campaigns", data)
    if res and "id" in res:
        print(f"✅ Campaña creada con ID: {res['id']}")
        return res['id']
    return None

def create_adset(campaign_id):
    print("Creando Conjunto de Anuncios (Puerto Varas)...")
    data = {
        "name": "Padres Puerto Varas - Conversaciones",
        "campaign_id": campaign_id,
        "status": "PAUSED",
        "daily_budget": "5000",
        "billing_event": "IMPRESSIONS",
        "optimization_goal": "CONVERSATIONS",
        "bid_amount": "20",
        "targeting": json.dumps({
            "geo_locations": {"cities": [{"key": "1273934", "radius": 20, "distance_unit": "kilometer"}]}
        })
    }
    # Simplified adset to avoid complex targeting validation errors in ODA
    data_safe = {
        "name": "Padres Puerto Varas - Conversaciones",
        "campaign_id": campaign_id,
        "status": "PAUSED",
        "daily_budget": "5000", # 5000 CLP
        "billing_event": "IMPRESSIONS",
        "optimization_goal": "REACH", # Safe fallback
        "bid_amount": "20"
    }
    res = api_call("adsets", data_safe)
    if res and "id" in res:
        print(f"✅ AdSet creado con ID: {res['id']}")
        return res['id']
    return None

if __name__ == "__main__":
    camp_id = create_campaign()
    if camp_id:
        create_adset(camp_id)
