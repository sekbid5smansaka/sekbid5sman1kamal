/* Service worker: shell aplikasi di-cache (instan & jalan offline); panggilan API TIDAK pernah di-cache.
   Halaman utama (index.html) selalu diambil dari jaringan dulu supaya versi baru langsung terpakai; aset lain: cache dulu + segarkan di latar. */
var V = 'sb5-v8', Q = '?v=1.4.1', SHELL = ['./', 'index.html', 'css/style.css' + Q, 'js/config.js' + Q, 'js/core.js' + Q, 'js/publik.js' + Q, 'js/admin.js' + Q, 'js/ai-setup.js' + Q, 'js/kupu.js' + Q, 'img/hero.webp', 'img/logo.png', 'manifest.json'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(V).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== V; }).map(function (x) { return caches.delete(x); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url); if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  var nav = e.request.mode === 'navigate' || /\/$|index\.html$/.test(u.pathname);
  if (nav) { e.respondWith(fetch(e.request).then(function (r) { if (r.ok) { var cp = r.clone(); caches.open(V).then(function (c) { c.put(e.request, cp); }); } return r; }).catch(function () { return caches.match(e.request).then(function (h) { return h || caches.match('index.html'); }); })); return; }
  e.respondWith(caches.match(e.request).then(function (hit) {
    var net = fetch(e.request).then(function (r) { if (r.ok) { var cp = r.clone(); caches.open(V).then(function (c) { c.put(e.request, cp); }); } return r; }).catch(function () { return hit; });
    return hit || net;
  }));
});
