
const CACHE = 'carioca-v2';
const CORE_ASSETS = [
  './carioca-pwa.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE_ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return; e.respondWith((async()=>{const c=await caches.match(e.request);if(c)return c;try{const n=await fetch(e.request);if(new URL(e.request.url).origin===self.location.origin){const copy=n.clone();(await caches.open(CACHE)).put(e.request,copy);}return n;}catch{return caches.match('./carioca-pwa.html');}})());});
