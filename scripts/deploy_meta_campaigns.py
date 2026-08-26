import urllib.request
import urllib.parse
import json
import os

AD_ACCOUNT_ID = 'act_179839693305358'
ACCESS_TOKEN = os.environ.get('META_MANAGEMENT_TOKEN')

def create_adset(campaign_id):
    url = f"https://graph.facebook.com/v20.0/{AD_ACCOUNT_ID}/adsets"
    
    # Segmentación estricta Waldorf.
    # advantage_audience = 0 asegura que Meta NO expanda la edad ni el sexo.
    targeting = json.dumps({
        'age_min': 27,
        'age_max': 48,
        'genders': [2],
        'geo_locations': {
            'countries': ['CL']
        },
        'targeting_automation': {
            'advantage_audience': 0
        }
    })
    
    data = urllib.parse.urlencode({
        'name': 'Madres_27-48_Audiencia_Estricta',
        'campaign_id': campaign_id,
        'daily_budget': '2000',
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
    print("🚀 Inyectando el Conjunto de Anuncios con Segmentación Estricta (Bypass Advantage)...")
    create_adset('120249963286270041')
