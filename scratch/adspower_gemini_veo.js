const { chromium } = require('playwright');
const fs = require('fs');

async function automateGeminiVeo() {
    console.log("🔥 Buscando pestaña de Gemini en AdsPower...");
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
                    const page = context.pages().find(p => p.url().includes('gemini.google.com'));
                    if (page) {
                        console.log(`👁️ Pestaña de Gemini encontrada en perfil ${dir}. Tomando el control...`);
                        await page.bringToFront();
                        
                        // Prompt optimizado para el motor Veo/Omni de Gemini
                        const promptWaldorf = "Genera un clip de video fotorrealista y muy lento. Primer plano de manos de un niño pequeño amasando pan sobre una mesa de madera rústica antigua. Luz cálida natural entrando por una ventana (golden hour), iluminando el polvo de la harina. Textura orgánica, colores terracota y madera. Cinematográfico, 4k, cámara fija con levísimo movimiento de acercamiento.";
                        
                        console.log("✍️ Escribiendo prompt táctil como humano...");
                        
                        // En Gemini la caja principal es un rich-text editor (contenteditable)
                        const textArea = await page.$('rich-textarea, [contenteditable="true"]');
                        if (textArea) {
                            await textArea.focus();
                            
                            // Asegurarnos de que el formato se ponga en Vertical 9:16 si está disponible
                            // Pero primero escribimos el prompt
                            await page.keyboard.type(promptWaldorf, { delay: 30 });
                            console.log("✅ Prompt inyectado en Gemini Veo con éxito.");
                            
                            // Hacemos Enter para generar (o Ctrl+Enter)
                            await page.keyboard.press('Enter');
                            console.log("🚀 Generación de video iniciada.");
                        } else {
                            console.log("❌ No se encontró la caja de texto en Gemini.");
                        }
                        
                        await browser.close();
                        return;
                    }
                }
                await browser.close();
            } catch (e) {
                // Ignore stale ports
            }
        }
    }
    console.log("❌ No se encontró gemini.google.com en ningún perfil activo.");
}

automateGeminiVeo();
