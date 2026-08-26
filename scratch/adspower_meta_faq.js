const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function scrapeFAQ() {
    console.log("🔥 Buscando pestaña de Meta Business Suite en AdsPower...");
    const basePath = process.platform === 'win32' ? 'C:\\.ADSPOWER_GLOBAL\\cache\\' : '/Users/felipeandresvivancocornejo/Library/Application Support/adspower_global/cwd_global/source/cache/';
    const dirs = fs.readdirSync(basePath);
    
    let browser;
    for (const dir of dirs) {
        const portFile = path.join(basePath, dir, 'DevToolsActivePort');
        if (fs.existsSync(portFile)) {
            try {
                const fileContent = fs.readFileSync(portFile, 'utf8').split('\n');
                const port = fileContent[0].trim();
                const uuidPath = fileContent[1].trim();
                const wsEndpoint = `ws://127.0.0.1:${port}${uuidPath}`;
                
                browser = await chromium.connectOverCDP(wsEndpoint);
                
                const page = browser.contexts()[0].pages().find(p => p.url().includes('business.facebook.com/latest/inbox/automated_responses'));
                
                if (page) {
                    console.log(`👁️ Meta Business Suite encontrado. Buscando 'Preguntas frecuentes'...`);
                    await page.bringToFront();
                    
                    // Buscar el botón 'Editar' de la fila de 'Preguntas frecuentes'
                    // Como el DOM de React de Meta es ofuscado, buscamos el texto
                    const success = await page.evaluate(async () => {
                        const rows = Array.from(document.querySelectorAll('div[role="row"], tr, div.x1n2onr6'));
                        let faqRow = rows.find(r => r.innerText && r.innerText.includes('Preguntas frecuentes'));
                        if (!faqRow) {
                           // Try finding by text
                           const texts = Array.from(document.querySelectorAll('*'));
                           const faqText = texts.find(t => t.innerText === 'Preguntas frecuentes' && t.children.length === 0);
                           if (faqText) faqRow = faqText.closest('div[role="row"]') || faqText.parentElement.parentElement.parentElement;
                        }

                        if (faqRow) {
                            const editBtn = Array.from(faqRow.querySelectorAll('div[role="button"], button')).find(b => b.innerText && b.innerText.includes('Editar'));
                            if (editBtn) {
                                editBtn.click();
                                return true;
                            }
                        }
                        // Fallback click on the specific edit button if index known, but let's just use text
                        const allEditBtns = Array.from(document.querySelectorAll('div[role="button"]')).filter(b => b.innerText === 'Editar');
                        if (allEditBtns.length >= 3) {
                             allEditBtns[2].click(); // usually the 3rd one based on the screenshot (1. AutoDM, 2. Resp auto, 3. FAQ)
                             return true;
                        }
                        return false;
                    });
                    
                    if (success) {
                        console.log("✅ Clic en 'Editar' ejecutado. Esperando que cargue el panel...");
                        await page.waitForTimeout(3000); // esperar animación y carga de red
                        
                        // Extraer inputs y textareas
                        const faqs = await page.evaluate(() => {
                            const inputs = Array.from(document.querySelectorAll('input[type="text"]')).map(i => i.value).filter(v => v.length > 5);
                            const textareas = Array.from(document.querySelectorAll('textarea')).map(t => t.value).filter(v => v.length > 5);
                            return { questions: inputs, answers: textareas };
                        });
                        
                        console.log("🎯 FAQs Extraídas:");
                        console.log(JSON.stringify(faqs, null, 2));
                        
                        // Hacer clic en Cancelar para no romper nada
                        await page.evaluate(() => {
                            const cancel = Array.from(document.querySelectorAll('div[role="button"], button')).find(b => b.innerText && b.innerText.includes('Cancelar'));
                            if (cancel) cancel.click();
                        });
                        
                    } else {
                        console.log("❌ No encontré el botón de Editar de Preguntas Frecuentes.");
                    }
                    
                    await browser.close();
                    return;
                }
                await browser.close();
            } catch(e) {}
        }
    }
    console.log("❌ No se encontró Meta Business Suite.");
}
scrapeFAQ();
