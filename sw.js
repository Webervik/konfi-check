// Konfi-Check Service Worker: immer zuerst das Netz, der Zwischenspeicher nur als Rückfall ohne Verbindung.
// So sieht niemand eine veraltete Fassung, und das Quiz läuft trotzdem im Funkloch.
const SPEICHER = 'konfi-check-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const anfrage = event.request;
  if (anfrage.method !== 'GET' || new URL(anfrage.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(anfrage)
      .then((antwort) => {
        if (antwort.ok) {
          const kopie = antwort.clone();
          caches.open(SPEICHER).then((c) => c.put(anfrage, kopie));
        }
        return antwort;
      })
      .catch(() => caches.match(anfrage, { ignoreSearch: true }))
  );
});
