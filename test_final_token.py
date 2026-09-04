import requests

ACCESS_TOKEN = "EAAgQyrZAs2TIBScZAWHZA32nZABzJK5PSushrlfMaehNvv7Y2OAjRZAP4jK6i8KQgHu7kKdYg6KVb9TdaBB1ky3DZAOO6EPpHUR8kprUjFzE4YSUK17y4BeEtAmrQGAl0dYFigZARnmjeZAj3Gbm2At5JPocxp5CmWETg33Ej6HJ7zZCcNBf1ZCk4dcMfbJi7A4Nst5vSrjBBnsFJhAVtjIRBAxZANnbkxmpEzyCgVsbJOLHeVeqqI3ZCjKtYFZALjyczNAXiYTi8SAZBWhrMrTn4RggZDZD"
BUSINESS_ID = "1309436010470661"

url_owned = f"https://graph.facebook.com/v19.0/{BUSINESS_ID}/owned_ad_accounts?access_token={ACCESS_TOKEN}&fields=id,name"
res_owned = requests.get(url_owned).json()
print("Owned Ad Accounts:", res_owned)

url_client = f"https://graph.facebook.com/v19.0/{BUSINESS_ID}/client_ad_accounts?access_token={ACCESS_TOKEN}&fields=id,name"
res_client = requests.get(url_client).json()
print("Client Ad Accounts:", res_client)
