import os
import requests
from dotenv import load_dotenv

load_dotenv(".env.local")
url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
headers = {'apikey': key, 'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}

with open('_noticias/2026-10-06-limites-respeto-corresponsabilidad-comunidad-waldorf.md', 'r') as f:
    full_content = f.read()

payload = {
    "title": "El arte de ser comunidad: La madurez adulta y el cuidado del organismo escolar",
    "slug": "2026-10-06-limites-respeto-corresponsabilidad-comunidad-waldorf",
    "excerpt": "Una escuela Waldorf no es una empresa de servicios, sino un organismo vivo. Construir comunidad exige corresponsabilidad, comunicación sana y la voluntad de educar a través de nuestro propio ejemplo como adultos.",
    "content": full_content,
    "published_at": "2026-10-06",
    "image_url": "/imagenes-web/galeria5.webp"
}

res = requests.post(f"{url}/rest/v1/noticias", headers=headers, json=payload)
print(res.status_code, res.text)
