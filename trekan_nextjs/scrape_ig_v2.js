const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function run() {
    const wsEndpoint = 'ws://127.0.0.1:60849/devtools/browser/8abd0d5a-d9fd-4da3-85c4-ae927f677cc5';
    console.log("Conectando a AdsPower vía:", wsEndpoint);
    
    const browser = await chromium.connectOverCDP(wsEndpoint);
    const contexts = browser.contexts();
    
    // Buscar la pestaña de Instagram
    let page = contexts[0].pages().find(p => p.url().includes('instagram.com'));
    
    if (!page) {
        console.log("No se encontró Instagram abierto, creando nueva pestaña...");
        page = await contexts[0].newPage();
        await page.goto('https://www.instagram.com/waldorftrekanpv/', { waitUntil: 'networkidle' });
    } else {
        console.log("Pestaña encontrada:", page.url());
        await page.bringToFront();
    }
    
    console.log("Esperando carga...");
    await page.waitForTimeout(3000);
    
    // Debug: Tomar screenshot para ver qué está viendo Playwright
    await page.screenshot({ path: 'C:\\Users\\FELIP\\.gemini\\antigravity\\brain\\5917bf31-aea5-4c79-a0a8-54847315c26a\\ig_debug.png' });
    console.log("Screenshot de debug guardado.");
    
    // Extraer links de los posts (href="/p/...")
    const postLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        return links.map(a => a.href).filter(href => href && href.includes('/p/'));
    });
    
    const uniquePosts = [...new Set(postLinks)].slice(0, 10);
    console.log(`Encontrados ${uniquePosts.length} posts para raspar.`);
    
    const outputDir = 'C:\\Users\\FELIP\\Documents\\GitHub\\Webwaldorfv2\\trekan_nextjs\\public\\assets\\ig';
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    
    let index = 1;
    for (const postUrl of uniquePosts) {
        console.log(`Visitando post: ${postUrl}`);
        await page.goto(postUrl, { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000); // Esperar a que cargue el media
        
        const mediaUrls = await page.evaluate(() => {
            const vids = Array.from(document.querySelectorAll('video')).map(v => v.src).filter(Boolean);
            const imgs = Array.from(document.querySelectorAll('img'))
                            .filter(img => img.width > 300)
                            .map(img => img.src)
                            .filter(src => src && !src.includes('data:image') && !src.includes('profile_pic'));
            return [...vids, ...imgs];
        });
        
        if (mediaUrls.length > 0) {
            const src = mediaUrls[0]; // Tomar el primero principal
            const ext = src.includes('.mp4') || src.includes('video') ? 'mp4' : 'jpg';
            console.log(`Descargando media del post ${index}: ${src.substring(0, 50)}...`);
            
            try {
                if (src.startsWith('blob:')) {
                    console.log(`No se puede descargar blob vía axios directamente. Saltando.`);
                    continue;
                }
                const res = await axios.get(src, { responseType: 'arraybuffer' });
                fs.writeFileSync(path.join(outputDir, `post_${index}.${ext}`), res.data);
                console.log(`Guardado post_${index}.${ext}`);
                index++;
            } catch (e) {
                console.log("Error descargando:", e.message);
            }
        } else {
            console.log("No se encontró media principal en este post.");
        }
    }
    
    console.log("Extracción finalizada.");
    await browser.close();
}

run().catch(console.error);
