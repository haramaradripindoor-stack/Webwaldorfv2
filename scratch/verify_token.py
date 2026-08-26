import urllib.request
import urllib.parse
import json

TOKEN = "EAAgQyrZAs2TIBSWFMyXtkrd4JddXkaT2Q9BZA9J8qonsZCVnPcu4y5Xz5eQiZAQCf7k4AezYdA50WyoGFP8I7Yx6Jr9aB3EtQiBBo0kYiuBLKWArR3CWPcu2UObcUWRZBrS1PTfjJ65XZAL6oN11wc71ZALmpvlMqVJZAy4CvxzNmZCbaiTy6UYLBz9mNTxNc7KkzKwTwqMYR0YWAHowyM9ncNKudZAhMtY8qBuAZDZD"
AD_ACCOUNT_ID = 'act_179839693305358'

url = f"https://graph.facebook.com/v20.0/{AD_ACCOUNT_ID}/campaigns?fields=name,status&access_token={TOKEN}"
try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read())
        print("✅ Token validado. Campañas encontradas en la cuenta:")
        for camp in data.get('data', []):
            print(f" - {camp.get('name')} (Status: {camp.get('status')})")
except Exception as e:
    print(f"❌ Error verificando el nuevo token: {e}")
