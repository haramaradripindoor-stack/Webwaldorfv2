import os
import requests
import json

url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
email = 'admision@colegiowaldorftrekan.cl'
new_password = 'TrekanAdmin2026!'

headers = {
    'apikey': key,
    'Authorization': f'Bearer {key}',
    'Content-Type': 'application/json'
}

# List users
res = requests.get(f"{url}/auth/v1/admin/users", headers=headers)
users = res.json()
user_id = None
for u in users.get('users', []):
    if u.get('email') == email:
        user_id = u.get('id')
        break

if not user_id:
    print("User not found, creating...")
    payload = {"email": email, "password": new_password, "email_confirm": True}
    res = requests.post(f"{url}/auth/v1/admin/users", headers=headers, json=payload)
    print(res.json())
else:
    print("User found, updating password...")
    payload = {"password": new_password}
    res = requests.put(f"{url}/auth/v1/admin/users/{user_id}", headers=headers, json=payload)
    print(res.json())
