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
                            print("Connected to Meta Business Suite!")
                            await page.bring_to_front()
                            
                            try:
                                # Clic en "Crear publicación"
                                await page.get_by_text('Crear publicación').first.click()
                                await page.wait_for_timeout(4000)
                                print("Opened Create Post modal")
                                
                                # Subir el video
                                video_path = '/Users/felipeandresvivancocornejo/Desktop/Fiestas_Patrias_Trekan_Optimizado.mp4'
                                inputs = await page.locator('input[type="file"]').all()
                                for inp in inputs:
                                    try:
                                        await inp.set_input_files(video_path)
                                        print("Video attached!")
                                        break
                                    except Exception as e:
                                        pass
                                
                                await page.wait_for_timeout(3000)
                                
                                # Escribir el texto
                                text = """La infancia no necesita pantallas; necesita tribu, madera, fuego y tradición. 🍂

Así se vivieron nuestras Fiestas Patrias bajo el cielo del sur. Un registro de lo que significa la Economía Fraterna: familias enteras sosteniendo juntas este refugio educativo para que nuestros niños puedan crecer a su propio ritmo. 

Tómate un minuto, enciende el volumen y respira el ritmo de nuestro colegio.

🗞️ Hemos preparado con mucho cariño una crónica y una galería fotográfica de este día. Te invitamos a leerla con calma en la sección de Noticias de nuestra web: colegiowaldorftrekan.cl

#PuertoVaras #Llanquihue #ColegioWaldorfChile #CrianzaConsciente"""
                                
                                textbox = page.locator('[role="textbox"]').first
                                await textbox.fill(text)
                                print("Text filled!")
                                
                                await browser.close()
                                return
                            except Exception as e:
                                print("Error in automation:", e)
                                await browser.close()
                                return
                await browser.close()
            except Exception as e:
                pass

asyncio.run(main())
