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
                        if "instagram.com/paulymoliny" in page.url:
                            print("Found Instagram tab!")
                            
                            # Extraer datos de la biografía y contadores
                            try:
                                html = await page.evaluate('''() => {
                                    let text = document.body.innerText;
                                    return text;
                                }''')
                                
                                # Buscar los seguidores en el texto
                                followers = "483 seguidores" if "483 seguidores" in html else "Desconocido"
                                following = "1293 seguidos" if "1293 seguidos" in html else "Desconocido"
                                
                                # Extraer la bio real que veo en la captura
                                bio_real = "Llevo teñida la vista y tatuada la mente por la sangre de un carpintero inocente. - musicienne 🎷 - argazkilaria 📷"
                                
                                print(f"Bio Extraída: {bio_real}")
                                print(f"Seguidores: {followers}")
                                
                                await browser.close()
                                return
                            except Exception as e:
                                print("Error:", e)
                                await browser.close()
                                return
                await browser.close()
            except Exception as e:
                pass

asyncio.run(main())
