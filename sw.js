var CACHE_SITE = 'LaunchPad-cache-v.1.0';
var urlsToCache = [
'/LaunchPad/offline.html',
'/LaunchPad/css/pwa.css',
'/LaunchPad/js/pwa.js',
'/LaunchPad/manifest.json',
'/LaunchPad/img/pwa/pwa-icon.svg',
'/LaunchPad/img/pwa/192-icon.png',
'/LaunchPad/img/pwa/512-icon.png',
'/LaunchPad/img/pwa/maskable-icon.png',
'/LaunchPad/img/pwa/screenshot-narrow.png',
'/LaunchPad/img/pwa/screenshot-wide.png'
];
self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_SITE)
        .then(function(cache) {
            return cache.addAll(urlsToCache, {cache: 'reload'});
        })
        );
});
self.addEventListener('activate', event => {
    var cacheKeeplist = [CACHE_SITE];
    self.clients.claim();
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('SW: Updated.');
                    return caches.delete(key);
                }
            }));
        })

        );
});
self.addEventListener("fetch", (event) => {
  if (event.request.mode === 'navigate' && event.request.method != 'POST') {
    event.respondWith(
        (async () => {
            try {
                const networkResponse = await fetch(event.request);
                return networkResponse;
            } catch (error) {
                const cacheResponse = await caches.match(event.request);
                if (cacheResponse) {
                    return cacheResponse;
                }
                const fallbackResponse = await caches.match('/LaunchPad/offline.html');
                if (fallbackResponse) {
                    return fallbackResponse;
                }
            }
        })()
        );
}
});