import urllib.request
import urllib.parse
import json

ACCESS_TOKEN = "EAAgQyrZAs2TIBScZAWHZA32nZABzJK5PSushrlfMaehNvv7Y2OAjRZAP4jK6i8KQgHu7kKdYg6KVb9TdaBB1ky3DZAOO6EPpHUR8kprUjFzE4YSUK17y4BeEtAmrQGAl0dYFigZARnmjeZAj3Gbm2At5JPocxp5CmWETg33Ej6HJ7zZCcNBf1ZCk4dcMfbJi7A4Nst5vSrjBBnsFJhAVtjIRBAxZANnbkxmpEzyCgVsbJOLHeVeqqI3ZCjKtYFZALjyczNAXiYTi8SAZBWhrMrTn4RggZDZD"
AD_ACCOUNT_ID = "act_179839693305358"
API_VERSION = "v20.0"

def api_call(endpoint, data):
    url = f"https://graph.facebook.com/{API_VERSION}/{endpoint}"
    data['access_token'] = ACCESS_TOKEN
    encoded_data = urllib.parse.urlencode(data).encode('utf-8')
    req = urllib.request.Request(url, data=encoded_data)
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"HTTPError: {e.code} - {e.read().decode('utf-8')}")
        exit(1)

# 1. Create Campaign
print("Creating Campaign...")
campaign_data = {
    'name': '[Fase BoFu] Inception Retargeting - Admisión 2027',
    'objective': 'OUTCOME_TRAFFIC',
    'status': 'PAUSED',
    'special_ad_categories': 'NONE',
    'is_adset_budget_sharing_enabled': 'false'
}
campaign_res = api_call(AD_ACCOUNT_ID + '/campaigns', campaign_data)
campaign_id = campaign_res['id']
print(f"Campaign ID: {campaign_id}")

# 2. Create Ad Set
print("Creating Ad Set...")
targeting = {
    'custom_audiences': [
        {'id': '120250205117240041'}, # Historical
        {'id': '120250205562330041'}  # Active 2026
    ],
    'geo_locations': {'countries': ['CL']}, 
    'targeting_automation': {'advantage_audience': 0} 
}

adset_data = {
    'name': 'Retargeting Audiencias CRM (316 prospectos)',
    'campaign_id': campaign_id,
    'daily_budget': 2000, 
    'billing_event': 'IMPRESSIONS',
    'optimization_goal': 'LINK_CLICKS',
    'bid_amount': 200, # CLP
    'status': 'PAUSED',
    'targeting': json.dumps(targeting)
}

adset_res = api_call(AD_ACCOUNT_ID + '/adsets', adset_data)
adset_id = adset_res['id']
print(f"Ad Set ID: {adset_id}")

print(f"\nSUCCESS! Architecture deployed.")
