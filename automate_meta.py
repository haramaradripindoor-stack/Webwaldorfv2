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
                    ws = f"ws://127.0.0.1:{lines[0]}{lines[1]}"
                    active_ws.append(ws)
    
    async with async_playwright() as p:
        for ws in active_ws:
            try:
                browser = await p.chromium.connect_over_cdp(ws)
                for context in browser.contexts:
                    for page in context.pages:
                        if "business.facebook.com/latest" in page.url:
                            print("Found Meta Business Suite!")
                            await page.bring_to_front()
                            
                            # Intentar buscar el botón "Crear publicación"
                            try:
                                await page.get_by_text('Crear publicación', exact=False).first.click(timeout=5000)
                                print("Clicked 'Crear publicación'")
                                await page.wait_for_timeout(3000)
                            except Exception as e:
                                print("No se pudo hacer clic en Crear publicación:", e)

                            await browser.close()
                            return
                await browser.close()
            except Exception as e:
                pass

asyncio.run(main())
