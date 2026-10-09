const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function extractToken() {
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

    if (!browser) {
        console.log("❌ No se encontró el Explorador.");
        return;
    }
    
    const page = browser.contexts()[0].pages().find(p => p.url().includes('developers.facebook.com/tools/explorer'));
    await page.bringToFront();

    console.log("extrayendo token de la caja de texto...");
    
    // Extraer el valor del token directamente de la pantalla
    const token = await page.evaluate(() => {
        // En el explorador, el token suele estar en un div o span con la clase particular, o en un input.
        // Lo más seguro es buscar el texto que empieza con EAA...
        const allText = document.body.innerText;
        const match = allText.match(/EAA[a-zA-Z0-9]+/);
        if (match) return match[0];
        
        // Si no, buscar en los inputs o textareas
        const inputs = Array.from(document.querySelectorAll('input, textarea'));
        for (const input of inputs) {
            if (input.value && input.value.startsWith('EAA')) {
                return input.value;
            }
        }
        return null;
    });

    if (token) {
        console.log("✅ TOKEN EXTRAIDO EXITOSAMENTE:");
        console.log(token);
    } else {
        console.log("❌ No pude encontrar un token que empiece con EAA en la pantalla.");
    }

    setTimeout(() => { process.exit(0); }, 1000);
}

extractToken().catch(console.log);
