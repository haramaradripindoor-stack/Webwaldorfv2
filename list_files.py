import os
import requests
from dotenv import load_dotenv

load_dotenv('.env.local')

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

payload = {"prefix": "fiestas-2026", "limit": 100, "offset": 0, "sortBy": {"column": "name", "order": "asc"}}
res = requests.post(f"{SUPABASE_URL}/storage/v1/object/list/imagenes-web", headers=headers, json=payload)
print(res.json())
