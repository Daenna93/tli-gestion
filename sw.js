const CACHE_NAME = 'tli-v14-cache-v10';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ============================================================
// INSTALL — Forcer l'activation immédiate
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[SW v10] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW v10] Assets mis en cache');
      return cache.addAll(ASSETS);
    }).catch((err) => {
      console.log('[SW v10] Erreur cache initiale:', err);
      return caches.open(CACHE_NAME).then((cache) => cache.add('./index.html'));
    })
  );
  // Force l'activation immédiate (pas d'attente du close des onglets)
  self.skipWaiting();
});

// ============================================================
// ACTIVATE — Nettoyage + Reload forcé des clients
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[SW v10] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('[SW v10] Nettoyage des anciens caches...');
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW v10] Suppression cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW v10] Claiming clients...');
      return self.clients.claim();
    }).then(() => {
      // 🔥 Forcer le reload de TOUS les clients pour utiliser le nouveau SW
      console.log('[SW v10] Envoi reload aux clients...');
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => {
          console.log('[SW v10] Reload client:', client.url);
          client.postMessage({ type: 'SW_RELOAD', version: 10 });
          // Si le client écoute pas le message, on force navigate
          if (client.navigate) {
            client.navigate(client.url);
          }
        });
      });
    })
  );
});

// ============================================================
// FETCH — Network-First (préservé)
// ============================================================
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firebase') || event.request.url.includes('google')) return;

  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
      }
      return networkResponse;
    }).catch((err) => {
      console.log('[SW v10] Network failed, fallback cache:', event.request.url);
      return caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// ============================================================
// MESSAGE — Écouter les messages de l'app
// ============================================================
self.addEventListener('message', (event) => {
  console.log('[SW v10] Message reçu:', event.data);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: event.data.tag || 'tli-local',
      requireInteraction: event.data.requireInteraction || false,
      actions: event.data.actions || []
    });
  }
});

// ============================================================
// PUSH — Préservé (préparation FCM)
// ============================================================
// Importez firebase-messaging-sw.js si vous configurez FCM
// self.importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
// self.importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

self.addEventListener('push', (event) => {
  console.log('[SW v10] Push reçu:', event);
  if (!event.data) {
    console.log('[SW v10] Push sans data, ignoré');
    return;
  }
  try {
    const payload = event.data.json();
    console.log('[SW v10] Payload push:', payload);
    event.waitUntil(
      self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: './icon-192.png',
        badge: './icon-192.png',
        tag: payload.notification.tag || 'tli-default'
      })
    );
  } catch (e) {
    console.error('[SW v10] Erreur parsing push:', e);
  }
});

// ============================================================
// NOTIFICATION CLICK — Préservé
// ============================================================
self.addEventListener('notificationclick', (event) => {
  console.log('[SW v10] Notification click:', event.notification.tag);
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
