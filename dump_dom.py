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
                            print("Dumping DOM...")
                            html = await page.evaluate('''() => {
                                let res = [];
                                document.querySelectorAll('*').forEach(el => {
                                    let label = el.getAttribute('aria-label');
                                    let role = el.getAttribute('role');
                                    let text = el.innerText ? el.innerText.substring(0,20).replace(/\n/g, ' ') : '';
                                    if(label || role || (el.tagName === 'BUTTON') || (el.tagName === 'INPUT')) {
                                        res.push(el.tagName + ' | role=' + role + ' | label=' + label + ' | text=' + text);
                                    }
                                });
                                return res.join('\\n');
                            }''')
                            with open('dom_dump.txt', 'w') as f:
                                f.write(html)
                            print("Done")
                            await browser.close()
                            return
                await browser.close()
            except Exception as e:
                pass

asyncio.run(main())
