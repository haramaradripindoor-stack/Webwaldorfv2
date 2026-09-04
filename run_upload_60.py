import requests
import json
import hashlib
import pandas as pd
import re

ACCESS_TOKEN = "EAAgQyrZAs2TIBScZAWHZA32nZABzJK5PSushrlfMaehNvv7Y2OAjRZAP4jK6i8KQgHu7kKdYg6KVb9TdaBB1ky3DZAOO6EPpHUR8kprUjFzE4YSUK17y4BeEtAmrQGAl0dYFigZARnmjeZAj3Gbm2At5JPocxp5CmWETg33Ej6HJ7zZCcNBf1ZCk4dcMfbJi7A4Nst5vSrjBBnsFJhAVtjIRBAxZANnbkxmpEzyCgVsbJOLHeVeqqI3ZCjKtYFZALjyczNAXiYTi8SAZBWhrMrTn4RggZDZD"
AD_ACCOUNT_ID = "act_179839693305358"
API_VERSION = "v19.0"

def hash_data(data):
    if pd.isna(data) or str(data).strip() == '':
        return ''
    return hashlib.sha256(str(data).strip().lower().encode('utf-8')).hexdigest()

def clean_phone(phone):
    if pd.isna(phone): return ''
    phone = str(phone).replace('+', '').replace(' ', '').replace('.0', '').strip()
    if phone.startswith('9') and len(phone) == 9:
        phone = '56' + phone
    return phone

def clean_name(name):
    if pd.isna(name): return ''
    name = str(name).lower().strip()
    name = re.sub(r'[^a-z]', '', name)
    return name

# 1. Create Audience
url_create = f"https://graph.facebook.com/{API_VERSION}/{AD_ACCOUNT_ID}/customaudiences"
payload_create = {
    'name': 'Prospectos Activos Trekan (2026)',
    'subtype': 'CUSTOM',
    'description': 'Leads calientes exportados desde el CRM',
    'customer_file_source': 'USER_PROVIDED_ONLY',
    'access_token': ACCESS_TOKEN
}

res_create = requests.post(url_create, data=payload_create)
res_json = res_create.json()

if 'id' not in res_json:
    print("Error creating audience:", res_json)
    exit(1)

audience_id = res_json['id']
print(f"Created Audience with ID: {audience_id}")

# 2. Process Excel
df = pd.read_excel('/Users/felipeandresvivancocornejo/Desktop/Trekan_Audiencia_Meta_Ads.xlsx')

schema = ['EMAIL', 'PHONE', 'FN', 'LN']
data_rows = []

for index, row in df.iterrows():
    # According to yesterday's script, columns were email, phone, firstname, lastname
    # Let's handle variations just in case
    email = row.get('email', row.get('Email', ''))
    phone = clean_phone(row.get('phone', row.get('Phone', '')))
    fn = clean_name(row.get('firstname', row.get('fn', '')))
    ln = clean_name(row.get('lastname', row.get('ln', '')))
    
    hashed_row = [
        hash_data(email) if email else '',
        hash_data(phone) if phone else '',
        hash_data(fn) if fn else '',
        hash_data(ln) if ln else ''
    ]
    data_rows.append(hashed_row)

# 3. Upload Data
url_upload = f"https://graph.facebook.com/{API_VERSION}/{audience_id}/users"
payload_upload = {
    'payload': json.dumps({
        'schema': schema,
        'data': data_rows
    }),
    'access_token': ACCESS_TOKEN
}

res_upload = requests.post(url_upload, data=payload_upload)
print("Upload Result:", res_upload.json())
