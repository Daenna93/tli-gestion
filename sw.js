const CACHE_NAME = 'tli-v14-cache-v9';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing v9...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
      .catch(() => caches.open(CACHE_NAME).then((cache) => cache.add('./index.html')))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v9...');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firebase') || event.request.url.includes('google')) return;
  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
      }
      return networkResponse;
    }).catch(() =>
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return new Response('Offline', { status: 503 });
      })
    )
  );
});

// ============================================================
// FIREBASE CLOUD MESSAGING (préparation pour notifications push)
// ============================================================
// Importez firebase-messaging-sw.js si vous configurez FCM
// self.importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
// self.importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

self.addEventListener('push', (event) => {
  if (!event.data) return;
  const payload = event.data.json();
  event.waitUntil(
    self.registration.showNotification(payload.notification.title, {
      body: payload.notification.body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: payload.notification.tag || 'tli-default'
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      if (clients.length > 0) {
        clients[0].focus();
      } else {
        self.clients.openWindow('./');
      }
    })
  );
});
