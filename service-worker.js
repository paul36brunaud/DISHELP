const CACHE_NAME = "dishelp-cache-v3";
const PREFIX = self.location.pathname.replace(/\/service-worker\.js$/, "");

const ASSETS = [
  `${PREFIX}/`,
  `${PREFIX}/index.html`,
  `${PREFIX}/style.css`,
  `${PREFIX}/app.js`,
  `${PREFIX}/manifest.json`,
  `${PREFIX}/icons/icon-192.png`,
  `${PREFIX}/icons/icon-512.png`
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request) // toujours essayer internet d'abord
      .then(response => {
        // mettre à jour le cache (auto-update PWA)
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(
          res => res || caches.match(`${PREFIX}/index.html`)
        )
      )
  );
});
