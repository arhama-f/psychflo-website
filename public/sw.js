const CACHE = "psychflo-v1";
const OFFLINE_URLS = ["/pulse", "/offline"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(OFFLINE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);

  // Cache-first for static assets
  if (url.pathname.startsWith("/_next/static") || url.pathname.startsWith("/logo")) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
    return;
  }

  // Network-first for pages, fallback to cache
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("/pulse") || caches.match("/offline"))
    );
    return;
  }
});

// Push notification handler
self.addEventListener("push", e => {
  if (!e.data) return;
  const data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title || "PsychFlo", {
      body: data.body || "Time for your daily pulse check-in.",
      icon: "/logo.svg",
      badge: "/logo.svg",
      tag: "daily-pulse",
      renotify: true,
      data: { url: "/pulse" },
      actions: [
        { action: "checkin", title: "Check in now" },
        { action: "dismiss", title: "Later" },
      ],
    })
  );
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  if (e.action === "dismiss") return;
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(wins => {
      const win = wins.find(w => w.url.includes("/pulse"));
      if (win) return win.focus();
      return clients.openWindow("/pulse");
    })
  );
});
