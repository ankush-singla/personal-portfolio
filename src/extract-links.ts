import * as fs from 'fs';

const text = fs.readFileSync('bg-full.html', 'utf-8');
const urls = [...text.matchAll(/https:\/\/www\.google\.com\/url\?q=([^&"]+)/g)]
  .map(m => decodeURIComponent(m[1]));
console.log([...new Set(urls)].join('\n'));
