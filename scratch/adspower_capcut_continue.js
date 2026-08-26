const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function continueCapCut() {
    console.log("🔥 Buscando pestaña de CapCut en AdsPower...");
    const basePath = process.platform === 'win32' ? 'C:\\.ADSPOWER_GLOBAL\\cache\\' : '/Users/felipeandresvivancocornejo/Library/Application Support/adspower_global/cwd_global/source/cache/';
    const dirs = fs.readdirSync(basePath);
    
    for (const dir of dirs) {
        const portFile = path.join(basePath, dir, 'DevToolsActivePort');
        if (fs.existsSync(portFile)) {
            try {
                const fileContent = fs.readFileSync(portFile, 'utf8').split('\n');
                const port = fileContent[0].trim();
                const uuidPath = fileContent[1].trim();
                const wsEndpoint = `ws://127.0.0.1:${port}${uuidPath}`;
                
                const browser = await chromium.connectOverCDP(wsEndpoint);
                const page = browser.contexts()[0].pages().find(p => p.url().includes('capcut.com'));
                
                if (page) {
                    console.log(`👁️ CapCut encontrado. Buscando el botón 'Continue'...`);
                    await page.bringToFront();
                    
                    // Buscar el botón por texto "Continue" o "Continuar"
                    const btn = await page.evaluateHandle(() => {
                        const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
                        return btns.find(b => b.innerText && (b.innerText.includes('Continue') || b.innerText.includes('Continuar')));
                    });
                    
                    // Asegurarnos de que el botón es válido antes de clickear
                    const isBtnNull = await page.evaluate(b => !b, btn);
                    if (!isBtnNull) {
                        await btn.click();
                        console.log("✅ Clic en 'Continue' ejecutado. Renderizando clips finales...");
                    } else {
                        console.log("❌ No encontré el botón de Continue.");
                    }
                    
                    await browser.close();
                    return;
                }
                await browser.close();
            } catch(e) {}
        }
    }
    console.log("❌ No se encontró capcut.com");
}
continueCapCut();
