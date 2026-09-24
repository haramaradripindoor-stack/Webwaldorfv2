import requests
import json

base_url = "https://ebpioebxcyjpjgiqpjaw.supabase.co/rest/v1/prospectos_outbound"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVicGlvZWJ4Y3lqcGpnaXFwamF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjY2Njk2OCwiZXhwIjoyMDk4MjQyOTY4fQ.tUy3DdyfaTybkwRUK8E5JfcMiv2NzhbSoO4ACHebBjc",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVicGlvZWJ4Y3lqcGpnaXFwamF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjY2Njk2OCwiZXhwIjoyMDk4MjQyOTY4fQ.tUy3DdyfaTybkwRUK8E5JfcMiv2NzhbSoO4ACHebBjc",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

updates = [
    {"username": "paulymoliny", "bio": "Llevo teñida la vista... musicienne 🎷 - argazkilaria 📷", "followers": 483, "calificacion_ia": "HOT"},
    {"username": "aroma_luna_aceites_esenciales", "bio": "Terapias holísticas, aceites esenciales puros y vida orgánica en Puerto Varas 🌱✨", "followers": 1240, "calificacion_ia": "HOT"},
    {"username": "casa.tallerpuertovaras", "bio": "Carpintería artesanal, juguetes de madera y diseño consciente 🪵🔨", "followers": 3100, "calificacion_ia": "HOT"}
]

for u in updates:
    url = f"{base_url}?ig_username=eq.{u['username']}"
    payload = {"bio": u["bio"], "followers": u["followers"], "calificacion_ia": u["calificacion_ia"]}
    r = requests.patch(url, headers=headers, json=payload)
    print(f"Updated {u['username']}: {r.status_code}")

