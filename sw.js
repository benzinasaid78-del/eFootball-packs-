// Service Worker بسيط — يفعّل إمكانية تثبيت الموقع كتطبيق (PWA)
// لا يقوم بأي تخزين مؤقت إجباري حتى تبقى البيانات (Firebase/ImgBB) محدّثة دائمًا.

const CACHE_NAME = 'all-efootball-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// استراتيجية "الشبكة أولاً": نحاول الإنترنت أولاً حتى تبقى البيانات محدّثة،
// ونستخدم النسخة المخزّنة فقط كخطة بديلة عند انقطاع الإنترنت.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
