const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const cacheDir = 'C:\\\\.ADSPOWER_GLOBAL\\\\cache';
const outDir = path.join(__dirname, 'public', 'assets', 'fb');

async function main() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  if (!fs.existsSync(cacheDir)) {
    console.error('AdsPower cache no existe:', cacheDir);
    return;
  }

  const profiles = fs.readdirSync(cacheDir).filter(f => fs.statSync(path.join(cacheDir, f)).isDirectory());
  
  for (const profile of profiles) {
    const portFile = path.join(cacheDir, profile, 'DevToolsActivePort');
    if (!fs.existsSync(portFile)) continue;

    try {
      const content = fs.readFileSync(portFile, 'utf8').split('\n');
      if (content.length < 2) continue;
      
      const port = content[0].trim();
      const uuid = content[1].trim();
      const wsEndpoint = `ws://127.0.0.1:${port}${uuid}`;

      console.log(`Intentando conectar a AdsPower puerto ${port}...`);
      const browser = await chromium.connectOverCDP(wsEndpoint, { timeout: 3000 });
      
      let tgPage = null;
      for (const ctx of browser.contexts()) {
        for (const page of ctx.pages()) {
          const url = page.url();
          if (url.includes('web.telegram.org')) {
            tgPage = page;
            break;
          }
        }
      }

      if (tgPage) {
        console.log('¡Encontrada pestaña de Telegram!');
        await tgPage.bringToFront();
        
        // Scroll the page a few times to make sure images load
        for(let j = 0; j < 3; j++) {
            await tgPage.evaluate(() => window.scrollBy(0, -1000));
            await tgPage.waitForTimeout(1000);
        }

        console.log('Extrayendo imágenes visibles de la galería de medios...');
        const result = await tgPage.evaluate(async () => {
           const imgs = Array.from(document.querySelectorAll('img')).filter(img => img.src && img.src.includes('blob:'));
           const results = [];
           for (const img of imgs) {
               try {
                   if (img.width < 100 || img.height < 100) continue;
                   const response = await fetch(img.src);
                   const blob = await response.blob();
                   const base64 = await new Promise((resolve) => {
                       const reader = new FileReader();
                       reader.onloadend = () => resolve(reader.result);
                       reader.readAsDataURL(blob);
                   });
                   results.push({ url: img.src, data: base64 });
               } catch (e) { }
           }
           return results;
        });

        console.log(`Se encontraron ${result.length} imágenes grandes.`);
        
        let i = 0;
        for (const img of result) {
            i++;
            const base64Data = img.data.split(',')[1];
            if (base64Data) {
                const buffer = Buffer.from(base64Data, 'base64');
                const filePath = path.join(outDir, `farol_${Date.now()}_${i}.jpg`);
                fs.writeFileSync(filePath, buffer);
                console.log('Guardada:', filePath);
            }
        }

        console.log('Extracción finalizada. Desconectando...');
        await browser.close();
        process.exit(0);
      } else {
        await browser.close();
      }
    } catch (e) {
      // Ignorar errores de conexión fallida
    }
  }
  
  console.log('Búsqueda terminada. No se encontró ninguna pestaña de Telegram web.telegram.org abierta.');
}

main();
