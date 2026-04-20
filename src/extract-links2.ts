import * as fs from 'fs';

const text = fs.readFileSync('bg-full.html', 'utf-8');
const urls = [...text.matchAll(/href="([^"]+)"/g)]
  .map(m => m[1])
  .filter(u => u.startsWith('http'));
console.log([...new Set(urls)].join('\n'));
