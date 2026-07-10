const { chromium } = require('playwright');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function scrapeInstagram() {
    try {
        let wsEndpoint;
        
        wsEndpoint = 'ws://127.0.0.1:60849/devtools/browser/8abd0d5a-d9fd-4da3-85c4-ae927f677cc5';
        
        if (!wsEndpoint) {
            console.log("Buscando todos los perfiles activos para encontrar wsEndpoint...");
            try {
                // If the generic active endpoint didn't give what we want, let's query the specific user if possible.
                // We'll just list all profiles, but Adspower API usually requires user_id for /api/v1/browser/active?user_id=X
                // Let's try to grab from cache files if API fails completely, but API should work.
                console.error("No se pudo obtener el wsEndpoint. Asegúrate de que AdsPower esté abierto y con un perfil activo.");
                process.exit(1);
            } catch (e) {}
        }

        console.log(`Conectando a AdsPower vía: ${wsEndpoint}`);
        const browser = await chromium.connectOverCDP(wsEndpoint);
        
        const contexts = browser.contexts();
        let page;
        
        // Search for existing Instagram tab
        page = contexts[0].pages().find(p => p.url().includes('instagram.com'));
        
        if (page) {
            console.log("Pestaña de Instagram encontrada. Secuestrando pestaña...");
            await page.bringToFront();
            if (!page.url().includes('waldorftrekanpv')) {
                await page.goto('https://www.instagram.com/waldorftrekanpv/');
            }
        } else {
            console.log("Creando nueva pestaña para Instagram...");
            page = await contexts[0].newPage();
            await page.goto('https://www.instagram.com/waldorftrekanpv/');
        }

        console.log("Esperando a que cargue la página...");
        await page.waitForTimeout(4000);

        // Scroll down to load more images
        for (let i = 0; i < 3; i++) {
            await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
            await page.waitForTimeout(2000);
        }

        console.log("Extrayendo imágenes y videos de los posts...");
        const mediaUrls = await page.evaluate(() => {
            const imgs = Array.from(document.querySelectorAll('img'))
                .filter(img => img.width > 200)
                .map(img => img.src)
                .filter(src => src && !src.includes('data:image') && !src.includes('150x150'));
            
            const vids = Array.from(document.querySelectorAll('video'))
                .map(v => v.src || (v.querySelector('source') && v.querySelector('source').src))
                .filter(src => src);

            return [...new Set([...imgs, ...vids])];
        });

        const targetMedia = mediaUrls.slice(0, 10);
        console.log(`Encontrados ${targetMedia.length} archivos multimedia para descargar.`);

        const outputDir = 'C:\\Users\\FELIP\\Documents\\GitHub\\Webwaldorfv2\\trekan_nextjs\\public\\assets\\ig';
        if (!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir, { recursive: true });
        }

        for (let i = 0; i < targetMedia.length; i++) {
            const src = targetMedia[i];
            const isVideo = src.includes('.mp4') || src.includes('video');
            const ext = isVideo ? 'mp4' : 'jpg';
            console.log(`Descargando archivo ${i+1}...`);
            try {
                // If it's a blob, axios won't work. We might need to download it via page.evaluate
                if (src.startsWith('blob:')) {
                    console.log(`Saltando blob URL: ${src}`);
                    continue;
                }
                const res = await axios.get(src, { responseType: 'arraybuffer' });
                fs.writeFileSync(path.join(outputDir, `ig_post_${i+1}.${ext}`), res.data);
                console.log(`Archivo ${i+1}.${ext} guardado con éxito.`);
            } catch (err) {
                console.log(`Error descargando archivo ${i+1}:`, err.message);
            }
        }

        await browser.close();
        console.log("Proceso terminado exitosamente.");

    } catch (error) {
        console.error("Error crítico en el script:", error);
    }
}

scrapeInstagram();
