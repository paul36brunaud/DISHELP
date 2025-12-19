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

// Écoute l'événement d'installation
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Écoute l'événement d'activation
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

// Écoute l'événement de récupération des ressources
self.addEventListener("fetch", event => {
  // ✅ Ne gérer que les requêtes GET (correction nécessaire)
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // ✅ Ne mettre en cache que les réponses valides (correction nécessaire)
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache =>
            cache.put(event.request, clone)
          );
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(
          res => res || caches.match(`${PREFIX}/index.html`)
        )
      )
  );
});
