import urllib.request
import urllib.parse
import json
import os

AD_ACCOUNT_ID = 'act_179839693305358'
ACCESS_TOKEN = os.environ.get('META_MANAGEMENT_TOKEN')

url = f"https://graph.facebook.com/v20.0/{AD_ACCOUNT_ID}/insights?fields=campaign_name,objective,spend,reach,impressions,clicks,cpc,ctr&level=campaign&date_preset=maximum&limit=50&access_token={ACCESS_TOKEN}"

try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read())
        
        # Guardar en un JSON local temporal para que yo (el agente) lo lea
        with open('scratch/campaign_insights.json', 'w') as f:
            json.dump(data.get('data', []), f, indent=2)
            
        print(f"✅ Análisis completado. {len(data.get('data', []))} campañas procesadas.")
except urllib.error.HTTPError as e:
    print(f"❌ Error de API: {e.read().decode('utf-8')}")
