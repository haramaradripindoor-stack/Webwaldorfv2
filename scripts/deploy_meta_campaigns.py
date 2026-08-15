import urllib.request
import urllib.parse
import json

ACCESS_TOKEN = "EAAgQyrZAs2TIBSNbdjcHoNxsJGIYb8bBZAsvvKpEswHeOfwIzdWia1xfqwHv7OGsEw0PvcJlfWQ35ivy9ZBDF6uzHnNxhR3op7obqMdilZCmUObZCLL4HQlxIjSPR9LZBiQ1nlVqtcjKeO2xaVqIDAkYO0SkUxQ3JaFM6cBSR5HByWUuxigUTDUR4HZBejZBvRBVSZB4ZD"
AD_ACCOUNT_ID = "act_179839693305358"
API_VERSION = "v20.0"

def create_campaign():
    url = f"https://graph.facebook.com/{API_VERSION}/{AD_ACCOUNT_ID}/campaigns"
    data = {
        "name": "Trekan Admisiones 2026 - IA Outbound",
        "objective": "OUTCOME_TRAFFIC",
        "status": "PAUSED",
        "special_ad_categories": "[]",
        "is_adset_budget_sharing_enabled": "false",
        "access_token": ACCESS_TOKEN
    }
    
    encoded_data = urllib.parse.urlencode(data).encode('utf-8')
    req = urllib.request.Request(url, data=encoded_data)
    
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode('utf-8'))
        campaign_id = result.get('id')
        print(f"✅ Campaña creada exitosamente. ID: {campaign_id}")
        return campaign_id
    except urllib.error.HTTPError as e:
        print(f"❌ Error al crear campaña: {e.read().decode('utf-8')}")
        return None

def create_adset(campaign_id):
    url = f"https://graph.facebook.com/{API_VERSION}/{AD_ACCOUNT_ID}/adsets"
    
    data = {
        "name": "Trekan Padres Waldorf (Audiencia Base)",
        "campaign_id": campaign_id,
        "status": "PAUSED",
        "billing_event": "IMPRESSIONS",
        "optimization_goal": "LINK_CLICKS",
        "daily_budget": "5000", 
        "bid_amount": "200",
        "targeting": '{"geo_locations":{"countries":["CL"]}}',
        "access_token": ACCESS_TOKEN
    }
    
    encoded_data = urllib.parse.urlencode(data).encode('utf-8')
    req = urllib.request.Request(url, data=encoded_data)
    
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode('utf-8'))
        adset_id = result.get('id')
        print(f"✅ Conjunto de anuncios (AdSet) creado exitosamente. ID: {adset_id}")
        return adset_id
    except urllib.error.HTTPError as e:
        print(f"❌ Error al crear AdSet: {e.read().decode('utf-8')}")
        return None

if __name__ == "__main__":
    print("Iniciando despliegue de arquitectura en Meta Ads...")
    campaign_id = create_campaign()
    if campaign_id:
        create_adset(campaign_id)
