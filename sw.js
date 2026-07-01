const CACHE_NAME = 'tli-v14-cache-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ============================================================
// INSTALLATION : mise en cache + activation immédiate
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v4...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching assets...');
      return cache.addAll(ASSETS);
    }).catch((err) => {
      console.error('[SW] Cache failed:', err);
      return caches.open(CACHE_NAME).then((cache) => cache.add('./index.html'));
    })
  );

  // Force l'activation immédiate (pas d'attente)
  self.skipWaiting();
});

// ============================================================
// ACTIVATION : nettoyage des anciens caches + prise de contrôle
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v4...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // Prend le contrôle de toutes les pages immédiatement
      return self.clients.claim();
    }).then(() => {
      // Notifier tous les clients que la mise à jour est prête
      return self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SW_UPDATED', version: 'v4' });
        });
      });
    })
  );
});

// ============================================================
// FETCH : stratégie Network-First (toujours réseau, fallback cache)
// ============================================================
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;

  // Ignorer les requêtes Firebase (pas de cache)
  if (event.request.url.includes('firebase') || event.request.url.includes('google')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Réponse réseau OK → mettre à jour le cache
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Réseau indisponible → fallback cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          // Fallback pour navigation
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }

          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// ============================================================
// MESSAGES : écouter les demandes de mise à jour forcée
// ============================================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
