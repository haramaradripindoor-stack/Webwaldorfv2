const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function extractLeads() {
    let wsEndpoint;
    const basePath = '/Users/felipeandresvivancocornejo/Library/Application Support/adspower_global/cwd_global/source/cache/';
    
    if (!fs.existsSync(basePath)) {
        console.log("No se encuentra el directorio de AdsPower");
        return;
    }
    
    const dirs = fs.readdirSync(basePath);
    for (const dir of dirs) {
        const portFile = path.join(basePath, dir, 'DevToolsActivePort');
        if (fs.existsSync(portFile)) {
            try {
                const fileContent = fs.readFileSync(portFile, 'utf8').split('\n');
                const port = fileContent[0].trim();
                console.log(`Intentando puerto: ${port} en dir ${dir}`);
                
                const response = await fetch(`http://127.0.0.1:${port}/json/version`);
                const data = await response.json();
                
                if (data.webSocketDebuggerUrl) {
                    wsEndpoint = data.webSocketDebuggerUrl;
                    console.log(`Conectando a AdsPower vía: ${wsEndpoint}`);
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
                        console.log("Pestaña de Instagram encontrada. Extrayendo usuarios...");
                        await page.bringToFront();
                        
                        const users = await page.evaluate(() => {
                            const links = Array.from(document.querySelectorAll('a[href]'));
                            const usernames = new Set();
                            
                            links.forEach(a => {
                                const href = a.getAttribute('href');
                                if (href.startsWith('/') && href.split('/').length === 3 && href.endsWith('/')) {
                                    const username = href.split('/')[1];
                                    const ignored = ['explore', 'reels', 'direct', 'stories', 'waldorftrekanpv', 'p', 'tv'];
                                    if (!ignored.includes(username) && username.length > 2) {
                                        // Tomamos todos los usernames en el side panel
                                        usernames.add(username);
                                    }
                                }
                            });
                            return Array.from(usernames);
                        });
                        
                        console.log("=== USUARIOS EXTRAIDOS ===");
                        console.log(users.join('\n'));
                        console.log("==========================");
                        
                        await browser.disconnect();
                        return;
                    } else {
                        await browser.disconnect();
                    }
                }
            } catch(e) {
                console.log("Error con puerto en dir " + dir + ": " + e.message);
            }
        }
    }
    console.log("No se encontró pestaña de Instagram activa.");
}

extractLeads();
