const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

async function safeNavigate(page, url) {
    try {
        await page.evaluate((u) => { window.location.href = u; }, url);
        await delay(3500); 
    } catch(e) {
        console.log(`⚠️ Error en inyección de navegación hacia ${url}: ${e.message}`);
    }
}

async function executeSniper() {
    // Extraídos directamente de tu captura de pantalla (filtrando cuentas de la agencia/conocidas)
    const targets = [
        "claudiometlifechile", 
        "lore_mr", 
        "natimarinan", 
        "brunopaulorf", 
        "olguitagomez14"
    ];

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
                    const browser = await chromium.connectOverCDP(data.webSocketDebuggerUrl);
                    let page = null;
                    for (const context of browser.contexts()) {
                        for (const p of context.pages()) {
                            if (p.url().includes('instagram.com')) {
                                page = p; break;
                            }
                        }
                    }
                    
                    if (page) {
                        console.log(`\n======================================================`);
                        console.log(`🚀 CONECTADO A ADSPOWER. INICIANDO LLUVIA DE LIKES (SNIPER)`);
                        console.log(`======================================================`);
                        await page.bringToFront();
                        
                        for (const lead of targets) {
                            console.log(`\n🎯 Apuntando a: @${lead}`);
                            const targetUrl = `https://www.instagram.com/${lead}/`;
                            await safeNavigate(page, targetUrl);
                            
                            // Killswitch (Bloqueo de Acción)
                            const textContent = await page.evaluate(() => document.body.innerText);
                            if (textContent.includes("Try again later") || textContent.includes("Inténtalo de nuevo más tarde") || textContent.includes("Restringimos cierta actividad")) {
                                console.log("🚨 KILLSWITCH ACTIVADO: Instagram ha bloqueado acciones. Abortando.");
                                await browser.close();
                                return;
                            }
                            
                            if (textContent.includes("Esta cuenta es privada") || textContent.includes("This account is private")) {
                                console.log(`🔒 @${lead} es cuenta privada. Saltando (No seguiremos la cuenta para mantener el estatus).`);
                                continue;
                            }

                            // Extraer las 3 fotos más recientes
                            const posts = await page.evaluate(() => {
                                const links = Array.from(document.querySelectorAll('a[href^="/p/"], a[href^="/reel/"]'));
                                return links.map(a => a.getAttribute('href')).slice(0, 3);
                            });
                            
                            if (posts.length === 0) {
                                console.log(`⚠️ No se encontraron publicaciones públicas para @${lead}.`);
                                continue;
                            }
                            
                            let likesGiven = 0;
                            for (const post of posts) {
                                const postUrl = `https://www.instagram.com${post}`;
                                await safeNavigate(page, postUrl);
                                await delay(2500 + Math.random() * 2000); 
                                
                                const success = await page.evaluate(() => {
                                    const likeSvg = document.querySelector('svg[aria-label="Me gusta"], svg[aria-label="Like"]');
                                    if (likeSvg) {
                                        let btn = likeSvg.closest('div[role="button"]');
                                        if (btn) {
                                            btn.click();
                                            return true;
                                        }
                                    }
                                    return false; 
                                });
                                
                                if (success) {
                                    likesGiven++;
                                    console.log(`❤️  Like exitoso en post de @${lead}`);
                                } else {
                                    console.log(`🔄 Ya tenía like o botón no encontrado.`);
                                }
                            }
                            
                            console.log(`✅ Lluvia de Likes completada para @${lead}. Total likes: ${likesGiven}`);
                            
                            const waitTime = 12000 + (Math.random() * 8000);
                            console.log(`Escondiendo huella. Esperando ${Math.round(waitTime/1000)}s antes del próximo target...`);
                            await delay(waitTime);
                        }
                        
                        console.log("\n🎉 Misión Sniper completada con éxito. Devolviendo control de AdsPower.");
                        await browser.close();
                        return;
                    } else {
                        await browser.close();
                    }
                }
            } catch (e) {
                // Ignore silent port errors
            }
        }
    }
    console.log("No se encontró AdsPower activo con Instagram.");
}

executeSniper();
