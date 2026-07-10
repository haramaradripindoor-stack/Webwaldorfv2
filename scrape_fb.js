const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function run() {
    const wsEndpoint = 'ws://127.0.0.1:60849/devtools/browser/8abd0d5a-d9fd-4da3-85c4-ae927f677cc5';
    console.log("Conectando a AdsPower vía:", wsEndpoint);
    
    const browser = await chromium.connectOverCDP(wsEndpoint);
    const contexts = browser.contexts();
    
    // Buscar la pestaña de Facebook
    let page = contexts[0].pages().find(p => p.url().includes('facebook.com'));
    
    if (!page) {
        console.log("No se encontró Facebook abierto, creando nueva pestaña...");
        page = await contexts[0].newPage();
        await page.goto('https://www.facebook.com/profile.php?id=61573063135723', { waitUntil: 'networkidle' });
    } else {
        console.log("Pestaña de FB encontrada:", page.url());
        await page.bringToFront();
    }
    
    console.log("Haciendo scroll para cargar posts...");
    for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
        await page.waitForTimeout(2000);
    }
    
    // Extraer imágenes
    const mediaUrls = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'))
                        .filter(img => img.width > 200 && img.height > 200) // Filtrar iconos
                        .map(img => img.src)
                        .filter(src => src && (src.includes('scontent') || src.includes('fbcdn')) && !src.includes('data:image'));
        return [...new Set(imgs)];
    });
    
    const targetMedia = mediaUrls.slice(0, 10); // Límite de 10
    console.log(`Encontrados ${targetMedia.length} imágenes de Facebook.`);
    
    const outputDir = 'C:\\Users\\FELIP\\Documents\\GitHub\\Webwaldorfv2\\trekan_nextjs\\public\\assets\\fb';
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    
    let index = 1;
    for (const src of targetMedia) {
        console.log(`Descargando FB media ${index}...`);
        try {
            const res = await axios.get(src, { responseType: 'arraybuffer' });
            fs.writeFileSync(path.join(outputDir, `fb_post_${index}.jpg`), res.data);
            console.log(`Guardado fb_post_${index}.jpg`);
            index++;
        } catch (e) {
            console.log("Error descargando:", e.message);
        }
    }
    
    console.log("Extracción de FB finalizada.");
    await browser.close();
}

run().catch(console.error);
