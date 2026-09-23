import urllib.request
import json

url = 'https://ebpioebxcyjpjgiqpjaw.supabase.co/rest/v1/noticias?slug=eq.2026-09-22-celebracion-fiestas-patrias-comunidad'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVicGlvZWJ4Y3lqcGpnaXFwamF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjY2Njk2OCwiZXhwIjoyMDk4MjQyOTY4fQ.tUy3DdyfaTybkwRUK8E5JfcMiv2NzhbSoO4ACHebBjc'

req = urllib.request.Request(url, method='GET')
req.add_header('apikey', key)
req.add_header('Authorization', f'Bearer {key}')

try:
    response = urllib.request.urlopen(req)
    data = json.loads(response.read())
    print("Supabase Data:", data)
except Exception as e:
    print("Error:", e)
