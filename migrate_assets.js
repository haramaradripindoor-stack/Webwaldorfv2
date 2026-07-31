const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, 'public', 'imagenes-web');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const SUPABASE_PREFIX = 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log(`Already exists: ${dest}`);
      return resolve();
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  
  return arrayOfFiles;
}

async function run() {
  const dirsToScan = ['app', 'components', 'lib', 'utils'];
  let allFiles = [];
  dirsToScan.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
      allFiles = getAllFiles(fullPath, allFiles);
    }
  });

  const urlRegex = /https:\/\/ebpioebxcyjpjgiqpjaw\.supabase\.co\/storage\/v1\/object\/public\/imagenes-web\/([^"'\s`?]+)/g;

  let totalReplaced = 0;
  
  for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let matches = [...content.matchAll(urlRegex)];
    
    if (matches.length > 0) {
      console.log(`Found ${matches.length} URLs in ${file}`);
      
      for (const match of matches) {
        const fullUrl = match[0];
        const fileName = match[1];
        const decodedFileName = decodeURIComponent(fileName);
        
        const destPath = path.join(targetDir, decodedFileName);
        try {
          console.log(`Downloading: ${fullUrl}`);
          await downloadFile(fullUrl, destPath);
        } catch (e) {
          console.error(`Error downloading ${fullUrl}`, e);
        }
      }
      
      // Replace in code
      // We replace the entire prefix with /imagenes-web/
      // Wait, there's a case where the URL is in a Next.js replace:
      // url.replace('/images/', 'https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/')
      // This is used for dynamic content. We should just replace the prefix globally.
      const newContent = content.split(SUPABASE_PREFIX).join('/imagenes-web/');
      
      if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated ${file}`);
        totalReplaced++;
      }
    }
  }
  
  console.log(`Done. Updated ${totalReplaced} files.`);
}

run().catch(console.error);
