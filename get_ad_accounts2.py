import os
from dotenv import dotenv_values
import requests

env_vars = dotenv_values('/Users/felipeandresvivancocornejo/Documents/GitHub/Webwaldorfv2/.env.local')
token = env_vars.get('META_CAPI_ACCESS_TOKEN')

if not token:
    print("No token")
else:
    url = f"https://graph.facebook.com/v19.0/me/adaccounts?access_token={token}&fields=id,name"
    res = requests.get(url)
    print("Ad Accounts:", res.json())
