// Force cache bust - new version
var CACHE = ‘fitplan-v10-’ + Date.now();

self.addEventListener(‘install’, function(e) {
self.skipWaiting();
});

self.addEventListener(‘activate’, function(e) {
e.waitUntil(
caches.keys().then(function(keys) {
return Promise.all(keys.map(function(key) {
console.log(‘Deleting cache:’, key);
return caches.delete(key);
}));
}).then(function() {
return self.clients.claim();
})
);
});

// Network only - no caching until stable
self.addEventListener(‘fetch’, function(e) {
if (e.request.url.indexOf(‘supabase’) > -1 ||
e.request.url.indexOf(‘google’) > -1) return;
e.respondWith(fetch(e.request));
});
