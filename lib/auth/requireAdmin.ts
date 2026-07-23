import { createClient } from '@/utils/supabase/server'

export async function requireAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { authorized: false, error: 'Unauthorized: No session found', status: 401 }
  }

  const isAdmin = 
    user.email === 'trekancomunicaciones2025@gmail.com' || 
    user.email === 'fvivancorne@gmail.com' ||
    user.email === 'administracion@colegiowaldorftrekan.cl' ||
    (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL)

  if (!isAdmin) {
    return { authorized: false, error: 'Forbidden: Admin access required', status: 403 }
  }

  return { authorized: true, user }
}
