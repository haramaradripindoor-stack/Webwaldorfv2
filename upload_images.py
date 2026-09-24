import os
import requests
from dotenv import load_dotenv

load_dotenv('.env.local')

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "image/webp"
}

folder_path = "public/imagenes-web/fiestas-2026"

for filename in os.listdir(folder_path):
    if filename.endswith(".webp"):
        file_path = os.path.join(folder_path, filename)
        with open(file_path, "rb") as f:
            data = f.read()
            # Upload endpoint: POST /storage/v1/object/{bucketName}/{wildcard}
            url = f"{SUPABASE_URL}/storage/v1/object/imagenes-web/fiestas-2026/{filename}"
            res = requests.post(url, headers=headers, data=data)
            if res.status_code in [200, 201]:
                print(f"Uploaded {filename}")
            else:
                print(f"Failed to upload {filename}: {res.status_code} {res.text}")
