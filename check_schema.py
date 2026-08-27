import os
import requests

url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
headers = {'apikey': key, 'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}

res = requests.get(f"{url}/rest/v1/leads_admision?select=*&limit=1", headers=headers)
print(res.json())
