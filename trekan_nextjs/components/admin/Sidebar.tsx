'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Image as ImageIcon, Settings, Bot, MessageSquare, TrendingUp, ClipboardList, UserCircle, BarChart3, Bell, FileJson, FileText } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Inicio (Resumen)', href: '/admin', icon: LayoutDashboard },
    { name: 'Métricas (Dashboard)', href: '/admin/dashboard', icon: BarChart3 },
    { name: 'Kanban Clínico', href: '/admin/kanban', icon: Users },
    { name: 'Pacientes y Fichas', href: '/admin/pacientes', icon: LayoutDashboard },
    { name: 'CMS de IA', href: '/admin/cms-ia', icon: Bot },
    { name: 'Auditoría IA', href: '/admin/chats', icon: MessageSquare },
    { name: 'Galería CMS', href: '/admin/cms', icon: ImageIcon },
    { name: 'Blog CMS', href: '/admin/blog', icon: FileText },
    { name: 'Recursos / PDFs', href: '/admin/cms/recursos', icon: FileJson },
    { name: 'Tarifario', href: '/admin/servicios', icon: ClipboardList },
    { name: 'Finanzas', href: '/admin/finanzas', icon: TrendingUp },
    { name: 'Campañas Email', href: '/admin/campanas', icon: MessageSquare },
    { name: 'Notificaciones Push', href: '/admin/push', icon: Bell },
    { name: 'Ajustes', href: '/admin/settings', icon: Settings },
    { name: 'Portal Paciente', href: '/dashboard', icon: UserCircle },
  ];

  return (
    <aside className="w-64 bg-[#050508] border-r border-hairline-soft flex flex-col">
      <div className="p-6 border-b border-hairline-soft">
        <Link href="/admin">
          <h2 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase hover:opacity-80 transition-opacity">
            León<span className="text-white">Admin</span>
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-500 hover:text-white hover:bg-foreground/5'}`}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-hairline-soft">
        <div className="flex items-center gap-3 px-4 py-3 bg-foreground/5 rounded-xl border border-hairline">
          <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold">BL</div>
          <div className="text-sm">
            <p className="text-white font-bold">Benjamín León</p>
            <p className="text-gray-500 text-xs">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
