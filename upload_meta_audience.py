import requests
import json
import hashlib
import pandas as pd
import time
import re

ACCESS_TOKEN = "EAAgQyrZAs2TIBSeTzzxxZCJlJofGkUhWdtPDL68ZBPjDZA9jd9bnrM9RjK5mLEaASYXZCQHycdnYSiAASAyRbZCMzgEHN7fTyK96HDEGwZAdVv5P3dbsKHenI1un4hCjqp37xTEXY7HOZCj95PT2ZA1XZCbdm4mlfyZCDxxaFHsB0H5mDbZBouNiBCrZBauW6BOrp6BVGFuZAVCEwGBUzpcO7KwKPXEcUP37bf4y4GfjoWHvZAOZC6uNovz0sFevqxGcftAhAoYl70DUCA5oPl9uLBN3OZCcZD"
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
    # Remove accents and non-alphabetical chars
    name = re.sub(r'[^a-z]', '', name)
    return name

# 1. Create the Custom Audience
url_create = f"https://graph.facebook.com/{API_VERSION}/{AD_ACCOUNT_ID}/customaudiences"
payload_create = {
    'name': 'Audiencia Histórica Trekan (1ro a 8vo 2027)',
    'subtype': 'CUSTOM',
    'description': 'Filtrado biológico y pedagógico de prospectos 2024',
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

# 2. Process Excel and Hash Data
df = pd.read_excel('/Users/felipeandresvivancocornejo/Desktop/Trekan_Audiencia_Historica_Meta_Ads.xlsx')

schema = ['EMAIL', 'PHONE', 'FN', 'LN']
data_rows = []

for index, row in df.iterrows():
    email = row.get('email', '')
    phone = clean_phone(row.get('phone', ''))
    fn = clean_name(row.get('fn', ''))
    ln = clean_name(row.get('ln', ''))
    
    hashed_row = [
        hash_data(email) if email else '',
        hash_data(phone) if phone else '',
        hash_data(fn) if fn else '',
        hash_data(ln) if ln else ''
    ]
    data_rows.append(hashed_row)

# 3. Upload Data to the Custom Audience
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
