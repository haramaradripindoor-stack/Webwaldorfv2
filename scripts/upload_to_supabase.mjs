import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import mime from 'mime-types'

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

const BUCKET_NAME = 'imagenes-web'
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images')

async function run() {
  console.log(`Verificando bucket '${BUCKET_NAME}'...`)
  const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets()
  if (bucketErr) {
    console.error("Error al listar buckets:", bucketErr)
    return
  }

  const bucketExists = buckets.some(b => b.name === BUCKET_NAME)
  if (!bucketExists) {
    console.log(`Creando bucket '${BUCKET_NAME}'...`)
    const { error: createErr } = await supabase.storage.createBucket(BUCKET_NAME, { public: true })
    if (createErr) {
      console.error("Error creando bucket:", createErr)
      return
    }
  } else {
    // Asegurar que sea público
    await supabase.storage.updateBucket(BUCKET_NAME, { public: true })
  }

  const files = fs.readdirSync(IMAGES_DIR)
  console.log(`Encontrados ${files.length} archivos en public/images/`)

  let uploaded = 0
  let skipped = 0

  // List existing files in bucket
  const { data: existingFilesData, error: listErr } = await supabase.storage.from(BUCKET_NAME).list('', { limit: 1000 })
  const existingFiles = new Set(existingFilesData?.map(f => f.name) || [])

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file)
    const stat = fs.statSync(filePath)
    if (!stat.isFile()) continue;

    // Decode URL encoded filenames to avoid double encoding issues
    const normalizedName = decodeURIComponent(file)

    if (existingFiles.has(normalizedName)) {
      console.log(`⏭️ Saltando ${normalizedName} (Ya existe)`)
      skipped++
      continue
    }

    console.log(`⬆️ Subiendo ${normalizedName} (${(stat.size / 1024 / 1024).toFixed(2)} MB)...`)
    const fileBuffer = fs.readFileSync(filePath)
    const contentType = mime.lookup(normalizedName) || 'application/octet-stream'

    const { error: uploadErr } = await supabase.storage.from(BUCKET_NAME).upload(normalizedName, fileBuffer, {
      contentType: contentType,
      upsert: false
    })

    if (uploadErr) {
      console.error(`❌ Error subiendo ${normalizedName}:`, uploadErr)
    } else {
      console.log(`✅ Subido ${normalizedName}`)
      uploaded++
    }
  }

  console.log(`\nResumen: ${uploaded} subidos, ${skipped} saltados.`)
}

run()
