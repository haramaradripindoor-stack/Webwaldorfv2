import requests

ACCESS_TOKEN = "EAAgQyrZAs2TIBSeTzzxxZCJlJofGkUhWdtPDL68ZBPjDZA9jd9bnrM9RjK5mLEaASYXZCQHycdnYSiAASAyRbZCMzgEHN7fTyK96HDEGwZAdVv5P3dbsKHenI1un4hCjqp37xTEXY7HOZCj95PT2ZA1XZCbdm4mlfyZCDxxaFHsB0H5mDbZBouNiBCrZBauW6BOrp6BVGFuZAVCEwGBUzpcO7KwKPXEcUP37bf4y4GfjoWHvZAOZC6uNovz0sFevqxGcftAhAoYl70DUCA5oPl9uLBN3OZCcZD"
BUSINESS_ID = "1309436010470661"

url = f"https://graph.facebook.com/v19.0/{BUSINESS_ID}/owned_ad_accounts?access_token={ACCESS_TOKEN}&fields=id,name"
res = requests.get(url)
print("Owned:", res.json())

url2 = f"https://graph.facebook.com/v19.0/{BUSINESS_ID}/client_ad_accounts?access_token={ACCESS_TOKEN}&fields=id,name"
res2 = requests.get(url2)
print("Client:", res2.json())
