import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Read .env.local manually
const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const envs = {}
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=')
  if (k && v.length) envs[k.trim()] = v.join('=').trim()
})

const supabaseUrl = envs['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envs['SUPABASE_SERVICE_ROLE_KEY'] || envs['NEXT_PUBLIC_SUPABASE_ANON_KEY']

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log("Updating broken image URLs in Supabase...")
  
  // Fix Fiesta de la Luz
  const { error: err1 } = await supabase
    .from('noticias')
    .update({ image_url: '/images/photo_2025-06-24_23-40-38.jpg' })
    .eq('slug', '2026-04-20-fiesta-de-la-luz')
    
  if (err1) console.error("Error updating Fiesta de la Luz:", err1)
  else console.log("Fixed Fiesta de la Luz")

  // Fix Inauguracion
  const { error: err2 } = await supabase
    .from('noticias')
    .update({ image_url: '/images/photo_2025-06-24_23-40-38.jpg' })
    .eq('slug', '2025-03-05-inauguracion')
    
  if (err2) console.error("Error updating Inauguracion:", err2)
  else console.log("Fixed Inauguracion")

  console.log("Done.")
}
run()
