const { chromium } = require('playwright');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function scrapeInstagram() {
    try {
        let wsEndpoint;
        
        // Attempt to connect via Local API
        try {
            console.log("Intentando conectar a AdsPower Local API...");
            const response = await axios.get('http://local.adspower.net:50325/api/v1/browser/active');
            
            // The API returns active profiles.
            if (response.data.code === 0 && response.data.data.ws) {
                wsEndpoint = response.data.data.ws.puppeteer;
            } else if (response.data.code === 0 && Array.isArray(response.data.data)) {
                 const activeSession = response.data.data.find(s => s.ws && s.ws.puppeteer);
                 if (activeSession) {
                     wsEndpoint = activeSession.ws.puppeteer;
                 }
            }
        } catch (e) {
            console.log("Fallo API Local, mensaje:", e.message);
        }

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

        console.log("Extrayendo imágenes de los posts...");
        const imageSrcs = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('img'));
            return images
                .map(img => img.src)
                .filter(src => src && src.includes('scontent') && !src.includes('150x150'));
        });

        const targetImages = imageSrcs.slice(0, 6);
        console.log(`Encontradas ${targetImages.length} imágenes para descargar.`);

        const outputDir = 'C:\\Users\\FELIP\\Documents\\GitHub\\Webwaldorfv2\\trekan_nextjs\\public\\assets\\ig';
        if (!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir, { recursive: true });
        }

        for (let i = 0; i < targetImages.length; i++) {
            const src = targetImages[i];
            console.log(`Descargando imagen ${i+1}...`);
            try {
                const imgRes = await axios.get(src, { responseType: 'arraybuffer' });
                fs.writeFileSync(path.join(outputDir, `ig_post_${i+1}.jpg`), imgRes.data);
                console.log(`Imagen ${i+1} guardada con éxito.`);
            } catch (err) {
                console.log(`Error descargando imagen ${i+1}:`, err.message);
            }
        }

        await browser.close();
        console.log("Proceso terminado exitosamente.");

    } catch (error) {
        console.error("Error crítico en el script:", error);
    }
}

scrapeInstagram();
