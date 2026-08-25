const { chromium } = require('playwright');
const fs = require('fs');

async function automateMetaAds() {
    console.log("🔥 Buscando pestaña del Administrador de Anuncios en AdsPower...");
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
                    // Buscar la pestaña de adsmanager
                    const page = context.pages().find(p => p.url().includes('adsmanager.facebook.com'));
                    if (page) {
                        console.log(`👁️ Pestaña de Meta Ads encontrada en perfil ${dir}. Tomando el control...`);
                        await page.bringToFront();
                        
                        console.log("🖱️ Buscando el botón verde de '+ Crear'...");
                        
                        // Esperar a que el DOM cargue y buscar el botón por su texto o rol
                        // Usamos un selector general para el botón "Crear"
                        const createBtn = await page.getByRole('button', { name: /Crear/i }).first();
                        
                        if (createBtn) {
                            await createBtn.click();
                            console.log("✅ Clic en '+ Crear' ejecutado con éxito.");
                        } else {
                            console.log("❌ No encontré el botón. Inyectando clic crudo en el DOM...");
                            // Fallback: inyectar clic en cualquier botón que contenga "Crear"
                            await page.evaluate(() => {
                                const btns = Array.from(document.querySelectorAll('div[role="button"], button'));
                                const target = btns.find(b => b.innerText && b.innerText.includes('Crear'));
                                if(target) target.click();
                            });
                            console.log("✅ Clic forzado ejecutado.");
                        }
                        
                        await browser.close();
                        console.log("🚀 Ventana de creación abierta. Listo para configurar el Tráfico.");
                        return;
                    }
                }
                await browser.close();
            } catch (e) {
                // Ignore stale ports
            }
        }
    }
    console.log("❌ No se encontró adsmanager.facebook.com en ningún perfil activo.");
}

automateMetaAds();
