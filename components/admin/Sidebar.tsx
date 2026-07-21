'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Image as ImageIcon, Users, BookOpen, Calendar, Database, Settings, Mail } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Portada CMS', href: '/admin/portada', icon: ImageIcon },
    { name: 'Admisiones CRM', href: '/admin/admisiones', icon: Users },
    { name: 'Noticias y SEO', href: '/admin/noticias', icon: BookOpen },
    { name: 'Actividades', href: '/admin/actividades', icon: Calendar },
    { name: 'Prospectos / Leads', href: '/admin/prospectos', icon: Users },
    { name: 'Campañas Email', href: '/admin/campanas', icon: Mail },
    { name: 'Cerebro RAG (IA)', href: '/admin/cerebro', icon: Database },
    { name: 'Ajustes', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[var(--color-waldorf-sage)]/20 flex flex-col shadow-sm">
      <div className="p-6 border-b border-[var(--color-waldorf-sage)]/20">
        <Link href="/admin">
          <h2 className="text-xl font-bold font-serif text-[var(--color-waldorf-moss)] uppercase hover:opacity-80 transition-opacity">
            Trekan<span className="text-[var(--color-waldorf-terracotta)]">Admin</span>
          </h2>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-[var(--color-waldorf-sage)]/20 text-[var(--color-waldorf-moss)] border border-[var(--color-waldorf-sage)]/40' : 'text-[var(--color-waldorf-text-light)] hover:text-[var(--color-waldorf-moss)] hover:bg-[var(--color-waldorf-cream)]'}`}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--color-waldorf-sage)]/20">
        <div className="flex items-center gap-3 px-4 py-3 bg-[var(--color-waldorf-cream)] rounded-xl border border-[var(--color-waldorf-sage)]/20">
          <div className="w-8 h-8 rounded-full bg-[var(--color-waldorf-moss)] flex items-center justify-center text-white font-bold">CW</div>
          <div className="text-sm">
            <p className="text-[var(--color-waldorf-moss)] font-bold">Colegio Waldorf Trekan</p>
            <p className="text-[var(--color-waldorf-text-light)] text-xs">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
