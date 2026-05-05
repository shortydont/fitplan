// FitPlan Service Worker - Network First Strategy
const STATIC_CACHE = ‘fitplan-static-v3’;

const STATIC_ASSETS = [
‘./’,
‘./index.html’,
‘./manifest.json’,
‘./apple-touch-icon.png’,
‘./icon-192.png’,
‘./icon-512.png’
];

// INSTALL
self.addEventListener(‘install’, event => {
event.waitUntil(
caches.open(STATIC_CACHE)
.then(cache => cache.addAll(STATIC_ASSETS))
.then(() => self.skipWaiting())
);
});

// ACTIVATE - delete all old caches
self.addEventListener(‘activate’, event => {
event.waitUntil(
caches.keys()
.then(keys => Promise.all(
keys.filter(key => key !== STATIC_CACHE)
.map(key => caches.delete(key))
))
.then(() => self.clients.claim())
);
});

// FETCH - Network first, cache fallback
self.addEventListener(‘fetch’, event => {
const url = new URL(event.request.url);

// Never intercept non-GET or external services
if (event.request.method !== ‘GET’) return;
if (url.hostname !== self.location.hostname) {
event.respondWith(fetch(event.request));
return;
}

event.respondWith(
fetch(event.request)
.then(response => {
if (response && response.status === 200) {
const clone = response.clone();
caches.open(STATIC_CACHE).then(cache => cache.put(event.request, clone));
}
return response;
})
.catch(() =>
caches.match(event.request)
.then(cached => cached || caches.match(’./index.html’))
)
);
});