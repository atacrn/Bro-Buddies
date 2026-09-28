// Offline support for Bro Buddies. On first open, every file the app needs is
// saved on the phone; after that it opens instantly, with or without signal.
const CACHE = "bro-buddies-84ea89e7a7";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./chart.umd.js",
  "./fonts.css",
  "./archivo-latin-400-normal.woff2",
  "./archivo-latin-500-normal.woff2",
  "./archivo-latin-600-normal.woff2",
  "./archivo-latin-700-normal.woff2",
  "./archivo-latin-800-normal.woff2",
  "./archivo-black-latin-400-normal.woff2",
  "./archivo-narrow-latin-500-normal.woff2",
  "./archivo-narrow-latin-600-normal.woff2",
  "./archivo-narrow-latin-700-normal.woff2",
  "./ibm-plex-mono-latin-500-normal.woff2",
  "./ibm-plex-mono-latin-600-normal.woff2",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

// A new version clears out the old copy.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => (k.startsWith("chest-day-") || k.startsWith("bro-buddies-")) && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// The app's own files come from the phone first; anything else goes to the network.
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).catch(() =>
      req.mode === "navigate" ? caches.match("./index.html") : Response.error()))
  );
});
