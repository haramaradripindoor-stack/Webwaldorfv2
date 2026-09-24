const fs = require('fs');
const content = fs.readFileSync('_noticias/2026-09-22-celebracion-fiestas-patrias-comunidad.md', 'utf8');

const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
const yamlString = match[1];
const data = {};
yamlString.split(/\r?\n/).forEach(line => {
  const colonIndex = line.indexOf(':');
  if (colonIndex > -1) {
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    data[key] = value;
  }
});
console.log("data.imageUrl:", data.imageUrl);
