// TLI Service Worker v17 - Force update
const CACHE_NAME = 'tli-cache-v17';
const STATIC_ASSETS = [
  '/tli-gestion/',
  '/tli-gestion/index.html',
  '/tli-gestion/app.js',
  '/tli-gestion/modules/utils.js',
  '/tli-gestion/modules/data.js',
  '/tli-gestion/modules/server.js',
  '/tli-gestion/modules/notifs.js',
  '/tli-gestion/modules/photos.js',
  '/tli-gestion/modules/timer.js',
  '/tli-gestion/modules/calc.js',
  '/tli-gestion/modules/ui.js',
  '/tli-gestion/modules/prospection.js',
  '/tli-gestion/data_prospects.js',
  '/tli-gestion/logo-192.png',
  '/tli-gestion/logo-512.png',
  '/tli-gestion/logo-apple-180.png',
  '/tli-gestion/manifest.json'
];

// Installation : met en cache et force l'activation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.log('[SW] Certains assets non cacheables (normal pour Google Sheets)');
      });
    }).then(() => {
      self.skipWaiting();
    })
  );
});

// Activation : nettoie les anciens caches et prend le controle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      // Notifier tous les clients qu'une mise a jour est disponible
      return self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'SW_UPDATED', version: CACHE_NAME });
        });
      });
    })
  );
});

// Fetch : network-first pour le HTML, cache-first pour les assets statiques
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ne pas intercepter les requetes vers d'autres origines (Google Sheets, API, etc.)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Pour les assets statiques (images, manifest) -> cache first
  if (request.destination === 'image' || request.url.includes('manifest.json')) {
    event.respondWith(
      caches.match(request).then(cached => {
        return cached || fetch(request).then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // Pour le reste -> network first avec fallback cache
  event.respondWith(
    fetch(request).then(response => {
      if (response.status === 200) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
      }
      return response;
    }).catch(() => {
      return caches.match(request).then(cached => {
        if (cached) return cached;
        return new Response('Hors ligne', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      });
    })
  );
});

// Ecouter les messages du client (forcer le reload)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
