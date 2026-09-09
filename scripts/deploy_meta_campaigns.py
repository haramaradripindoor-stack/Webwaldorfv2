import urllib.request
import urllib.parse
import json
import ssl

# Desactivar verificación estricta de SSL local si hay problemas
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

ACCESS_TOKEN = "EAAgQyrZAs2TIBSNbdjcHoNxsJGIYb8bBZAsvvKpEswHeOfwIzdWia1xfqwHv7OGsEw0PvcJlfWQ35ivy9ZBDF6uzHnNxhR3op7obqMdilZCmUObZCLL4HQlxIjSPR9LZBiQ1nlVqtcjKeO2xaVqIDAkYO0SkUxQ3JaFM6cBSR5HByWUuxigUTDUR4HZBejZBvRBVSZB4ZD"
AD_ACCOUNT_ID = "act_179839693305358"
GRAPH_URL = "https://graph.facebook.com/v20.0"

def create_campaign():
    print("Creando Campaña...")
    url = f"{GRAPH_URL}/{AD_ACCOUNT_ID}/campaigns"
    
    payload = {
        "name": "Captura Admisión 2027 (Tardes de Té)",
        "objective": "OUTCOME_TRAFFIC",
        "status": "PAUSED",
        "special_ad_categories": ["NONE"],
        "is_adset_budget_sharing_enabled": "false",
        "access_token": ACCESS_TOKEN
    }
    
    data = urllib.parse.urlencode(payload, doseq=True).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST')
    
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            res = json.loads(response.read().decode())
            print(f"✅ Campaña creada exitosamente. ID: {res['id']}")
            return res['id']
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode()
        print(f"❌ Error al crear campaña: {error_msg}")
        return None

def create_adset(campaign_id):
    print("\nCreando Conjunto de Anuncios (AdSet)...")
    url = f"{GRAPH_URL}/{AD_ACCOUNT_ID}/adsets"
    
    # Segmentación estricta (Chile, excluyendo "advantage_audience")
    targeting = {
        "geo_locations": {"countries": ["CL"]},
        "targeting_automation": {"advantage_audience": 0}
    }
    
    payload = {
        "name": "Audiencia Base - Puerto Varas y Alrededores",
        "campaign_id": campaign_id,
        "daily_budget": "5000", # Moneda local (CLP)
        "billing_event": "IMPRESSIONS",
        "optimization_goal": "LINK_CLICKS",
        "bid_amount": "200", # Requisito crítico para evitar OAuthException 100
        "status": "PAUSED",
        "targeting": json.dumps(targeting),
        "access_token": ACCESS_TOKEN
    }
    
    data = urllib.parse.urlencode(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST')
    
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            res = json.loads(response.read().decode())
            print(f"✅ AdSet creado exitosamente. ID: {res['id']}")
            return res['id']
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode()
        print(f"❌ Error al crear AdSet: {error_msg}")
        return None

if __name__ == "__main__":
    campaign_id = create_campaign()
    if campaign_id:
        create_adset(campaign_id)
