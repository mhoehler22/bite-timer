// Draws the app icon (a sleepy sloth on a cotton-candy square) with the app's own art kit.
// Usage: node tools/make-icons.js            -> writes icons/icon.svg
//        then render PNGs with Edge (see docs/ADDING_CONTENT.md, "App icon").
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const ctx = { window: {}, console, URLSearchParams, location: { search: '' } };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ['js/core/util.js', 'js/core/art.js', 'js/core/registry.js', 'js/creatures/sloth.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
}
const { BT } = ctx;
const A = BT.art;

const { out, defs } = A.collect(() => {
  const p = A.pack('#FFCCB0', '#FFB7D5');
  p.sleepy = true;
  const sloth = BT.creatures.sloth.poses.hug.draw(p);
  return `<rect width="512" height="512" fill="url(#bgIcon)"/>` +
    `<circle cx="256" cy="300" r="168" fill="#fff" opacity=".45"/>` +
    A.sparkle(112, 120, 1.7, '#fff') + A.sparkle(408, 150, 1.2, '#fff') + A.sparkle(396, 404, 1.4, '#FFE89C') +
    A.heart(118, 396, 1.1, '#FFB7D5', false) +
    `<g transform="translate(256 392) scale(3.1)">${sloth}</g>`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs>${defs}` +
  `<linearGradient id="bgIcon" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD6E8"/><stop offset="1" stop-color="#DCCBFF"/></linearGradient>` +
  `</defs>${out}</svg>`;
fs.writeFileSync(path.join(root, 'icons', 'icon.svg'), svg);
console.log('wrote icons/icon.svg', svg.length, 'bytes');
