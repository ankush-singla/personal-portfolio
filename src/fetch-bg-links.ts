import * as fs from 'fs';

async function fetchBackground() {
  const res = await fetch('https://www.ankushmsingla.com/my-background');
  const text = await res.text();
  fs.writeFileSync('bg-full.html', text);
  console.log("Saved full bg.");
}
fetchBackground();
