const { chromium } = require('playwright');
const fs = require('fs');

async function automateCapCutAI() {
    console.log("🔥 Activando Secuestro de AdsPower (Agencia Protocolo V2)...");

    try {
        // Obtenemos el puerto de la primera sesión activa encontrada
        const activePortFile = '/Users/felipeandresvivancocornejo/Library/Application Support/adspower_global/cwd_global/source/cache/k1eag0sn_i71c4x/DevToolsActivePort';
        const fileContent = fs.readFileSync(activePortFile, 'utf8').split('\n');
        const port = fileContent[0].trim();
        const uuidPath = fileContent[1].trim();
        
        // Hacemos el fetch de WebSocket URL directo (Bypass avanzado)
        const wsEndpoint = `ws://127.0.0.1:${port}${uuidPath}`;
        console.log(`🔌 Conectando Playwright a: ${wsEndpoint}`);

        const browser = await chromium.connectOverCDP(wsEndpoint);
        const contexts = browser.contexts();
        
        // Buscamos la pestaña de CapCut
        const page = contexts[0].pages().find(p => p.url().includes('capcut.com'));
        
        if (page) {
            console.log("👁️ Pestaña de CapCut encontrada. Tomando el control...");
            await page.bringToFront();
            
            // Prompt estratégico Waldorf
            const promptWaldorf = "Genera un video vertical (9:16) de 15 segundos con estética orgánica, natural y calmada. Luz cálida de mañana (golden hour). Primer plano de manos de un niño amasando pan sobre una mesa de madera rústica. Estilo cinematográfico, alta calidad, colores terracota y verde salvia. Sin transiciones bruscas.";
            
            console.log("✍️ Escribiendo prompt táctil como humano...");
            // Asumiendo la caja de texto genérica de Seedance
            const textArea = await page.$('textarea, [contenteditable="true"]');
            if (textArea) {
                await textArea.focus();
                // Inyección segura carácter por carácter para evadir TrustedHTML / Bot Detection
                await page.keyboard.type(promptWaldorf, { delay: 50 });
                console.log("✅ Prompt inyectado con éxito.");
                
                // Darle click a generar (buscar el botón que contenga Generate o la flecha)
                // await page.keyboard.press('Enter');
            } else {
                console.log("❌ No se encontró la caja de texto en la vista actual. ¿Estás en la pantalla de Seedance 2.5?");
            }

        } else {
            console.log("❌ No se encontró ninguna pestaña abierta en capcut.com en este perfil de AdsPower.");
        }
        
        // No desconectamos para no cerrarle el browser al usuario
        browser.disconnect();
        console.log("🚀 Misión cumplida. Control devuelto al usuario.");

    } catch (err) {
        console.error("Error crítico de inyección:", err);
    }
}

automateCapCutAI();
