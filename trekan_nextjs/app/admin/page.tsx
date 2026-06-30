import { createClient } from '@/utils/supabase/server';
import { Newspaper, CalendarDays } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = createClient();
  
  // Contar noticias (si las tablas no existen devolverá 0 o null)
  const { count: countNoticias } = await supabase
    .from('noticias')
    .select('*', { count: 'exact', head: true });

  // Contar actividades
  const { count: countActividades } = await supabase
    .from('actividades')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 font-serif mb-2">Bienvenido al Panel Trekan</h2>
        <p className="text-gray-600">Desde aquí puedes gestionar el contenido del sitio web.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total de Noticias</p>
            <h3 className="text-4xl font-bold text-gray-800">{countNoticias || 0}</h3>
            <Link href="/admin/noticias" className="text-[var(--color-waldorf-moss)] text-sm font-medium mt-4 inline-block hover:underline">
              Gestionar Noticias →
            </Link>
          </div>
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[var(--color-waldorf-moss)]">
            <Newspaper className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total de Actividades</p>
            <h3 className="text-4xl font-bold text-gray-800">{countActividades || 0}</h3>
            <Link href="/admin/actividades" className="text-[var(--color-waldorf-terracota)] text-sm font-medium mt-4 inline-block hover:underline">
              Gestionar Actividades →
            </Link>
          </div>
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-[var(--color-waldorf-terracota)]">
            <CalendarDays className="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
