from PIL import Image
import os
import urllib.request
import json

# 1. Compress and copy the drone image
src = '/Users/felipeandresvivancocornejo/Downloads/Comunicaciones/Banners principales y encabezados (Tomas aéreas con dron)/DJI_0007.jpg'
dest = './public/imagenes-web/fiestas-2026/drone_patrias.webp'

print("Compressing image...")
img = Image.open(src)
img.save(dest, format='WEBP', quality=80)
print(f"Saved {dest}")

# 2. Update Supabase
url = 'https://ebpioebxcyjpjgiqpjaw.supabase.co/rest/v1/noticias?slug=eq.2026-09-22-celebracion-fiestas-patrias-comunidad'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVicGlvZWJ4Y3lqcGpnaXFwamF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjY2Njk2OCwiZXhwIjoyMDk4MjQyOTY4fQ.tUy3DdyfaTybkwRUK8E5JfcMiv2NzhbSoO4ACHebBjc'

data = json.dumps({'image_url': '/imagenes-web/fiestas-2026/drone_patrias.webp'}).encode('utf-8')
req = urllib.request.Request(url, data=data, method='PATCH')
req.add_header('apikey', key)
req.add_header('Authorization', f'Bearer {key}')
req.add_header('Content-Type', 'application/json')

try:
    response = urllib.request.urlopen(req)
    print("Supabase updated:", response.status)
except Exception as e:
    print("Error updating Supabase:", e)

