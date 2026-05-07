// Evacora Service Worker
// 오프라인 기능 및 캐싱 전략

const CACHE_VERSION = 'evacora-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Service Worker 설치
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(CACHE_URLS).catch(() => {
        console.log('[SW] Some cache items failed, continuing...');
      });
    })
  );
  self.skipWaiting();
});

// Service Worker 활성화
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_VERSION) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 네트워크 요청 처리
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API 요청: 네트워크 우선, 실패 시 캐시
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 성공한 응답 캐시
          if (response.status === 200) {
            const cache = caches.open(CACHE_VERSION);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // 네트워크 실패 시 캐시에서 반환
          return caches.match(request).then((cached) => {
            if (cached) {
              console.log('[SW] Serving from cache:', request.url);
              return cached;
            }
            // 캐시도 없으면 오프라인 응답
            return new Response(
              JSON.stringify({ offline: true, message: 'Offline mode' }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  // 정적 자산: 캐시 우선
  if (
    request.method === 'GET' &&
    (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff|woff2)$/) ||
      url.pathname.includes('/manus-storage/'))
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const cache = caches.open(CACHE_VERSION);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        });
      })
    );
    return;
  }

  // 기타 요청: 네트워크 우선
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// 백그라운드 동기화 (오프라인 중 큐에 저장된 작업 실행)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-emergency-alerts') {
    event.waitUntil(syncEmergencyAlerts());
  }
});

async function syncEmergencyAlerts() {
  try {
    const db = await openDB();
    const pendingAlerts = await getAllFromStore(db, 'pendingAlerts');
    
    for (const alert of pendingAlerts) {
      try {
        await fetch('/api/trpc/notifications.sendSafetyCheck', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert),
        });
        await deleteFromStore(db, 'pendingAlerts', alert.id);
      } catch (error) {
        console.error('[SW] Failed to sync alert:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync error:', error);
  }
}

// IndexedDB 헬퍼
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('EvacoroDB', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingAlerts')) {
        db.createObjectStore('pendingAlerts', { keyPath: 'id' });
      }
    };
  });
}

function getAllFromStore(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function deleteFromStore(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
