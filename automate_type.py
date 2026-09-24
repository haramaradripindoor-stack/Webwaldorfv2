import os
import asyncio
from playwright.async_api import async_playwright

async def main():
    base_path = '/Users/felipeandresvivancocornejo/Library/Application Support/adspower_global/cwd_global/source/cache/'
    active_ws = []
    for d in os.listdir(base_path):
        port_file = os.path.join(base_path, d, 'DevToolsActivePort')
        if os.path.exists(port_file):
            with open(port_file, 'r') as f:
                lines = f.read().splitlines()
                if len(lines) >= 2:
                    active_ws.append(f"ws://127.0.0.1:{lines[0]}{lines[1]}")
    
    async with async_playwright() as p:
        for ws in active_ws:
            try:
                browser = await p.chromium.connect_over_cdp(ws)
                for context in browser.contexts:
                    for page in context.pages:
                        if "business.facebook.com" in page.url:
                            print("Connected to Meta!")
                            await page.bring_to_front()
                            
                            text = """La infancia no necesita pantallas; necesita tribu, madera, fuego y tradición. 🍂

Así se vivieron nuestras Fiestas Patrias bajo el cielo del sur. Un registro de lo que significa la Economía Fraterna: familias enteras sosteniendo juntas este refugio educativo para que nuestros niños puedan crecer a su propio ritmo. 

Tómate un minuto, enciende el volumen y respira el ritmo de nuestro colegio.

🗞️ Hemos preparado con mucho cariño una crónica y una galería fotográfica de este día. Te invitamos a leerla con calma en la sección de Noticias de nuestra web: colegiowaldorftrekan.cl

#PuertoVaras #Llanquihue #ColegioWaldorfChile #CrianzaConsciente"""
                            
                            try:
                                # Enfocar el editor y typear
                                await page.evaluate('''() => {
                                    const editor = document.querySelector('[contenteditable="true"]');
                                    if(editor) editor.focus();
                                }''')
                                print("Focused editor!")
                                await page.keyboard.type(text, delay=10)
                                print("Text typed!")
                            except Exception as e:
                                print("Error typing:", e)

                            await browser.close()
                            return
                await browser.close()
            except Exception as e:
                pass

asyncio.run(main())
