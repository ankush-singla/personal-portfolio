import * as fs from 'fs';

async function fetchBackground() {
  const res = await fetch('https://www.ankushmsingla.com/my-background');
  const text = await res.text();
  const searchPattern = /Work experience(.*?)(Education|Personal Interests|Contact)/is;
  const match = text.match(searchPattern);
  if (match) {
    fs.writeFileSync('bg.html', match[1]);
  }
}
fetchBackground();
