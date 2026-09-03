'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Home, Newspaper, CalendarDays, Brain, LayoutTemplate, Mail, Smartphone } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Portada', href: '/admin/portada', icon: LayoutTemplate },
    { name: 'Admisiones CRM', href: '/admin/admisiones', icon: Brain },
    { name: 'Noticias / SEO', href: '/admin/noticias', icon: Newspaper },
    { name: 'Actividades', href: '/admin/actividades', icon: CalendarDays },
    { name: 'Prospectos (Growth)', href: '/admin/prospectos', icon: LayoutTemplate },
        { name: 'Motor WhatsApp', href: '/admin/whatsapp', icon: Smartphone },
    { name: 'Directorio / Campañas', href: '/admin/campanas', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#2C2A29] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold font-serif text-[var(--color-waldorf-cream)]">Panel Trekan</h2>
          <p className="text-xs text-white/60 mt-1">Gestión de Contenido</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[var(--color-waldorf-moss)] text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-white/70 hover:text-red-400 transition-colors w-full px-4 py-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            {navItems.find(i => i.href === pathname)?.name || 'Administración'}
          </h1>
          <a 
            href="/" 
            target="_blank" 
            className="text-sm font-medium text-[var(--color-waldorf-terracota)] hover:underline"
          >
            Ver sitio web público →
          </a>
        </header>
        
        <main className="flex-1 overflow-auto p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
