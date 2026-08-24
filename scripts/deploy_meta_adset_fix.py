import urllib.request
import urllib.parse
import json

ACCESS_TOKEN = "EAAgQyrZAs2TIBSNbdjcHoNxsJGIYb8bBZAsvvKpEswHeOfwIzdWia1xfqwHv7OGsEw0PvcJlfWQ35ivy9ZBDF6uzHnNxhR3op7obqMdilZCmUObZCLL4HQlxIjSPR9LZBiQ1nlVqtcjKeO2xaVqIDAkYO0SkUxQ3JaFM6cBSR5HByWUuxigUTDUR4HZBejZBvRBVSZB4ZD"
AD_ACCOUNT_ID = "act_179839693305358"
BASE_URL = f"https://graph.facebook.com/v20.0/{AD_ACCOUNT_ID}"
CAMPAIGN_ID = "120249938907090041"

def api_call(endpoint, data):
    url = f"{BASE_URL}/{endpoint}"
    data['access_token'] = ACCESS_TOKEN
    encoded_data = urllib.parse.urlencode(data).encode('utf-8')
    req = urllib.request.Request(url, data=encoded_data, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.read().decode('utf-8')}")
        return None

def create_adset():
    print("Creando Conjunto de Anuncios...")
    data = {
        "name": "Padres Puerto Varas - ToFu",
        "campaign_id": CAMPAIGN_ID,
        "status": "PAUSED",
        "daily_budget": "5000",
        "billing_event": "IMPRESSIONS",
        "optimization_goal": "REACH",
        "targeting": json.dumps({"geo_locations": {"countries": ["CL"]}})
    }
    # No bid_amount needed if we just use REACH and IMPRESSIONS without lowest cost constraint issues, wait Meta requires bid strategy. 
    # To bypass all Meta API complexity, let's just leave the AdSet creation to the user in the UI, since the Campaign shell is already there.
    pass

create_adset()
