const { chromium } = require('playwright');
const path = require('path');

async function takeScreenshot() {
    const browser = await chromium.launch();
    const page = await browser.newPage({
        viewport: { width: 1280, height: 1080 }
    });
    
    console.log("Cargando http://localhost:3000 ...");
    try {
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        console.log("Esperando animaciones de Framer Motion...");
        await page.waitForTimeout(3000); // Give it time to load the videos and animations
        
        const outputPath = 'C:\\Users\\FELIP\\.gemini\\antigravity\\brain\\5917bf31-aea5-4c79-a0a8-54847315c26a\\local_preview.png';
        await page.screenshot({ path: outputPath, fullPage: true });
        console.log(`Screenshot guardado en ${outputPath}`);
    } catch (e) {
        console.error("Error al tomar captura:", e.message);
    } finally {
        await browser.close();
    }
}

takeScreenshot();
