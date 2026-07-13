import fs from 'fs';
const text = fs.readFileSync('C:\\Users\\FELIP\\.gemini\\config\\AGENTS.md', 'utf8');
const lines = text.split('\n');
console.log(lines.slice(Math.max(lines.length - 150, 0)).join('\n'));
