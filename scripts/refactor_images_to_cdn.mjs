import fs from 'fs'
import path from 'path'

const CDN_URL = 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/'

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath)
  let changedFilesCount = 0

  for (const file of files) {
    const fullPath = path.join(dirPath, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      changedFilesCount += processDirectory(fullPath)
    } else if (stat.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js'))) {
      const originalContent = fs.readFileSync(fullPath, 'utf8')
      let newContent = originalContent
      
      // Replace "/images/" with CDN_URL. We handle cases with quotes and backticks.
      // E.g. '/images/foto.jpg' -> 'https://.../foto.jpg'
      // E.g. "/images/foto.jpg" -> "https://.../foto.jpg"
      // E.g. `/images/foto.jpg` -> `https://.../foto.jpg`
      // Since some might be URL encoded already or have spaces, we just replace the prefix.
      
      // Pattern explanation: look for quote or backtick, then /images/
      const regex = /(['"`])\/images\//g
      newContent = newContent.replace(regex, `$1${CDN_URL}`)

      if (originalContent !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8')
        console.log(`✅ Refactorizado: ${fullPath}`)
        changedFilesCount++
      }
    }
  }
  return changedFilesCount
}

const appDir = path.join(process.cwd(), 'app')
const componentsDir = path.join(process.cwd(), 'components')

console.log("Iniciando refactorización de rutas locales a CDN...")
const appChanges = processDirectory(appDir)
const compChanges = processDirectory(componentsDir)

console.log(`\nResumen: Refactorizados ${appChanges} archivos en app/ y ${compChanges} en components/`)
