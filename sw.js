/* ==============================================================================
   BENGAL EXPLORERS — SERVICE WORKER (OFFLINE COMMUTER ENGINE)
   Architect: Bibek Mahata (bibek.cs)
   Version: 1.0.0
   ============================================================================== */

const CACHE_NAME = 'bengal-explorers-v5';
const DATA_CACHE_NAME = 'bengal-data-cache-v5';

// Critical Core Assets for Offline App Shell
const APP_SHELL = [
    '/',
    '/index.html',
    '/about.html',
    '/blog.html',
    '/contact.html',
    '/privacy.html',
    '/manifest.json',
    '/favicon.ico',
    '/favicon.png',
    '/icon-192.png',
    '/icon-512.png',
    '/apple-touch-icon.png',
    '/assets/bibek_mahata.jpg',
    '/assets/gangani/gangani-1.png',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
    'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Great+Vibes&family=Hind+Siliguri:wght@400;600;700&family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap'
];

// 1. INSTALL LIFECYCLE: Pre-cache App Shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Bengal SW] Pre-caching offline app shell');
            return cache.addAll(APP_SHELL).catch((err) => {
                console.warn('[Bengal SW] Non-critical asset failed to pre-cache:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// 2. ACTIVATE LIFECYCLE: Purge obsolete caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('[Bengal SW] Removing obsolete cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. FETCH LIFECYCLE: Intelligent Multi-Strategy Router
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // Skip non-GET requests and AdSense / Analytics telemetry
    if (event.request.method !== 'GET') return;
    if (requestUrl.hostname.includes('googleads') || 
        requestUrl.hostname.includes('googlesyndication') || 
        requestUrl.hostname.includes('adtrafficquality')) {
        return;
    }

    // Strategy A: Weather & Live APIs (Network First with Cache Fallback)
    if (requestUrl.hostname.includes('open-meteo.com') || requestUrl.hostname.includes('rss2json.com')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response.status === 200) {
                        const resClone = response.clone();
                        caches.open(DATA_CACHE_NAME).then((cache) => {
                            cache.put(event.request, resClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Strategy B: HTML Navigation (Network First for fresh content, Offline Cache Fallback)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response.status === 200) {
                        const resClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, resClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request).then((cachedResponse) => {
                        if (cachedResponse) return cachedResponse;
                        return caches.match('/index.html');
                    });
                })
        );
        return;
    }

    // Strategy C: Static Assets (Images, Fonts, Leaflet JS/CSS) — Stale-While-Revalidate / Cache First
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached version immediately, fetch and update in background
                fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse);
                        });
                    }
                }).catch(() => {});
                return cachedResponse;
            }

            // Not in cache, fetch from network and cache for next time
            return fetch(event.request).then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            });
        })
    );
});
