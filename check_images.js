const fs = require('fs');
const path = require('path');
const html = fs.readFileSync('index.html', 'utf8');
const regex = /<img[^>]+src=["']([^"']+)["']/g;
let match;
let broken = 0;
while ((match = regex.exec(html))) {
  let src = match[1];
  if (!src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
    if (src.startsWith('/')) src = src.substring(1);
    if (!fs.existsSync(src)) {
      console.log('BROKEN:', src);
      broken++;
    }
  }
}
console.log('Total broken images:', broken);
