const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function controlAdsPower() {
    console.log("🔍 Buscando AdsPower activo...");
    const basePath = '/Users/felipeandresvivancocornejo/Library/Application Support/adspower_global/cwd_global/source/cache/';
    
    if (!fs.existsSync(basePath)) {
        console.error("No se encontró la ruta de AdsPower.");
        return;
    }

    const dirs = fs.readdirSync(basePath);
    let wsEndpoint;
    let browser;

    for (const dir of dirs) {
        const portFile = path.join(basePath, dir, 'DevToolsActivePort');
        if (fs.existsSync(portFile)) {
            try {
                const fileContent = fs.readFileSync(portFile, 'utf8').split('\n');
                const port = fileContent[0].trim();
                const uuidPath = fileContent[1].trim();
                
                // Fetch the version JSON to get the real websocket URL
                const response = await fetch(`http://127.0.0.1:${port}/json/version`);
                const data = await response.json();
                wsEndpoint = data.webSocketDebuggerUrl;
                
                console.log(`🔌 Intentando conectar a: ${wsEndpoint}`);
                browser = await chromium.connectOverCDP(wsEndpoint);
                
                // Check if this browser has the Graph API Explorer open
                const contexts = browser.contexts();
                const hasTarget = contexts[0].pages().some(p => p.url().includes('developers.facebook.com/tools/explorer'));
                
                if (hasTarget) break; // Found the right browser
                else {
                    await browser.close();
                    browser = null;
                }
            } catch(e) {
                // Ignore dead ports
            }
        }
    }

    if (!browser) {
        console.error("❌ No se encontró ninguna pestaña con el Explorador de la API Graph abierto en AdsPower.");
        return;
    }

    console.log("✅ Conectado exitosamente a AdsPower.");
    const contexts = browser.contexts();
    const page = contexts[0].pages().find(p => p.url().includes('developers.facebook.com/tools/explorer'));
    
    await page.bringToFront();
    console.log("👁️ Pestaña del Explorador traída al frente.");

    // Evaluate the DOM to see which permissions are checked in the visual list
    const checkedPermissions = await page.evaluate(() => {
        // Find the visual list of permissions added
        const elements = document.querySelectorAll('[data-testid="permissions-list"] span, ._5r_n, [class*="permission"]');
        
        // This relies on the UI of Meta, let's just get the text of the selected items area
        // A more robust way is to just grab the raw text of the permissions section
        const permContainer = document.querySelector('label[aria-label="Seleccionar permisos"]')?.parentElement?.parentElement?.parentElement;
        if (permContainer) return permContainer.innerText;
        
        return document.body.innerText;
    });

    console.log("==== PERMISOS ENCONTRADOS EN EL DOM ====");
    if (checkedPermissions.includes("pages_read_user_content")) {
        console.log("✅ pages_read_user_content SÍ está tickeado en la pantalla.");
    } else {
        console.log("❌ pages_read_user_content NO está tickeado.");
    }

    if (checkedPermissions.includes("instagram_basic")) {
        console.log("✅ instagram_basic SÍ está tickeado en la pantalla.");
    } else {
        console.log("❌ instagram_basic NO está tickeado.");
    }

    // Let's force add them if they are missing
    try {
        console.log("🤖 Inyectando permisos faltantes manualmente en el input...");
        
        // Click the input box to add permissions
        await page.click('input[placeholder*="permiso"], input[aria-label*="permiso"]', { timeout: 2000 }).catch(()=>null);
        
        // Type pages_read_user_content
        await page.keyboard.type('pages_read_user_content');
        await page.waitForTimeout(1000);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);

        // Type instagram_basic
        await page.keyboard.type('instagram_basic');
        await page.waitForTimeout(1000);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);

        // Click Generate Access Token (it has text "Generate Access Token")
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('div[role="button"]'));
            const genBtn = btns.find(b => b.innerText.includes('Generate Access Token'));
            if (genBtn) genBtn.click();
        });
        
        console.log("🖱️ Se hizo clic en 'Generate Access Token'.");
        
    } catch (e) {
        console.log("No se pudo inyectar automáticamente. Error:", e.message);
    }

    await browser.disconnect();
    console.log("👋 Desconectado de AdsPower.");
}

controlAdsPower().catch(console.error);
