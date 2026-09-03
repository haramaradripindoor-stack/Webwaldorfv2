import re

with open('components/AdminSidebar.tsx', 'r') as f:
    content = f.read()

# Make sure we don't duplicate it
if "/admin/whatsapp" not in content:
    # Look for the last nav link or 'MessageSquare'
    # We will inject the WhatsApp link right after the Admisiones link
    whatsapp_link = """            <Link href="/admin/admisiones">
              <span className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/admin/admisiones') 
                ? 'bg-[var(--color-waldorf-sage)]/10 text-[var(--color-waldorf-moss)] font-bold' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}>
                <Inbox className="w-5 h-5" />
                Admisiones (CRM)
              </span>
            </Link>

            <Link href="/admin/whatsapp">
              <span className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/admin/whatsapp') 
                ? 'bg-[#25D366]/10 text-[#128C7E] font-bold' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}>
                <Smartphone className="w-5 h-5" />
                WhatsApp (Motor)
              </span>
            </Link>"""

    # We need to replace the Admisiones link block with the combined block.
    # We can use regex to find the Admisiones Link block
    content = re.sub(
        r'<Link href="/admin/admisiones">.*?Admisiones.*?</span>\s*</Link>',
        whatsapp_link,
        content,
        flags=re.DOTALL
    )

    # Need to make sure Smartphone is imported from lucide-react
    if "Smartphone" not in content:
        content = content.replace("Inbox,", "Inbox, Smartphone,")
        
    with open('components/AdminSidebar.tsx', 'w') as f:
        f.write(content)
        
print("Sidebar patched")
