const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function downloadFont() {
    const basePath = '/Users/felipeandresvivancocornejo/Library/Application Support/adspower_global/cwd_global/source/cache/';
    const dirs = fs.readdirSync(basePath);
    let wsEndpoint;
    
    for (const dir of dirs) {
        const portFile = path.join(basePath, dir, 'DevToolsActivePort');
        if (fs.existsSync(portFile)) {
            try {
                const fileContent = fs.readFileSync(portFile, 'utf8').split('\n');
                const port = fileContent[0].trim();
                const uuidPath = fileContent[1].trim();
                wsEndpoint = `ws://127.0.0.1:${port}${uuidPath}`;
                break;
            } catch(e) {}
        }
    }

    const browser = await chromium.connectOverCDP(wsEndpoint);
    const contexts = browser.contexts();
    let page = await contexts[0].newPage();
    
    await page.goto('https://fontsgeek.com/fonts/Waldorf-Script-Regular', { waitUntil: 'domcontentloaded' });
    console.log("Esperando Cloudflare...");
    await page.waitForTimeout(10000); // Dar tiempo al solver
    
    console.log("Forzando Submit del form de descarga...");
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 }).catch(() => null);
    
    await page.evaluate(() => {
        // En Fontsgeek la descarga es un form POST
        const submitBtn = document.querySelector('#fontdownloadsubmit');
        if(submitBtn) submitBtn.click();
    });
    
    const download = await downloadPromise;
    if (download) {
        const destPath = '/Users/felipeandresvivancocornejo/Downloads/Comunicaciones/Waldorf-Script-Real.zip';
        await download.saveAs(destPath);
        console.log(`¡EXITO! Archivo descargado en ${destPath}`);
    } else {
        console.log("Fallo la intercepcion de descarga.");
    }
    await browser.close();
}
downloadFont();
