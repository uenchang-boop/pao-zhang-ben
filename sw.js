// 汪帳本 Service Worker 🐾 — v1
const CACHE = 'woof-v1';
const STATIC = ['./', './index.html', './manifest.json'];

// ── Install: pre-cache app shell ──
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(STATIC.map(u => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ──
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: routing strategy ──
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Anthropic API — always network, never cache
  if (url.hostname === 'api.anthropic.com') {
    e.respondWith(fetch(e.request));
    return;
  }

  // Google Fonts — cache-first with network fallback
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200) {
            caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // App origin — stale-while-revalidate
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.open(CACHE).then(async cache => {
        const cached = await cache.match(e.request);
        const fetchPromise = fetch(e.request)
          .then(res => {
            if (res && res.status === 200 && res.type !== 'opaque') {
              cache.put(e.request, res.clone());
            }
            return res;
          })
          .catch(() => null);
        return cached || await fetchPromise;
      })
    );
  }
});
