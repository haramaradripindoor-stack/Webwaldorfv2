import requests

ACCESS_TOKEN = "EAAgQyrZAs2TIBScZAWHZA32nZABzJK5PSushrlfMaehNvv7Y2OAjRZAP4jK6i8KQgHu7kKdYg6KVb9TdaBB1ky3DZAOO6EPpHUR8kprUjFzE4YSUK17y4BeEtAmrQGAl0dYFigZARnmjeZAj3Gbm2At5JPocxp5CmWETg33Ej6HJ7zZCcNBf1ZCk4dcMfbJi7A4Nst5vSrjBBnsFJhAVtjIRBAxZANnbkxmpEzyCgVsbJOLHeVeqqI3ZCjKtYFZALjyczNAXiYTi8SAZBWhrMrTn4RggZDZD"

url = f"https://graph.facebook.com/v19.0/me/adaccounts?access_token={ACCESS_TOKEN}&fields=id,name"
res = requests.get(url)
print("Me Ad Accounts:", res.json())
