// Unregister all old service workers and clear all caches
self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    }).then(function() {
      return self.clients.matchAll({includeUncontrolled:true});
    }).then(function(clients) {
      clients.forEach(function(c) { c.navigate(c.url); });
      return self.clients.claim();
    })
  );
});
self.addEventListener('fetch', function(e) {
  e.respondWith(fetch(e.request.url, {cache:'no-store'}));
});
