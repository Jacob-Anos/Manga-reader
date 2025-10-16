// Zvýš verzi při každé změně, ať se update spolehlivě načte
const CACHE_NAME = 'manga-tracker-v11';

// Absolutní URL v rámci scope (funguje v podsložce /manga-tracker/)
const scope = new URL(self.registration.scope); // např. https://user.github.io/manga-tracker/
const shell = [
  new URL('./', scope).toString(),
  new URL('./index.html', scope).toString(),
  new URL('./manifest.webmanifest', scope).toString(),
  new URL('./icon-192.png', scope).toString(),
  new URL('./icon-512.png', scope).toString(),
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(shell))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Navigace: network-first (když nejde síť → index.html z cache)
// Ostatní: cache-first (když není v cache → stáhni a ulož)
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Safari někdy nevyplní mode === 'navigate', tak kryjeme i Accept: text/html
  const isNav = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isNav) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          // Pokud uživatel jde na /repo/ (bez index.html), uložíme pod /repo/index.html i pod /repo/
          caches.open(CACHE_NAME).then((c) => {
            c.put(new URL('./index.html', scope).toString(), copy.clone());
            c.put(new URL('./', scope).toString(), copy);
          });
          return res;
        })
        .catch(() =>
          // fallback na náš index ze scope (funguje online i offline)
          caches.match(new URL('./index.html', scope).toString())
        )
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // jen GET ukládej do cache
        if (req.method === 'GET' && res.status === 200 && res.type !== 'opaque') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});

