import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Este endpoint se ejecuta cada 5 minutos vía Vercel Cron
// para mantener vivo el proyecto (Supabase Free Tier se pausa tras 1 semana de inactividad)
export async function GET() {
  try {
    const supabase = createClient()
    
    // Ping a Supabase para mantenerlo despierto
    const { count, error } = await supabase
      .from('noticias')
      .select('*', { count: 'exact', head: true })
    
    const timestamp = new Date().toISOString()
    
    if (error) {
      console.log(`[CRON ${timestamp}] Supabase ping failed:`, error.message)
      return NextResponse.json({ 
        status: 'warning', 
        message: 'Supabase ping failed but endpoint is alive',
        timestamp 
      })
    }

    console.log(`[CRON ${timestamp}] Supabase alive. Noticias count: ${count}`)
    
    return NextResponse.json({ 
      status: 'ok', 
      message: 'Proyecto Trekan despierto 🌿',
      supabase_noticias: count,
      timestamp
    })
  } catch (e: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: e.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
