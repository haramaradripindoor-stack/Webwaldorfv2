const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function checkAll() {
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
                    console.log(`\n\nConectado a puerto ${port} (Dir: ${dir})`);
                    const browser = await chromium.connectOverCDP(data.webSocketDebuggerUrl);
                    for (const context of browser.contexts()) {
                        for (const p of context.pages()) {
                            console.log(`URL: ${p.url()}`);
                            if (p.url().includes('instagram.com')) {
                                const html = await p.content();
                                if (html.includes('Notificaciones')) {
                                    console.log("-> ¡Contiene Notificaciones!");
                                    // Extract usernames here
                                    const rawUsers = await p.evaluate(() => {
                                        // Las notificaciones suelen tener div > a[href="/username/"]
                                        // o el username es un elemento con titulo de usuario
                                        // Extraigamos todos los a[href] que tengan texto y no sean nuestros
                                        const users = [];
                                        const links = document.querySelectorAll('a[href]');
                                        for(let a of links) {
                                           let h = a.getAttribute('href');
                                           if(h.startsWith('/') && h.split('/').length === 3 && h.length > 2) {
                                                const u = h.split('/')[1];
                                                if(u !== 'explore' && u !== 'reels' && u !== 'direct' && u !== 'stories' && u !== 'waldorftrekanpv') {
                                                    // Vamos a tratar de atrapar el texto hermano
                                                    let txt = a.parentElement?.parentElement?.innerText || "";
                                                    if(txt.includes('seguirte') || txt.includes('gustado') || txt.includes('comenzado')) {
                                                        users.push(u);
                                                    }
                                                }
                                           }
                                        }
                                        return users;
                                    });
                                    console.log("Leads encontrados:", Array.from(new Set(rawUsers)));
                                }
                            }
                        }
                    }
                    await browser.close();
                }
            } catch(e) { }
        }
    }
}
checkAll();
