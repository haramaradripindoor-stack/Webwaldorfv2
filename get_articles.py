import os
import requests
import json

url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
headers = {'apikey': key, 'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}

res = requests.get(f"{url}/rest/v1/noticias?select=id,slug,title", headers=headers)
print(json.dumps(res.json(), indent=2))
