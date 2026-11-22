// Bite Timer service worker: keeps the app working offline.
// Network first, so updates show up whenever there's a connection; the cache is the fallback.
// The file list comes from index.html itself, so adding a creature or home never needs a change here.
const CACHE = 'bite-timer-v2';

async function precache() {
  const cache = await caches.open(CACHE);
  const shell = ['./', 'index.html', 'styles.css', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'];
  try {
    const html = await (await fetch('index.html', { cache: 'no-store' })).text();
    for (const m of html.matchAll(/<script src="([^"]+)"/g)) shell.push(m[1]);
  } catch (e) { /* offline during install: cache what we can */ }
  await Promise.all(shell.map(u => cache.add(u).catch(() => {})));
}

self.addEventListener('install', e => {
  e.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('bite-timer-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !isFont) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true })
        .then(r => r || (req.mode === 'navigate' ? caches.match('index.html') : undefined)))
  );
});
