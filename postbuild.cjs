const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'dist');
const oldOrigin = 'https://bigcool.vercel.app';
const productionOrigin = 'https://bigcool-xi.vercel.app';
let edited = 0;
for (const name of fs.readdirSync(root)) {
  if (!/\.(?:html|xml|txt|js)$/.test(name)) continue;
  const file = path.join(root, name);
  if (!fs.statSync(file).isFile()) continue;
  const text = fs.readFileSync(file, 'utf8');
  let next = text.split(oldOrigin).join(productionOrigin);
  if (name === 'sw.js') next = next.replace('ultramax7pro-bigcool-brand-v4', 'ultramax7pro-bigcool-brand-v5');
  if (next !== text) { fs.writeFileSync(file, next); edited++; }
}
console.log('Bigcool production URLs/PWA cache normalized in', edited, 'files');
