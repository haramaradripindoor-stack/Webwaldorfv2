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
    
    if not active_ws:
        print("No active AdsPower instances found.")
        return

    async with async_playwright() as p:
        for ws in active_ws:
            try:
                browser = await p.chromium.connect_over_cdp(ws)
                contexts = browser.contexts
                for context in contexts:
                    for page in context.pages:
                        print(f"Checking URL: {page.url}")
                        if "business.facebook.com" in page.url:
                            print("FOUND META BUSINESS SUITE!")
                            await page.bring_to_front()
                            
                            # Let's take a screenshot to see what it looks like before clicking
                            await page.screenshot(path="meta_suite_screenshot.png")
                            print("Screenshot saved.")
                            
                            await browser.close()
                            return
                await browser.close()
            except Exception as e:
                print("Failed to connect to", ws, e)

asyncio.run(main())
