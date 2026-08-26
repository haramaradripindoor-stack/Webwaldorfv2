const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function saveMetaAutomation() {
    console.log("🔥 Buscando pestaña de Meta Business Suite en AdsPower...");
    const basePath = process.platform === 'win32' ? 'C:\\.ADSPOWER_GLOBAL\\cache\\' : '/Users/felipeandresvivancocornejo/Library/Application Support/adspower_global/cwd_global/source/cache/';
    const dirs = fs.readdirSync(basePath);
    
    let browser;
    for (const dir of dirs) {
        const portFile = path.join(basePath, dir, 'DevToolsActivePort');
        if (fs.existsSync(portFile)) {
            try {
                const fileContent = fs.readFileSync(portFile, 'utf8').split('\n');
                const port = fileContent[0].trim();
                const uuidPath = fileContent[1].trim();
                const wsEndpoint = `ws://127.0.0.1:${port}${uuidPath}`;
                
                browser = await chromium.connectOverCDP(wsEndpoint);
                
                // Buscar la pestaña de Meta Business Suite (business.facebook.com)
                const page = browser.contexts()[0].pages().find(p => p.url().includes('business.facebook.com/latest/inbox/automated_responses'));
                
                if (page) {
                    console.log(`👁️ Meta Business Suite encontrado. Buscando el botón 'Guardar cambios'...`);
                    await page.bringToFront();
                    
                    // Buscar el botón azul de "Guardar cambios"
                    const btn = await page.evaluateHandle(() => {
                        const btns = Array.from(document.querySelectorAll('div[role="button"], button'));
                        return btns.find(b => b.innerText && b.innerText.includes('Guardar cambios'));
                    });
                    
                    const isBtnNull = await page.evaluate(b => !b, btn);
                    if (!isBtnNull) {
                        await btn.click();
                        console.log("✅ Clic en 'Guardar cambios' ejecutado en Meta.");
                    } else {
                        console.log("❌ No encontré el botón de Guardar cambios.");
                    }
                    
                    await browser.close();
                    return;
                }
                await browser.close();
            } catch(e) {}
        }
    }
    console.log("❌ No se encontró la pestaña de automatizaciones en Meta.");
}
saveMetaAutomation();
