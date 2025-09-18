
const CACHE = 'carioca-v4';
const CORE_ASSETS = [
  './carioca-pwa.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE_ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith((async () => {
    const cached = await caches.match(e.request);
    if (cached) return cached;
    try {
      const net = await fetch(e.request);
      if (new URL(e.request.url).origin === self.location.origin) {
        (await caches.open(CACHE)).put(e.request, net.clone());
      }
      return net;
    } catch {
      return caches.match('./carioca-pwa.html');
    }
  })());
});
