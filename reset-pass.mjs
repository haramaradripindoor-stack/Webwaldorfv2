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
const supabaseServiceKey = envs['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseServiceKey) {
  console.error("Falta la SUPABASE_SERVICE_ROLE_KEY en el .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const uid = 'e444d040-0047-470e-93bc-9c73fa1a5321'
  const newPassword = 'Trekan2026!'
  
  const { data, error } = await supabase.auth.admin.updateUserById(
    uid,
    { password: newPassword }
  )

  if (error) {
    console.error("Error al actualizar la contraseña:", error)
  } else {
    console.log("¡Contraseña actualizada con éxito!")
    console.log("Nueva clave: " + newPassword)
  }
}

run()
