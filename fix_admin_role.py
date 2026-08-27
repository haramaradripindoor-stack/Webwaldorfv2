import os
import requests

url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
email = 'admision@colegiowaldorftrekan.cl'

headers = {
    'apikey': key,
    'Authorization': f'Bearer {key}',
    'Content-Type': 'application/json'
}

# Find user
res = requests.get(f"{url}/auth/v1/admin/users", headers=headers)
users = res.json()
user_id = None
for u in users.get('users', []):
    if u.get('email') == email:
        user_id = u.get('id')
        break

if user_id:
    # Update user metadata
    payload = {"user_metadata": {"role": "admin"}}
    res = requests.put(f"{url}/auth/v1/admin/users/{user_id}", headers=headers, json=payload)
    print("Updated role:", res.json())
else:
    print("User not found!")
