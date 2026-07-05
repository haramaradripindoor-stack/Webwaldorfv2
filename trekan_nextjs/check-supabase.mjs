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
  const { data, error } = await supabase.from('noticias').select('*')
  console.log("Noticias in Supabase:")
  if (error) {
    console.error(error)
  } else {
    data.forEach(n => console.log(`${n.slug} -> ${n.image_url}`))
  }
}
run()
