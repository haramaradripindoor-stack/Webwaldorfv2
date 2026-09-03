with open('app/admin/admisiones/page.tsx', 'r') as f:
    content = f.read()
    
# Remove all broken instances
import re
content = re.sub(r'import {([^}]+)}([\s,SearchTableColumns}]+)from \'lucide-react\';', 
                 r"import {\1, Search, Table, Columns} from 'lucide-react';", content)
                 
with open('app/admin/admisiones/page.tsx', 'w') as f:
    f.write(content)
