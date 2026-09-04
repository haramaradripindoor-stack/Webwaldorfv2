import requests
import json

ACCESS_TOKEN = "EAAgQyrZAs2TIBSeTzzxxZCJlJofGkUhWdtPDL68ZBPjDZA9jd9bnrM9RjK5mLEaASYXZCQHycdnYSiAASAyRbZCMzgEHN7fTyK96HDEGwZAdVv5P3dbsKHenI1un4hCjqp37xTEXY7HOZCj95PT2ZA1XZCbdm4mlfyZCDxxaFHsB0H5mDbZBouNiBCrZBauW6BOrp6BVGFuZAVCEwGBUzpcO7KwKPXEcUP37bf4y4GfjoWHvZAOZC6uNovz0sFevqxGcftAhAoYl70DUCA5oPl9uLBN3OZCcZD"
BUSINESS_ID = "1309436010470661"

# Check debug token info
url_debug = f"https://graph.facebook.com/v19.0/debug_token?input_token={ACCESS_TOKEN}&access_token={ACCESS_TOKEN}"
res = requests.get(url_debug).json()
print("Scopes:", res.get('data', {}).get('scopes', []))

url_bm = f"https://graph.facebook.com/v19.0/{BUSINESS_ID}/owned_ad_accounts?access_token={ACCESS_TOKEN}&fields=id,name"
res_bm = requests.get(url_bm).json()
print("BM Owned Ad Accounts:", res_bm)

url_client = f"https://graph.facebook.com/v19.0/{BUSINESS_ID}/client_ad_accounts?access_token={ACCESS_TOKEN}&fields=id,name"
res_client = requests.get(url_client).json()
print("BM Client Ad Accounts:", res_client)
