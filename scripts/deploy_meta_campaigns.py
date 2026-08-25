import urllib.request
import urllib.parse
import json
import os

# Credenciales
AD_ACCOUNT_ID = 'act_179839693305358'
ACCESS_TOKEN = os.environ.get('META_CAPI_ACCESS_TOKEN')

def create_campaign():
    url = f"https://graph.facebook.com/v20.0/{AD_ACCOUNT_ID}/campaigns"
    data = urllib.parse.urlencode({
        'name': '2027_Admision_Waldorf_ToFu',
        'objective': 'OUTCOME_TRAFFIC',
        'status': 'PAUSED',
        'special_ad_categories': '["NONE"]',
        'is_adset_budget_sharing_enabled': 'false',
        'access_token': ACCESS_TOKEN
    }).encode('utf-8')
    
    req = urllib.request.Request(url, data=data)
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read())
            print(f"✅ Campaña creada con ID: {result['id']}")
            return result['id']
    except urllib.error.HTTPError as e:
        print(f"❌ Error creando campaña: {e.read().decode('utf-8')}")
        return None

def create_adset(campaign_id):
    url = f"https://graph.facebook.com/v20.0/{AD_ACCOUNT_ID}/adsets"
    
    # Segmentación: Mujeres (2) de 27 a 48 años
    targeting = json.dumps({
        'age_min': 27,
        'age_max': 48,
        'genders': [2] 
    })
    
    data = urllib.parse.urlencode({
        'name': 'Madres_27-48_Audiencia',
        'campaign_id': campaign_id,
        'daily_budget': '2000', # 2000 CLP (ajustable)
        'billing_event': 'IMPRESSIONS',
        'optimization_goal': 'LINK_CLICKS',
        'bid_amount': '100',
        'status': 'PAUSED',
        'targeting': targeting,
        'access_token': ACCESS_TOKEN
    }).encode('utf-8')
    
    req = urllib.request.Request(url, data=data)
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read())
            print(f"✅ AdSet creado con ID: {result['id']}")
            return result['id']
    except urllib.error.HTTPError as e:
        print(f"❌ Error creando AdSet: {e.read().decode('utf-8')}")
        return None

if __name__ == '__main__':
    if not ACCESS_TOKEN:
        print("❌ Error: META_CAPI_ACCESS_TOKEN no encontrado en las variables de entorno.")
        exit(1)
        
    print("🚀 Iniciando despliegue en Meta Ads (Graph API)...")
    campaign_id = create_campaign()
    if campaign_id:
        create_adset(campaign_id)
