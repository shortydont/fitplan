// Minimal service worker - just pass everything through
self.addEventListener('install', function(e) {
  e.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    }).then(function() { return self.clients.claim(); })
  );
});
// No fetch handler - let browser handle everything natively
