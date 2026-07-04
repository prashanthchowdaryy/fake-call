const CACHE = 'ringer-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['./index.html','./manifest.json']))
  );
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

// When the "incoming call" notification is tapped, bring the app to the
// foreground (or open it) so the ringer screen is what the person sees.
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) {
          client.postMessage({ type: 'RINGER_CATCHUP' });
          return client.focus();
        }
      }
      return self.clients.openWindow('./index.html');
    })
  );
});
