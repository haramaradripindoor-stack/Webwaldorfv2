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
          console.log(`  - URL abierta: ${url}`);
          if (url.includes('web.telegram.org')) {
            tgPage = page;
            break;
          }
        }
      }

      if (tgPage) {
        let allMedia = new Map(); // Para evitar duplicados usando la url como clave

        // Extraer lo visible primero
        const extractMedia = async () => {
            return await tgPage.evaluate(async () => {
                const mediaElements = Array.from(document.querySelectorAll('img, video')).filter(el => el.src && el.src.includes('blob:'));
                const results = [];
                for (const el of mediaElements) {
                    try {
                        const isVideo = el.tagName.toLowerCase() === 'video';
                        // Removido el filtro de el.width < 100 que estaba saltándose las imágenes en la galería de Telegram
                        const response = await fetch(el.src);
                        const blob = await response.blob();
                        if (blob.size > 30 * 1024 * 1024) continue;
                        const base64 = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.readAsDataURL(blob);
                        });
                        results.push({ 
                            url: el.src, 
                            data: base64, 
                            type: isVideo ? 'video' : 'image',
                            ext: isVideo ? 'mp4' : 'jpg'
                        });
                    } catch (e) { 
                        results.push({ error: `Error fetching blob ${el.src}: ${e.message}` });
                    }
                }
                return results;
            });
        };

        // Debug: buscar qué elementos existen
        const debugInfo = await tgPage.evaluate(() => {
            const sampleMsg = document.querySelector('.Message.has-photo, .message-photo');
            if (sampleMsg) {
                return sampleMsg.outerHTML;
            }
            // Si no, devolver todas las clases de imágenes
            const allImgs = Array.from(document.querySelectorAll('img')).map(i => ({ className: i.className, src: i.src.substring(0, 50) }));
            const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({ className: c.className }));
            return { allImgs, canvases };
        });
        console.log('DEBUG DOM:', JSON.stringify(debugInfo, null, 2));

        console.log('Extrayendo medios y haciendo scroll...');
        
        for(let j = 0; j < 15; j++) {
            const batch = await extractMedia();
            batch.forEach(item => {
                if (item.error) {
                    console.log('Browser Error:', item.error);
                } else {
                    allMedia.set(item.url, item);
                }
            });

            await tgPage.evaluate(() => {
                const scroller = document.querySelector('.MessageList') || document.querySelector('.Scrollable') || window;
                if (scroller.scrollBy) {
                    scroller.scrollBy(0, -1000);
                } else {
                    scroller.scrollTop -= 1000;
                }
            });
            await tgPage.waitForTimeout(2000);
        }

        console.log(`Se encontraron ${allMedia.size} medios únicos en total.`);
        
        let i = 0;
        let v = 0;
        for (const item of allMedia.values()) {
            const base64Data = item.data.split(',')[1];
            if (base64Data) {
                const buffer = Buffer.from(base64Data, 'base64');
                let fileName;
                if (item.type === 'video') {
                    v++;
                    fileName = `farol_vid_${Date.now()}_${v}.${item.ext}`;
                } else {
                    i++;
                    fileName = `farol_img_${Date.now()}_${i}.${item.ext}`;
                }
                const filePath = path.join(outDir, fileName);
                fs.writeFileSync(filePath, buffer);
                console.log(`Guardado ${item.type}:`, filePath);
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
