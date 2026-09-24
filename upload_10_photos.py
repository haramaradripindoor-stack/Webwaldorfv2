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
                            print("Encontrada pestaña de Meta!")
                            await page.bring_to_front()
                            
                            # Si la ventana de programación está abierta, cerrarla
                            try:
                                await page.get_by_role('button', name='Cancelar').click(timeout=2000)
                                print("Modal de programación cerrado.")
                            except:
                                pass

                            img_dir = "/Users/felipeandresvivancocornejo/Documents/GitHub/Webwaldorfv2/public/imagenes-web/fiestas-2026"
                            files_to_upload = [
                                "drone_patrias.webp",
                                "_MG_5403.webp",
                                "_MG_5422.webp",
                                "_MG_5437.webp",
                                "_MG_5450.webp",
                                "_MG_5465.webp",
                                "_MG_5475.webp",
                                "_MG_5482.webp",
                                "_MG_5497.webp",
                                "_MG_5520.webp"
                            ]
                            
                            absolute_paths = [os.path.join(img_dir, f) for f in files_to_upload]
                            
                            # Inyectar archivos
                            try:
                                inputs = await page.locator('input[type="file"]').all()
                                for inp in inputs:
                                    try:
                                        await inp.set_input_files(absolute_paths)
                                        print("¡10 Fotos inyectadas exitosamente!")
                                        break
                                    except Exception as e:
                                        print("Fallo en este input:", e)
                            except Exception as e:
                                print("Error inyectando fotos:", e)

                            await browser.close()
                            return
                await browser.close()
            except Exception as e:
                pass

asyncio.run(main())
