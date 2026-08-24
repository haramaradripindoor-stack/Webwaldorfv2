import os
from supabase import create_client

url = "https://ebpioebxcyjpjgiqpjaw.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVicGlvZWJ4Y3lqcGpnaXFwamF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjY2Njk2OCwiZXhwIjoyMDk4MjQyOTY4fQ.tUy3DdyfaTybkwRUK8E5JfcMiv2NzhbSoO4ACHebBjc"
supabase = create_client(url, key)

try:
    res = supabase.table('email_campaigns').select('*').execute()
    print("Tabla existe. Registros:", len(res.data))
    if len(res.data) > 0:
        print(res.data)
except Exception as e:
    print("Error:", e)
