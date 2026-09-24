import requests
import json

url = "https://ebpioebxcyjpjgiqpjaw.supabase.co/rest/v1/prospectos_outbound?select=*"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVicGlvZWJ4Y3lqcGpnaXFwamF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjY2Njk2OCwiZXhwIjoyMDk4MjQyOTY4fQ.tUy3DdyfaTybkwRUK8E5JfcMiv2NzhbSoO4ACHebBjc",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVicGlvZWJ4Y3lqcGpnaXFwamF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjY2Njk2OCwiZXhwIjoyMDk4MjQyOTY4fQ.tUy3DdyfaTybkwRUK8E5JfcMiv2NzhbSoO4ACHebBjc"
}

r = requests.get(url, headers=headers)
print("Status:", r.status_code)
if r.status_code == 200:
    print(json.dumps(r.json()[:2], indent=2))
