const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function fixPermissions() {
    console.log("🔍 Buscando AdsPower...");
    const basePath = '/Users/felipeandresvivancocornejo/Library/Application Support/adspower_global/cwd_global/source/cache/';
    const dirs = fs.readdirSync(basePath);
    let wsEndpoint, browser;

    for (const dir of dirs) {
        const portFile = path.join(basePath, dir, 'DevToolsActivePort');
        if (fs.existsSync(portFile)) {
            try {
                const fileContent = fs.readFileSync(portFile, 'utf8').split('\n');
                const response = await fetch(`http://127.0.0.1:${fileContent[0].trim()}/json/version`);
                const data = await response.json();
                wsEndpoint = data.webSocketDebuggerUrl;
                browser = await chromium.connectOverCDP(wsEndpoint);
                if (browser.contexts()[0].pages().some(p => p.url().includes('developers.facebook.com/tools/explorer'))) break;
                await browser.close();
                browser = null;
            } catch(e) {}
        }
    }

    if (!browser) return console.log("❌ No se encontró el Explorador abierto.");
    
    const page = browser.contexts()[0].pages().find(p => p.url().includes('developers.facebook.com/tools/explorer'));
    await page.bringToFront();

    console.log("Limpiando caja de texto y metiendo permisos 1 por 1 con pausa...");
    
    // Clear the input box
    const inputSelector = 'input[placeholder*="permiso"], input[aria-label*="permiso"]';
    await page.fill(inputSelector, '');
    
    // Type first permission
    await page.type(inputSelector, 'pages_read_user_content', { delay: 50 });
    await page.waitForTimeout(1000);
    await page.keyboard.press('ArrowDown'); // sometimes needed to select the first autocomplete option
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Type second permission
    await page.type(inputSelector, 'instagram_basic', { delay: 50 });
    await page.waitForTimeout(1000);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Click Generate Access Token
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('div[role="button"]'));
        const genBtn = btns.find(b => b.innerText.includes('Generate Access Token'));
        if (genBtn) genBtn.click();
    });
    console.log("✅ Listo, presionado Generate Access Token.");

    setTimeout(() => { process.exit(0); }, 2000); // hard exit to avoid disconnect issues
}

fixPermissions().catch(console.log);
