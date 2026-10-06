const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function extractLeads() {
    let wsEndpoint;
    const basePath = '/Users/felipeandresvivancocornejo/Library/Application Support/adspower_global/cwd_global/source/cache/';
    
    const dirs = fs.readdirSync(basePath);
    for (const dir of dirs) {
        const portFile = path.join(basePath, dir, 'DevToolsActivePort');
        if (fs.existsSync(portFile)) {
            try {
                const fileContent = fs.readFileSync(portFile, 'utf8').split('\n');
                const port = fileContent[0].trim();
                
                const response = await fetch(`http://127.0.0.1:${port}/json/version`);
                const data = await response.json();
                
                if (data.webSocketDebuggerUrl) {
                    wsEndpoint = data.webSocketDebuggerUrl;
                    const browser = await chromium.connectOverCDP(wsEndpoint);
                    
                    const contexts = browser.contexts();
                    let page = null;
                    for (const context of contexts) {
                        for (const p of context.pages()) {
                            if (p.url().includes('instagram.com')) {
                                page = p;
                                break;
                            }
                        }
                    }
                    
                    if (page) {
                        await page.bringToFront();
                        const htmlDump = await page.evaluate(() => {
                            // Buscar en el DOM los nombres de los usuarios de las notificaciones
                            // La clase de notificaciones puede variar, tomemos todos los enlaces
                            const links = Array.from(document.querySelectorAll('a'));
                            return links.map(a => a.getAttribute('href')).filter(h => h && h.startsWith('/') && h.length > 2);
                        });
                        
                        console.log("=== ENLACES ===");
                        console.log(Array.from(new Set(htmlDump)).join('\n'));
                        
                        // Opciones de texto para identificar a los que siguieron o interactuaron
                        const texts = await page.evaluate(() => {
                            const elements = Array.from(document.querySelectorAll('span, div, a'));
                            const users = new Set();
                            elements.forEach(el => {
                                const txt = el.innerText;
                                if (txt && (txt.includes('comenzado a seguirte') || txt.includes('gustado tu'))) {
                                   users.add(txt);
                                }
                            });
                            return Array.from(users);
                        });
                        console.log("=== TEXTOS NOTIFICACIONES ===");
                        console.log(texts.join('\n'));

                        await browser.close();
                        return;
                    } else {
                        await browser.close();
                    }
                }
            } catch(e) { }
        }
    }
}

extractLeads();
