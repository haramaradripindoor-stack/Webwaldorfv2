import urllib.request
import urllib.parse
import json

ACCESS_TOKEN = 'EAAgQyrZAs2TIBSNbdjcHoNxsJGIYb8bBZAsvvKpEswHeOfwIzdWia1xfqwHv7OGsEw0PvcJlfWQ35ivy9ZBDF6uzHnNxhR3op7obqMdilZCmUObZCLL4HQlxIjSPR9LZBiQ1nlVqtcjKeO2xaVqIDAkYO0SkUxQ3JaFM6cBSR5HByWUuxigUTDUR4HZBejZBvRBVSZB4ZD'
AD_ACCOUNT_ID = 'act_179839693305358'
API_VERSION = 'v20.0'
BASE_URL = f'https://graph.facebook.com/{API_VERSION}/{AD_ACCOUNT_ID}'

def make_request(endpoint, data):
    url = f'{BASE_URL}/{endpoint}'
    data['access_token'] = ACCESS_TOKEN
    encoded_data = urllib.parse.urlencode(data).encode('utf-8')
    req = urllib.request.Request(url, data=encoded_data, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode('utf-8')
        print(f"HTTPError: {e.code} - {error_msg}")
        return None

def create_adset(campaign_id):
    targeting = {
        'geo_locations': {
            'custom_locations': [{
                'latitude': -41.319460,
                'longitude': -72.985380,
                'radius': 15,
                'distance_unit': 'kilometer'
            }]
        },
        'genders': [2],
        'age_min': 28,
        'age_max': 45,
        'targeting_automation': {'advantage_audience': 0}
    }
    
    data = {
        'name': 'AdSet: Madres 28-45 - Puerto Varas',
        'campaign_id': campaign_id,
        'daily_budget': 3000,
        'billing_event': 'IMPRESSIONS',
        'optimization_goal': 'LINK_CLICKS',
        'bid_strategy': 'LOWEST_COST_WITHOUT_CAP',
        'status': 'PAUSED',
        'targeting': json.dumps(targeting),
    }
    
    return make_request('adsets', data)

adset_response = create_adset('120250107870620041')
if adset_response and 'id' in adset_response:
    print(f"AdSet creado con ID: {adset_response['id']}")
