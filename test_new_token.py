import os
import requests
import re

new_token = "EAAgQyrZAs2TIBSeTzzxxZCJlJofGkUhWdtPDL68ZBPjDZA9jd9bnrM9RjK5mLEaASYXZCQHycdnYSiAASAyRbZCMzgEHN7fTyK96HDEGwZAdVv5P3dbsKHenI1un4hCjqp37xTEXY7HOZCj95PT2ZA1XZCbdm4mlfyZCDxxaFHsB0H5mDbZBouNiBCrZBauW6BOrp6BVGFuZAVCEwGBUzpcO7KwKPXEcUP37bf4y4GfjoWHvZAOZC6uNovz0sFevqxGcftAhAoYl70DUCA5oPl9uLBN3OZCcZD"

# Update .env.local
env_path = '/Users/felipeandresvivancocornejo/Documents/GitHub/Webwaldorfv2/.env.local'
with open(env_path, 'r') as f:
    content = f.read()

content = re.sub(r'META_MANAGEMENT_TOKEN=.*', f'META_MANAGEMENT_TOKEN={new_token}', content)

with open(env_path, 'w') as f:
    f.write(content)

# Test Token and Get Ad Account
url = f"https://graph.facebook.com/v19.0/me/adaccounts?access_token={new_token}&fields=id,name"
res = requests.get(url)
print(res.json())
