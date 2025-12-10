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
  self.skipWaiting(); // Le service worker prend immédiatement le contrôle
});

// Écoute l'événement d'activation
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)) // Supprime les anciens caches
      )
    )
  );
  self.clients.claim(); // Prendre le contrôle des clients immédiatement
});

// Écoute l'événement de récupération des ressources
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request) // Toujours essayer d'abord de récupérer depuis le réseau
      .then(response => {
        // Mettez à jour le cache avec la réponse récupérée
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() =>
        // Si la récupération échoue (par exemple hors ligne), servez les ressources du cache
        caches.match(event.request).then(
          res => res || caches.match(`${PREFIX}/index.html`) // Par défaut, servir index.html
        )
      )
  );
});
