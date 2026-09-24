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
                            print("Conectado a Meta Business Suite...")
                            await page.bring_to_front()
                            
                            # Clic en "Crear publicación" si no está abierto
                            try:
                                await page.get_by_text('Crear publicación', exact=True).first.click(timeout=3000)
                                await page.wait_for_timeout(4000)
                            except:
                                print("Modal ya abierto o botón no encontrado. Continuando...")

                            # Intentar escribir el texto
                            text = """El ritmo, el color y el calor humano. 🔥🍂

[Desliza la galería ➡️]

Las imágenes hablan por sí solas. Nuestras Fiestas Patrias fueron un reflejo de lo que buscamos todos los días en Trekan: una comunidad viva, donde los niños crecen rodeados de sentido, juegos reales y familias presentes.

🗞️ Ya publicamos la crónica completa y la galería en alta resolución en nuestra web (Link en la Bio).

📩 Guarda este post o compártelo por DM con esa familia que está buscando un refugio educativo diferente.

#PuertoVaras #Llanquihue #ColegioWaldorfChile #CrianzaConsciente"""
                            
                            try:
                                await page.evaluate('''() => {
                                    const editor = document.querySelector('[contenteditable="true"]');
                                    if(editor) editor.focus();
                                }''')
                                await page.keyboard.type(text, delay=5)
                                print("Texto inyectado.")
                            except Exception as e:
                                print("Error inyectando texto:", e)

                            await browser.close()
                            return
                await browser.close()
            except Exception as e:
                pass

asyncio.run(main())
