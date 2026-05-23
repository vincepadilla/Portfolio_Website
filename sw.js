const APP_CACHE = 'portfolio-app-v2';
const RUNTIME_CACHE = 'portfolio-runtime-v2';

const APP_SHELL = [
  './',
  './index.html',
  './src/profilelight.webp',
  './src/profiledark.webp',
  './src/Gallery/DSCF0983.webp?v=1',
  './src/Gallery/image13.webp?v=1',
  './src/Gallery/googlepic.webp?v=1',
  './src/Gallery/webdesign.webp?v=1',
  './src/Gallery/image11.webp?v=1',
  './src/Gallery/image12.webp?v=1',
  './src/Gallery/dapimage.webp?v=1',
  './src/Gallery/image4.webp'
];

const CROSS_ORIGIN_CACHE = ['cdn.tailwindcss.com', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== APP_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || (await fetchPromise);
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.origin === self.location.origin) {
    if (event.request.destination === 'document') {
      event.respondWith(networkFirst(event.request));
      return;
    }

    if (['image', 'style', 'script', 'font'].includes(event.request.destination)) {
      event.respondWith(cacheFirst(event.request));
      return;
    }
  }

  if (CROSS_ORIGIN_CACHE.includes(url.host)) {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});
