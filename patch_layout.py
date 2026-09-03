with open('app/admin/layout.tsx', 'r') as f:
    content = f.read()

# Add the Smartphone import
if "Smartphone" not in content:
    content = content.replace("Mail } from 'lucide-react'", "Mail, Smartphone } from 'lucide-react'")

# Add to navItems
nav_item = "    { name: 'Motor WhatsApp', href: '/admin/whatsapp', icon: Smartphone },\n    { name: 'Directorio / Campañas', href: '/admin/campanas', icon: Mail },"
content = content.replace("{ name: 'Directorio / Campañas', href: '/admin/campanas', icon: Mail },", nav_item)

with open('app/admin/layout.tsx', 'w') as f:
    f.write(content)
print("Layout patched")
