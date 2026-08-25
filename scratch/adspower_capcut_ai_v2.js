const { chromium } = require('playwright');
const fs = require('fs');
const glob = require('glob');

async function findCapCutPage() {
    console.log("🔥 Buscando pestaña de CapCut en todos los perfiles de AdsPower...");
    
    // Buscar todos los puertos activos de AdsPower
    const basePath = '/Users/felipeandresvivancocornejo/Library/Application Support/adspower_global/cwd_global/source/cache/';
    const dirs = fs.readdirSync(basePath);
    
    for (const dir of dirs) {
        const portFile = `${basePath}/${dir}/DevToolsActivePort`;
        if (fs.existsSync(portFile)) {
            const fileContent = fs.readFileSync(portFile, 'utf8').split('\n');
            const port = fileContent[0].trim();
            const uuidPath = fileContent[1].trim();
            const wsEndpoint = `ws://127.0.0.1:${port}${uuidPath}`;
            
            try {
                const browser = await chromium.connectOverCDP(wsEndpoint);
                const contexts = browser.contexts();
                for (const context of contexts) {
                    const page = context.pages().find(p => p.url().includes('capcut.com'));
                    if (page) {
                        console.log(`👁️ Pestaña de CapCut encontrada en perfil ${dir}. Tomando el control...`);
                        await page.bringToFront();
                        
                        const promptWaldorf = "Genera un video vertical (9:16) de 15 segundos con estética orgánica, natural y calmada. Luz cálida de mañana (golden hour). Primer plano de manos de un niño amasando pan sobre una mesa de madera rústica. Estilo cinematográfico, alta calidad, colores terracota y verde salvia. Sin transiciones bruscas.";
                        
                        console.log("✍️ Escribiendo prompt táctil como humano...");
                        const textArea = await page.$('textarea, [contenteditable="true"]');
                        if (textArea) {
                            await textArea.focus();
                            await page.keyboard.type(promptWaldorf, { delay: 50 });
                            console.log("✅ Prompt inyectado con éxito.");
                        } else {
                            console.log("❌ No se encontró la caja de texto. Probablemente CapCut cambió la UI.");
                        }
                        
                        await browser.close();
                        console.log("🚀 Misión cumplida. Control devuelto al usuario.");
                        return;
                    }
                }
                await browser.close();
            } catch (e) {
                // Ignore connection errors for stale ports
            }
        }
    }
    console.log("❌ No se encontró capcut.com en ningún perfil activo de AdsPower.");
}

findCapCutPage();
